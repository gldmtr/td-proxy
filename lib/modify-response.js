const debug = require('debug')('modify-request');
const url = require('url');
const qs = require('qs');
const zlib = require('zlib');

const modifyPopupSettings = require('./modify-popup-settings');

function modifyResponse(req, res, resData) {
  console.log('modify response');
  console.log(res.headers);

  const urlParams = url.parse(req.url);
  const qsParams = qs.parse(urlParams.query);

  if (!qsParams.method) {
    return Promise.resolve(resData);
  }

  return Promise.resolve(resData)
    .then((data) => {
      if (res.headers['content-encoding'] === 'gzip') {
        return zlib.unzipSync(data);
      }

      return resData;
    })
    .then((data) => data.toString())
    .then((data) => {
      if (qsParams.method === 'get_popup_settings') {
        return modifyPopupSettings(req, res, data);
      }

      return data;
    })
    .then((data) => {
      console.log('unzipped', data.toString());
      return zlib.gzipSync(data);
      // const modifiedDataString = qs.stringify(data);
      //
      // return modifiedDataString;
    })
    .catch((e) => {
      console.log('modifyResponse error', e);
      return resData;
    });
}

module.exports = modifyResponse;

