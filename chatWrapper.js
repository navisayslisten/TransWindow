const { ChatClient} = require('twitch-chat-client');
const { RefreshableAuthProvider, StaticAuthProvider } = require('twitch-auth');
const { showNotification } = require('./renderer');
const { promises } = require('fs');

const tokenFile = './tokens.json';

async function chatServer() {
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

  const chatClient = new ChatClient(authProvider, {
    channels: [channel],
  });

  await chatClient.connect();

  chatClient.onMessage((channel, user, message) => {
    if (message === '!ping') {
      showNotification(channel, `pong to ${user}`);
    } else if (message === '!dice') {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      showNotification(channel, `@${user} rolled a ${diceRoll}`)
    }
  });

  chatClient.onSub((channel, user) => {
    showNotification(channel, `Thanks to @${user} for subscribing to the channel!`);
  });

  chatClient.onResub((channel, user, subInfo) => {
    showNotification(channel, `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`);
  });

  chatClient.onSubGift((channel, user, subInfo) => {
    showNotification(channel, `Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`);
  });
}

exports.chatServer = chatServer;
