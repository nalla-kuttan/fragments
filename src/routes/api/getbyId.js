// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const mime = require('mime-types');
const logger = require('../../logger');

//for conversions
const md = require('markdown-it')();
const { htmlToText } = require('html-to-text');
var removeMd = require('remove-markdown-and-html');
const sharp = require('sharp');

/*gets an authenticated user's fragment data (i.e., raw binary data) with the given id.*/
module.exports = async (req, res) => {
  var id = req.params.id;
  var user = req.user;

  //get extension that user requested, if no extension in request then extension = false
  var extension = mime.lookup(id);
  console.log('1 -- What is the extension(mime.lookup(id))?' + extension);

  //extracting id from request
  if (req.params.id.includes('.')) {
    id = req.params.id.substr(0, req.params.id.indexOf('.'));
    console.log('2 -- What is the id?' + id);
  }

  //retrieve fragment by id
  try {
    logger.info('getting fragment by id');
    const fragment = new Fragment(await Fragment.byId(user, id));
    logger.info('getting fragment data');
    const fragmentData = await fragment.getData();

    //get saved fragment type
    var type = fragment.mimeType;
    console.log('3 -- What is the type(fragment.mimeType)?' + type);
    var data;

    try {
      //valid conversions
      if (fragment.formats.includes(extension)) {
        //convert markdown to html
        if (extension === 'text/html' && type === 'text/markdown') {
          data = md.render(fragmentData.toString());
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'text/html');
          logger.info('returning converted fragment data');
          res.status(200).send(data.toString('base64'));
        }
        //convert markdown to plain text
        else if (extension === 'text/plain' && type === 'text/markdown') {
          data = removeMd(fragmentData.toString());
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'text/plain');
          logger.info('returning converted fragment data');
          res.status(200).send(data);
        }
        //convert html to plain text
        else if (extension === 'text/plain' && type === 'text/html') {
          data = htmlToText(fragmentData.toString(), {
            wordwrap: 130,
            selectors: [
              { selector: 'h1', options: { uppercase: false } },
              { selector: 'h2', options: { uppercase: false } },
              { selector: 'h3', options: { uppercase: false } },
              { selector: 'h4', options: { uppercase: false } },
              { selector: 'h5', options: { uppercase: false } },
              { selector: 'h6', options: { uppercase: false } },
            ],
          });
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'text/plain');
          logger.info('returning converted fragment data');
          res.status(200).send(data);
        }
        //convert json to plain text
        else if (extension === 'text/plain' && type === 'application/json') {
          data = fragmentData.toString();
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'text/plain');
          logger.info('returning converted fragment data');
          res.status(200).send(data);
        }

        //convert any image to any other image format
        else if (extension.startsWith('image/') && type.startsWith('image/')) {
          const convertTo = extension.substring(6);
          data = await sharp(fragmentData).toFormat(convertTo).toBuffer();
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', type);
          logger.info('returning converted fragment data');
          res.status(200).send(data.toString('base64'));
        }
        //if extension is the same as fragment type
        else if (extension === type) {
          //if getting an image
          if (type.startsWith('image/')) {
            res.status(200).send(fragmentData.toString('base64'));
          } else {
            logger.info('setting content-type as fragment type');
            res.setHeader('Content-type', type);
            logger.info('returning raw fragment data');
            res.status(200).send(fragmentData);
          }
        }
      } else if (extension == false) {
        //user did not add extension so just send that fragment
        logger.info('setting content-type as fragment type');
        res.setHeader('Content-type', type);
        logger.info('returning raw fragment data');

        //if getting an image
        if (type.startsWith('image/')) {
          res.status(200).send(fragmentData.toString('base64'));
        } else {
          res.status(200).send(fragmentData);
        }
      } else if (!fragment.formats.includes(extension)) {
        res.status(415).json(createErrorResponse(415, 'Not a supported fragment type'));
      }
      // logger.info('setting content-type as converted type');
      // res.setHeader('Content-type', type);
      // logger.info('returning converted fragment data');
      //  res.status(200).send(data);
    } catch (error) {
      res
        .status(415)
        .json(createErrorResponse(415, 'Cannot convert fragment to the required extension'));
    }
  } catch (error) {
    logger.warn('The ID provided does not represent a known fragment');
    res.status(404).json(createErrorResponse(404, 'The id does not represent a known fragment'));
  }
  // } else {
  //  res.status(415).json(createErrorResponse(415, 'Not a supported fragment type'));
  // }
};
