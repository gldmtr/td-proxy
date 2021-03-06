const debug = require('debug')('request-handler');
const http = require('http');
const https = require('https');
const url = require('url');
const zlib = require('zlib');

const ee = require('./ee');
const modifyRequest = require('./modify-request');
const modifyResponse = require('./modify-response');

function collectStreamData(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => {
      const data = Buffer.concat(chunks);

      return resolve(data);
    });
    stream.on('error', reject);
  });
}

function handleRequest(req, res) {
  debug('Incoming request');

  const host = req.headers.host;
  const isEncrypted = !!req.connection.encrypted;
  const isNotHttp = !/^http:/.test(req.url);
  const protocol = (isEncrypted && isNotHttp) ? 'https' : 'http';
  const requestUrl = protocol === 'http' ? req.url : `${protocol}://${host}${req.url}`;
  const ph = url.parse(requestUrl);

  const options = {
    port: ph.port || protocol === 'https' ? 443 : 80,
    hostname: host,
    method: req.method,
    path: ph.path,
    headers: req.headers,
  };

  const requestModule = protocol === 'https' ? https : http;

  collectStreamData(req)
    .then((reqData) => modifyRequest(req, reqData))
    .then((reqData) => {
      options.headers['content-length'] = reqData.length;

      const proxyReq = requestModule.request(options);
      proxyReq.end(reqData);

      return new Promise((resolve, reject) => {
        proxyReq.on('response', (response) => {
          collectStreamData(response)
            .then((data) => modifyResponse(req, response, data))
            .then(result => resolve({ response, body: result }))
            .catch(reject);
        });
      });
    })
    .then(({ response, body }) => {
      debug(response.headers);

      response.headers['content-length'] = body.length;

      res.writeHead(response.statusCode, response.headers);
      res.end(body);
    })
    .catch(console.error);
}

module.exports = handleRequest;
