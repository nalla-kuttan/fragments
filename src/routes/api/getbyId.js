// src/routes/api/getbyId.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/*gets an authenticated user's fragment data (i.e., raw binary data) with the given id.*/
//only plain text support required at this point
module.exports = async (req, res) => {
  var id = req.params.id;
  var user = req.user;

  if (req.params.id.includes('.')) {
    id = req.params.id.substr(0, req.params.id.indexOf('.'));
    var extension = req.params.id.substr(req.params.id.indexOf('.'));
  }

  if (!extension || extension == '.txt') {
    //retrieve fragment by id
    try {
      logger.info('getting fragment by id');
      const fragment = await Fragment.byId(user, id);
      logger.info('getting fragment data');
      const fragmentData = await fragment.getData();
      var type = fragment.type;
      logger.info('setting content-type as fragment type');
      res.setHeader('Content-type', type);
      logger.info('returning raw fragment data');
      res.status(200).send(fragmentData);
    } catch (error) {
      logger.warn('The ID provided does not represent a known fragment');
      res.status(404).json(createErrorResponse(404, 'The id does not represent a known fragment'));
    }
  } else {
    res.status(415).json(createErrorResponse(415, 'Not a supported fragment type'));
  }
};
