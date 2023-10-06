const { app, BrowserWindow } = require('electron')
const { ChatClient } = require('@twurple/chat');
const { RefreshableAuthProvider, StaticAuthProvider } = require('@twurple/auth');
const { promises } = require('fs');

const tokenFile = './tokens.json';

async function chatServer(window) {
  const channel = process.env.CHANNEL;
  const clientId = process.env.CLIENTID;
  const clientSecret = process.env.CLIENTSECRET;

  const tokens = await promises.readFile(tokenFile, 'utf8');
  const tokenData = JSON.parse(tokens);
  const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(clientId, tokenData.accessToken),
    {
      clientSecret,
      refreshToken: tokenData.refreshToken,
      expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
      onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
        const newTokenData = {
          accessToken,
          refreshToken,
          expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
        };
        await promises.writeFile(tokenFile, JSON.stringify(newTokenData, null, 4), 'utf8')
      }
    }
  );

  const chatClient = new ChatClient({
    authProvider: authProvider,
    channels: [channel],
  });

  await chatClient.connect();

  chatClient.onMessage((channel, user, message) => {
    if (message === '!ping') {
      window.webContents.send('ping', `pong to ${user}`);
    }
  });

  chatClient.onSub((channel, user) => {
    window.webContents.send('sub', `Thanks to @${user} for subscribing to the channel!`);
  });

  chatClient.onResub((channel, user, subInfo) => {
    window.webContents.send('resub', `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`);
  });

  chatClient.onSubGift((channel, user, subInfo) => {
    window.webContents.send('giftsub', `Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`);
  });
}

let win;

async function createWin() {
  require('dotenv').config()
  win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html').then(() => console.log('Loaded index.html'))
  await chatServer(win).then(() => console.log('Connected to chat server'))
}

app.on('ready', () => {
    app.setAppUserModelId('TWITCH.COM/DIGGITYSC');
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
