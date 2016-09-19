const ee = require('./ee');
const config = require('./config');
const httpServer = require('./http-server');
const httpsServer = require('./https-server');
const connectHandler = require('./connect-handler');

class Proxy {
  constructor({ httpPort, httpsPort } = {}) {
    this.httpPort = httpPort || config.httpPort;
    this.httpsPort = httpsPort || config.httpsPort;

    this.on = ee.on.bind(ee);
    this.emit = ee.emit.bind(ee);
  }

  start() {
    httpsServer.getInstance().then((server) => {
      this.httpsServer = server;
      server.listen(this.httpsPort);
    });

    this.httpServer = httpServer;

    httpServer.on('connect', connectHandler);
    httpServer.listen(this.httpPort);
  }

  get status() {
    return {
      http: this.httpServer.listening,
      https: this.httpsServer.listening,
    };
  }
}

module.exports = Proxy;
