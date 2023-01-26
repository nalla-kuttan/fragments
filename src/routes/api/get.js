// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */


module.exports = (req, res) => {
  if (req.headers.authorization) {
    res.status(200).json({
      status: 'ok',
      fragments: [],
    });
  }
   else if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
      return;
  }  
  };