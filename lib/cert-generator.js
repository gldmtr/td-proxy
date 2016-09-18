const forge = require('node-forge');

const defaultAttrs = [
    { name: 'countryName', value: 'CN' },
    { name: 'organizationName', value: 'AnyProxy' },
    { shortName: 'ST', value: 'SH' },
    { shortName: 'OU', value: 'AnyProxy SSL Proxy' },
];

function getKeysAndCert() {
  const keys = forge.pki.rsa.generateKeyPair(1024);
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notBefore.setFullYear(cert.validity.notBefore.getFullYear() - 10); // 10 years
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 10); // 10 years

  return {
    keys,
    cert,
  };
}

function generateRootCA() {
  const keysAndCert = getKeysAndCert();
  const keys = keysAndCert.keys;
  const cert = keysAndCert.cert;

  const attrs = defaultAttrs.concat([
    {
      name: 'commonName',
      value: 'AnyProxy',
    },
  ]);
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([
    { name: 'basicConstraints', cA: true },
  ]);

  cert.sign(keys.privateKey, forge.md.sha256.create());

  return {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert),
  };
  //
  // return pem;
}

function generateCertsForHostname(domain, rootCAConfig) {
  const keysAndCert = getKeysAndCert();
  const keys = keysAndCert.keys;
  const cert = keysAndCert.cert;

  const caCert = forge.pki.certificateFromPem(rootCAConfig.cert);
  const caKey = forge.pki.privateKeyFromPem(rootCAConfig.key);

  // issuer from CA
  cert.setIssuer(caCert.subject.attributes);

  const attrs = defaultAttrs.concat([
    {
      name: 'commonName',
      value: domain,
    },
  ]);
  cert.setSubject(attrs);
  cert.sign(caKey, forge.md.sha256.create());

  return {
    privateKey: forge.pki.privateKeyToPem(keys.privateKey),
    publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    certificate: forge.pki.certificateToPem(cert),
  };
}

module.exports.generateRootCA = generateRootCA;
module.exports.generateCertsForHostname = generateCertsForHostname;
