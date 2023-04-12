//PUT /fragments:id can update an authenticated user's existing fragment
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../../src/model/fragment');
const logger = require('../../logger');
//Allows the authenticated user to update (i.e., replace) the data for their existing fragment with the specified id.

module.exports = async (req, res) => {
  var id = req.params.id;
  var user = req.user;

  try {
    //If no such fragment exists with the given id, returns an HTTP 404 with an appropriate error message.
    logger.info('getting fragment by id');
    const fragment = await Fragment.byId(user, id);

    //If the Content-Type of the request does not match the existing fragment's type, returns an HTTP 400 with an appropriate error message. A fragment's type can not be changed after it is created.
    if (fragment.type === req.get('Content-Type')) {
      //The entire request body is used to update the fragment's data, replacing the original value.
      await fragment.setData(req.body);
      //The successful response includes an HTTP 200 as well as updated fragment metadata
      res.status(200).json(
        createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    } else {
      res
        .status(400)
        .json(createErrorResponse(400, "The type does not match the fragment's saved type"));
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
