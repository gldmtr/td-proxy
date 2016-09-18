const fs = require('fs');
const path = require('path');

const kitten = fs.readFileSync(path.resolve(__dirname, '..', 'images/kitten-007.jpg'))
  .toString('base64');

function modifyScreenshotRequest(req, body) {
  Object.keys(body).forEach((key) => {
    const val = body[key];

    if (val instanceof Array) {
      delete val[1];
    }
  });

  body.file = [kitten];
  body.num_screens = ['1'];

  const keyStrokes = Math.random(200) + 500;
  const mouseMovements = Math.random(200) + 500;

  body.keystrokes = [keyStrokes.toString()];
  body.mousemovements = [mouseMovements.toString()];

  return body;
}

module.exports = modifyScreenshotRequest;
