# Guides

Information on setting up, configuring, and extending this application.

**Table of Contents:**  
- [Setup](#setup)
  - [Environment Requirements](#environment-requirements)
  - [Running the application](#running-the-application)
  - [Loading as OBS Browser Source](#loading-as-obs-browser-source)
  - [Debugging in Browser](#debugging-in-browser)
- [Customization](#customization)
  - [Listening for Twitch Events](#listening-for-twitch-events)
  - [Listening for Chat Commands](#listening-for-chat-commands)
  - [Configuring a Client Command](#configuring-a-client-command)
  - [Creating a Custom Client Command](#creating-a-custom-client-command)
  - [Creating & Connecting a Chat Bot](#creating--connecting-a-chat-bot)
  - [Adding a Sound Clip](#adding-a-sound-clip)


## Setup

### Environment Requirements

This application requires you to have [node.js](https://nodejs.org/) and `npm` installed to run a local server on your computer.

This project relies on having a [Twitch API Unifier (TAU)](https://github.com/Team-TAU/tau) server setup. [Docker](https://www.docker.com/) is a requirement for TAU setup. Please follow their instructions first, then setup this project to consume Twitch Events.

---

### Running the application

For first install,

```
npm install
```

Next, add an `.env` file with required info. All Twitch App settings (client_id, client_secret) should have been added to TAU and are not needed in our project.

```
# Express Port
PORT=4343
# tmi.js Settings
TWITCH_CHANNEL_NAME=twitch_channel_name
# Twitch Bot Settings (get OAuth token from https://twitchapps.com/tmi/)
TWITCH_BOT_USER_NAME=cheds_bot
TWITCH_BOT_OAUTH_TOKEN=oauth:xxxx
```

confirm the TAU server is up and running, then run the express server and client with:

```
npm start
// or if you want to restart on changes
npm run dev
```

Your OBS Overlays will be running at `http://localhost:4343/obs-overlays` which you can view in browser to debug, or setup inside OBS as a browser source when dev complete.

---

## Loading as OBS Browser Source

With your application running, in OBS under the Sources panel, add a Browser Source with your desired name.

Paste your site URL (e.g. `http://localhost:4343/obs-overlays`) and set the Width & Height to match your stream resolution (probably 1920 x 1080).

Check "Control audio via OBS" so you can see the audio source in your mixer. Click the settings icon (cog wheel) and choose "Advanced Audio Properties". Set the Audio Monitoring field to "Monitor and Output" so you can hear it through OBS.

We've found a volume adjustment might be needed to prevent sounds from being too loud. Try playing with the Volume % for the Browser in Advanced Audio Properties to get the right level. We set ours to 40% (-8.0db).

Now trigger an Event in TAU or send a Chat Command to test it!

> Pro Tip: Any time you change code you need to refresh the browser source in OBS to see latest changes. If you select the Source, a shortcut refresh button will show in the toolbar above the Sources panel.



## Customization

You can configure the application to listen to the [Twitch Events](./overview.md#twitch-events) and [Chat Commands](./overview.md#chat-command) you desire. The listeners return a [Client Command](./overview.md#client-command) which triggers actions inside the Client. We've included the common actions, but you are free to build your own with JavaScript.
