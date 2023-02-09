// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/*module.exports = (req, res) => {
  if (req.headers.authorization) {
    res.status(200).json(createSuccessResponse({
      status: 'ok',
      fragments: [],
    }));
  }
   else if (!req.headers.authorization) {
    res.status(401).json(createErrorResponse(401, 'Unauthorized'));
  }  
  };*/

  module.exports = async (req, res) => {
    try {
      res.status(200).json(
        createSuccessResponse({
          fragments: await Fragment.byUser(req.user, req.query.expand),
        })
      );
    } catch (error) {
      res.status(401).json(createErrorResponse(401, error));
    }
  };