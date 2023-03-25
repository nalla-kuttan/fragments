// src/routes/api/post.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../../src/model/fragment');
const logger = require('../../logger');
const apiURL = process.env.API_URL || process;
//Creates a new fragment for the current (i.e., authenticated user)
module.exports = async (req, res) => {
  var supported = Fragment.isSupportedType(req.get('Content-Type'));
  if (supported) {
    try {
      ///generate a new fragment metadata record for the data
      const fragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });
      logger.info('saving fragment data');
      await fragment.setData(req.body);
      fragment.save();
      res.setHeader('Content-type', fragment.type);
      res.setHeader('Location', apiURL + '/v1/fragments/' + fragment.id);
      res.status(201).json(
        createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    } catch (error) {
      res.status(401).json(createErrorResponse(401, error));
    }
  } else {
    logger.warn('Not a supported fragment type');
    //if not a supported type send a HTTP 415 with an appropriate error message
    res.status(415).json(createErrorResponse(415, 'Not a supported fragment type'));
  }
};