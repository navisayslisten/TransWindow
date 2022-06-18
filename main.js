const { app, BrowserWindow } = require('electron')
const { chatServer } = require('./chatWrapper.js')

let win;

async function createWin() {
  require('dotenv').config()
  win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html').then(() => console.log('index loaded'))
  await chatServer();
}

app.on('ready', () => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('TWITCH.COM/DIGGITYSC')
  }
})

app.whenReady().then(async () => {
  await createWin();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'win32') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWin()
  }
})
