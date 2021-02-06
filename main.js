const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isMac = process.platform === 'darwin'
//https://www.electronjs.org/docs/api/menu
const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
      {
        label: 'Help',
        click: async () => {
          const { shell } = require('electron')
          await shell.openItem('/help/readme.txt')
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      // { role: 'reload' },
      // { role: 'forceReload' },
      // { role: 'toggleDevTools' },
      // { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      // { type: 'separator' },
      // { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  // {
  //   label: 'Window',
  //   submenu: [
  //     { role: 'minimize' },
  //     { role: 'zoom' },
  //     ...(isMac ? [
  //       { type: 'separator' },
  //       { role: 'front' },
  //       { type: 'separator' },
  //       { role: 'window' }
  //     ] : [
  //       { role: 'close' }
  //     ])
  //   ]
  // },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

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

  //win.removeMenu();
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
