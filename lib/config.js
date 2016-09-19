const path = require('path');

const config = {
  certsDir: 'certs-cache',
  httpPort: 8080,
  httpsPort: 8081,

  appIconPath: path.resolve(__dirname, '..', 'icons', 'green.png'),
};

module.exports = config;

