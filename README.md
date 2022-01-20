# OBS Overlays

This local application allows you to display overlays in OBS using a browser source. 

## Features

- Listening to Twitch EventSub events via [TAU](https://github.com/Team-TAU/tau) admin interface (e.g. Follows, Subscriptions, Channel Point Redemptions, etc.)
- Sends all Twitch events to a browser client application with custom templates to render on screen
- Uses [tmi.js](https://tmijs.com/) to allow listening for chat commands (e.g. `!sounds`, `!ask Tabs or spaces?`) with access permissions
- Include your own [Client Commands](./docs/overview.md#client-command) to run custom code when a command is triggered
- Easily customized through [config files](./docs/config.md#obs-overlays-configuration)

## Documentation

- [Config Docs](./docs/config.md#obs-overlays-configuration) for configuring this app
- [Developer Docs](./docs/overview.md#developer-docs) for setting up this app

## Setup: Running as an OBS Browser Source

This setup requires you to have [node.js](https://nodejs.org/) installed to run a local server on your computer. [Docker](https://www.docker.com/) is also required to run TAU.

> This project relies on having a [Twitch API Unifier (TAU)](https://github.com/Team-TAU/tau) server setup. Please follow their instructions first, then setup this project to consume events.

For first install,

```
npm install
```

Next, add an `.env` file with TAU info. All Twitch App settings should have been added to TAU and are not needed in our project.

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

your OBS overlays will be running at `http://localhost:4343/` which you can view in browser to debug, or setup inside OBS as a browser source when dev complete.

## Praise

I have tested getting Twitch events from EventSub and PubSub with several libraries ([Twurple](https://twurple.js.org/), [TwitchPS](https://www.npmjs.com/package/twitchps), [TwitchWebhook](https://www.npmjs.com/package/twitch-webhook) \[deprecated\]) and none of them would work correctly.

[TAU](https://github.com/Team-TAU/tau) is the holy grail that takes the pain away. I would recommend it to all who want Twitch event notifications.

If you just want some chat integration, you could use [tmi.js](https://tmijs.com/).

## License

This project is licensed under [MIT](LICENSE) and is free for you to fork and make your own.