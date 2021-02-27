const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs')

let mainWindow;
let defaultSettings = require('./data/settings.json');
let defaultPpl = require('./data/people.json');
function createWindow() {
  var settings = {};
  var ppl = [];
  try {
    let configPath = path.join(app.getPath('userData'), 'settings.json');
    console.log('Loading config from: ' + configPath);
    if (!fileExists(configPath)) {
      //create a default one.
      settings = defaultSettings;
      fs.writeFile(
        configPath, 
        JSON.stringify(settings), 
        function(err) { if (err) console.error(err); }
      );
    } else {
      settings = require(configPath);
    }
    var pplPath = path.join(app.getPath('userData'), 'people.json');
    console.log('Loading people from:' + pplPath);
    if (!fileExists(pplPath)) {
      //create a default one.
      ppl = defaultPpl;
      fs.writeFile(
        pplPath, 
        JSON.stringify(ppl), 
        function(err) { if (err) console.error(err); }
      );
    }

  } catch (err) {
    // handle your file not found (or other error) here
    console.log(err);
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
    icon: __dirname + 'icon.ico',
    titleBarStyle: 'hidden',
    frame: false,
  });

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

function fileExists(path) {
  let r = false;
  try {
    if (fs.existsSync(path)) {
      return true;
    }
  } catch (err) {
    console.error(err)
  }
  return r;
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

