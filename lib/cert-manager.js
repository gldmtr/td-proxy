const exec = require('child_process').exec;
const debug = require('debug')('cert-manager');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const certGenerator = require('./cert-generator');

const certDir = path.resolve(__dirname, '..', config.certsDir);
const rootCAcrtFilePath = path.resolve(certDir, 'rootCA.crt');
const rootCAkeyFilePath = path.resolve(certDir, 'rootCA.key');

if (!fs.existsSync(certDir)) {
  try {
    fs.mkdirSync(certDir, '0777');
  } catch (e) {
    debug('===========');
    debug(`failed to create cert dir ,please create one by yourself - ${certDir}`);
    debug('this error will not block main thread unless you use https-related features in anyproxy');
    debug('===========');
  }
}

let cacheRootCACrtFileContent;
let cacheRootCAKeyFileContent;
let rootCAExists = false;

function isRootCAFileExists() {
  return (fs.existsSync(rootCAcrtFilePath) && fs.existsSync(rootCAkeyFilePath));
}

function clearCerts() {
  return new Promise((resolve, reject) => {
    exec('rm -f *.key *.csr *.crt *.srl', { cwd: certDir }, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function getRootCAFilePath() {
  if (isRootCAFileExists()) {
    return rootCAcrtFilePath;
  }

  return '';
}

function generateRootCA() {
  function startGenerating() {
    // clear old certs
    return clearCerts()
    .then(() => {
      debug('temp certs cleared');

      const rootCA = certGenerator.generateRootCA();
      fs.writeFileSync(rootCAkeyFilePath, rootCA.privateKey);
      fs.writeFileSync(rootCAcrtFilePath, rootCA.certificate);

      debug('rootCA generated');
      debug(`please trust the rootCA.crt in ${certDir}`);
      debug('or you may get it via anyproxy webinterface');

      exec('open .', { cwd: certDir });
    });
  }

  if (isRootCAFileExists()) {
    debug(`rootCA exists at ${certDir}`);
    process.exit(0);
  }

  return startGenerating();
}

function checkRootCA() {
  if (rootCAExists) {
    return Promise.resolve();
  }

  if (!isRootCAFileExists()) {
    return generateRootCA();
  }

  rootCAExists = true;
  return Promise.resolve();
}

function getCertificate(hostname) {
  return checkRootCA()
  .then(() => {
    const keyFile = path.join(certDir, `${hostname}.key`);
    const crtFile = path.join(certDir, `${hostname}.crt`);

    if (!cacheRootCACrtFileContent || !cacheRootCAKeyFileContent) {
      cacheRootCACrtFileContent = fs.readFileSync(rootCAcrtFilePath, { encoding: 'utf8' });
      cacheRootCAKeyFileContent = fs.readFileSync(rootCAkeyFilePath, { encoding: 'utf8' });
    }

    if (!fs.existsSync(keyFile) || !fs.existsSync(crtFile)) {
      const result = certGenerator.generateCertsForHostname(hostname, {
        cert: cacheRootCACrtFileContent,
        key: cacheRootCAKeyFileContent,
      });

      fs.writeFileSync(keyFile, result.privateKey);
      fs.writeFileSync(crtFile, result.certificate);
      return {
        key: result.privateKey,
        crt: result.certificate,
      };
    }

    return {
      key: fs.readFileSync(keyFile),
      crt: fs.readFileSync(crtFile),
    };
  });
}

module.exports.getRootCAFilePath = getRootCAFilePath;
module.exports.generateRootCA = generateRootCA;
module.exports.getCertificate = getCertificate;
module.exports.clearCerts = clearCerts;
module.exports.isRootCAFileExists = isRootCAFileExists;
