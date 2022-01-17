This project relies on having a [Twitch API Unifier (TAU)](https://github.com/Team-TAU/tau) setup. Please follow their instructions first, then setup this project to consume events.

# OBS Overlays Setup

For first install,

```
npm install
```

add `.env` file with TAU info. All Twitch App settings should have been added to TAU and are not needed here.

```
# Express Port
PORT=4343
# tmi.js Settings
TWITCH_USER_NAME=twitch_user_name
# TAU Settings
TAU_PORT=5353
TAU_AUTH_TOKEN=grabTokenFromTauDashboardUserPage
```

then run with

```
npm start
```

your OBS overlays will be running at `http://localhost:4343/` which you can view in browser to debug, or setup inside OBS as a Browser Source when dev complete.

## Praise

I have tested getting Twitch events from EventSub and PubSub with several libraries ([Twurple](https://twurple.js.org/), [TwitchPS](https://www.npmjs.com/package/twitchps), [TwitchWebhook](https://www.npmjs.com/package/twitch-webhook) \[deprecated\]) and none of them would work correctly.

TAU is the holy grail that takes the pain away. I would recommend it to all who want Twitch event notifications.

If you just want some chat integration, you could use [tmi.js](https://tmijs.com/)

## License

This project is licensed under MIT and is free for you to fork and make your own.