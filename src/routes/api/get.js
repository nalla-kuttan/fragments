// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */

const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = (req, res) => {
  if (req.headers.authorization) {
    res.status(200).json(createSuccessResponse({
      status: 'ok',
      fragments: [],
    }));
  }
   else if (!req.headers.authorization) {
    res.status(401).json(createErrorResponse(401, 'Unauthorized'));
  }  
  };