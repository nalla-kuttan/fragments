// src/routes/api/getById.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/*Allows the authenticated user to get (i.e., read) the metadata for one of their existing fragments with the specified id. 
 If no such fragment exists, returns an HTTP 404 with an appropriate error message. */
module.exports = async (req, res) => {
  var id = req.params.id;
  var user = req.user;

  try {
    logger.info('getting fragment info by id');
    const fragment = await Fragment.byId(user, id);
    logger.info('returning fragment metadata');
    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
        fragments: fragment,
      })
    );
  } catch (error) {
    logger.warn('No fragment exists for the id specified');
    res.status(404).json(createErrorResponse(404, error));
  }
};
