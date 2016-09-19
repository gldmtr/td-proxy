const { app, Tray, BrowserWindow } = require('electron');
const path = require('path');

const config = require('./lib/config');
const Proxy = require('./lib/proxy');

const proxy = new Proxy();
proxy.start();

let appIcon = null;
let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  appIcon = new Tray(config.appIconPath);

  proxy.on('prescreenshot', () => {
    appIcon.setImage(path.join(__dirname, 'icons', 'red.png'));
  });
  proxy.on('postscreenshot', () => {
    appIcon.setImage(path.join(__dirname, 'icons', 'green.png'));
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

