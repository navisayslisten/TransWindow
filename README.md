# TransWindow

The future is now but you can't even see it

## SETUP
Create a .env file with the following variables:
```
CHANNEL=diggitysc
CLIENTID=
CLIENTSECRET=
ACCESS_TOKEN=
REFRESHTOKEN=
EXPIRYTIMESTAMP=0
```

Follow the instructions on the Twitch API documentation to get your access token.

- https://dev.twitch.tv/console/apps - Set up a new application
- https://d-fischer.github.io/twitch-chat-client/docs/examples/basic-bot.html - basic auth setup instructions

Could use yarn, but I found yarn kinda sucks for debugging the Electron app.

So `yarn install` or `npm install` the app and then `yarn start` or `npm start`.
