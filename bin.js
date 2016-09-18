const { httpServer, httpsServer, connectHandler, config } = require('.');

httpsServer.getInstance().then((server) => {
  server.listen(config.httpsPort);
});

httpServer.on('connect', connectHandler);
httpServer.listen(config.httpPort);
