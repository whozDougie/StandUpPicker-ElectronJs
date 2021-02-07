const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  var settings = {};
  try {
    settings = require('./data/settings.json');
    console.log(settings);
  } catch (err) {
    // handle your file not found (or other error) here
  }

  mainWindow = new BrowserWindow({
    width: settings.window.width,//470,
    height: settings.window.height,//220,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
    },
    titleBarStyle: "hidden",
    frame: false
  })

  
  mainWindow.removeMenu();
  mainWindow.loadFile('index.html');
  mainWindow.setAlwaysOnTop(true, 1);
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
