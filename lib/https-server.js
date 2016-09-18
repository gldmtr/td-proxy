const debug = require('debug')('https-server');
const https = require('https');
const tls = require('tls');

const certMgr = require('./cert-manager');
const handler = require('./request-handler');

function SNIPrepareCert(serverName, callback) {
  debug(`SNIPrepareCert for ${serverName}`);

  certMgr.getCertificate(serverName)
    .then(({ key, crt: cert }) => {
      debug(`SNI key for ${serverName}`, key.toString());
      debug(`SNI cert for ${serverName}`, cert.toString());

      const ctx = tls.createSecureContext({ key, cert });
      return ctx;
    })
    .then((ctx) => {
      callback(null, ctx);
    })
    .catch((error) => {
      debug('SNI error', error);
      callback(error);
    });
}

const serverPromise = certMgr.getCertificate('internal_https_server')
  .then(({ key, crt: cert }) => {
    const server = https.createServer({
      SNICallback: SNIPrepareCert,
      key,
      cert,
    }, handler);
    return server;
  });

module.exports = {
  getInstance() {
    return serverPromise;
  },
};

