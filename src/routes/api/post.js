// src/routes/api/post.js
const { createSuccessResponse, createErrorResponse } = require('../../response');

const { Fragment } = require('../../../src/model/fragment');

const contentType = require('content-type');

const logger = require('../../logger');

const apiURL = process.env.API_URL || process;

//Creates a new fragment for the current (i.e., authenticated user)
module.exports = async (req, res) => {
  const { type } = contentType.parse(req);
  var supported = Fragment.isSupportedType(type);

  if (supported) {
    ///generate a new fragment metadata record for the data
    const fragment = new Fragment({ ownerId: req.user, type: type });
    //console.log(fragment);
    //both the data and metadata are stored
    logger.info('saving fragment data');
    await fragment.setData(req.body);
    fragment.save();

    logger.info('getting saved fragment by id');
    //retrieve saved fragment
    const savedFragment = await Fragment.byId(fragment.ownerId, fragment.id);

    res.setHeader('Location', apiURL + '/v1/fragments/' + savedFragment.id);

    res.status(201).json(createSuccessResponse(savedFragment));
  } else {
    logger.warn('Not a supported fragment type');
    //if not a supported type send a HTTP 415 with an appropriate error message
    res.status(415).json(createErrorResponse(415, 'Not a supported fragment type'));
  }
};
