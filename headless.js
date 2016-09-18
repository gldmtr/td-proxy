const config = require('./lib/config');
const httpServer = require('./lib/http-server');
const httpsServer = require('./lib/https-server');
const connectHandler = require('./lib/connect-handler');

httpsServer.getInstance().then((server) => {
  server.listen(config.httpsPort);
});

httpServer.on('connect', connectHandler);
httpServer.listen(config.httpPort);

