const connectHandler = require('./lib/connect-handler');
const httpServer = require('./lib/http-server');
const httpsServer = require('./lib/https-server');
const config = require('./lib/config');

httpsServer.getInstance().then((server) => {
  server.listen(config.httpsPort);
});

httpServer.on('connect', connectHandler);
httpServer.listen(config.httpPort);

