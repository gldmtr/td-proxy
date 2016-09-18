const url = require('url');
const qs = require('qs');

const modifyTime = require('./modify-time');
const modifyTimeuse = require('./modify-timeuse');
const modifyScreenshot = require('./modify-screenshot');

function modifyRequest(req, reqData) {
  const dataObj = qs.parse(reqData.toString());

  const urlParams = url.parse(req.url);
  const qsParams = qs.parse(urlParams.query);

  return Promise.resolve(dataObj)
    .then((data) => {
      if (qsParams.method && qsParams.method === 'upload_screen') {
        return modifyScreenshot(req, data);
      }

      return data;
    })
    .then((data) => {
      if (qsParams.method && qsParams.method === 'upload_time') {
        return modifyTime(req, data);
      }

      return data;
    })
    .then((data) => {
      if (qsParams.method && qsParams.method === 'upload_timeuse') {
        return modifyTimeuse(req, data);
      }

      return data;
    })
    .then((data) => {
      const modifiedDataString = qs.stringify(data);

      return modifiedDataString;
    });
}

module.exports = modifyRequest;
