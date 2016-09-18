const { app, BrowserWindow } = require('electron');

const config = require('./lib/config');
const httpServer = require('./lib/http-server');
const httpsServer = require('./lib/https-server');
const connectHandler = require('./lib/connect-handler');

httpsServer.getInstance().then((server) => {
  server.listen(config.httpsPort);
});

httpServer.on('connect', connectHandler);
httpServer.listen(config.httpPort);

let mainWindow;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
