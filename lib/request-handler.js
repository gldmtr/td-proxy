const debug = require('debug')('request-handler');
const http = require('http');
const https = require('https');
const url = require('url');
const qs = require('qs');

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

  const requestChunks = [];
  const proxyRequest = requestModule.request(options);

  req.on('data', (chunk) => {
    requestChunks.push(chunk);
  });
  req.on('end', () => {
    const requestData = Buffer.concat(requestChunks);

    debug('Send data to server', requestData.toString(), qs.parse(requestData.toString()));

    proxyRequest.write(requestData, 'binary');
    proxyRequest.end();
  });

  proxyRequest.on('response', (proxyResponse) => {
    proxyResponse.on('data', (chunk) => {
      res.write(chunk, 'binary');
    });
    proxyResponse.on('end', () => res.end());
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
  });
}

module.exports = handleRequest;
