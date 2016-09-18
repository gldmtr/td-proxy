const http = require('http');

const handler = require('./request-handler');

const server = http.createServer(handler);

module.exports = server;
