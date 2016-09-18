const { app, BrowserWindow } = require('electron');

const { httpServer, httpsServer, connectHandler, config } = require('..');

console.log(process.versions);

app.on('ready', () => {
  const win = new BrowserWindow({});
  win.loadURL(`file://${__dirname}/app.html`);
  win.webContents.once('did-finish-load', () => {
    httpsServer.getInstance().then((server) => {
      server.listen(config.httpsPort);
    });

    httpServer.on('connect', connectHandler);
    httpServer.listen(config.httpPort);
  });
});
