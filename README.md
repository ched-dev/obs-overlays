# Setup

For first install,

```
npm install
```

add `.env` file with Twitch App info

```
PORT=4343
TWITCH_USER_ID=261129104
SECRET=alongstringoftext
CLIENT_ID=twitch_app_client_id
CLIENT_SECRET=twitch_app_client_secret
# Generate ACCESS_TOKEN and REFRESH_TOKEN with
# https://twitchtokengenerator.com/
ACCESS_TOKEN=twitch_app_access_token
REFRESH_TOKEN=twitch_app_refresh_token
```

then run with

```
npm start
```

visit `http://localhost:8000/` and you will see

```
@twurple/eventsub is listening here
```

## Running Alternate Connections

We've tested a few different libraries. Test them with their own commands:

```
node src/twurple.js
node src/twitchPS.js
node src/twitchWebhook.js
```