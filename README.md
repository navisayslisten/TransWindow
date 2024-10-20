# TransWindow

The future is now, but you can't even see it!

... It's a transparent window demo in Electron for a friend. Useful for streaming purposes. Use as you like.

## SETUP
Create a .env file with the following variables:
```
CHANNEL=justyourchannelnamenotURL
USERID=12345678
CLIENTID=somesecretid
CLIENTSECRET=someclientid
ACCESS_TOKEN=someaccesstoken
REFRESHTOKEN=somerefreshtoken
EXPIRYTIMESTAMP=0
```

Follow the instructions on the Twitch API documentation to get your access token.

- https://dev.twitch.tv/console/apps - Set up a new application
- https://d-fischer.github.io/twitch-chat-client/docs/examples/basic-bot.html - basic auth setup instructions

Once your access and refresh token values are set in the .env file, please also set them in the tokens.json file

`yarn install`

`yarn start`
