const fs = require('fs');
const path = require('path');

const ee = require('./ee');

const kitten = fs.readFileSync(path.resolve(__dirname, '..', 'images/kitten-007.jpg'))
  .toString('base64');

function modifyScreenshotRequest(req, body) {
  ee.emit('prescreenshot', body);

  return Promise.resolve(body)
    .then((data) => new Promise((resolve) => {
      setTimeout(resolve.bind(resolve, data), 5000);
    }))
    .then((data) => {
      Object.keys(data).forEach((key) => {
        const val = data[key];

        if (val instanceof Array) {
          delete val[1];
        }
      });

      data.file = [kitten];
      data.num_screens = ['1'];

      const keyStrokes = Math.random(200) + 500;
      const mouseMovements = Math.random(200) + 500;

      data.keystrokes = [keyStrokes.toString()];
      data.mousemovements = [mouseMovements.toString()];

      ee.emit('postscreenshot');

      return data;
    });
}

module.exports = modifyScreenshotRequest;
