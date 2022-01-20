# Developer Docs

This documentation targets a developer trying to add their own features, commands, sounds, etc. to this codebase.

**Table of Contents:**  
- [Technologies](#technologies)
  - [Twitch API Unifier (TAU)](#twitch-api-unifier-tau)
  - [tmi.js (tmi)](#tmijs-tmi)
  - [express](#express)
- [How it works](#how-it-works)
  - [Data Flow Diagram](#data-flow-diagram)
  - [Config Files](#config-files)
- [Terminology / Vocabulary](#terminology--vocabulary)
  - [General](#general)
    - [Client](#client)
    - [Server](#server)
    - [Chat Bot](#chat-bot)
  - [Domain Specific Data](#domain-specific-data)
    - [Event Sub](#event-command)
    - [Chat Command](#chat-command)
    - [Client Actions](#client-command)
    - [Sound Player](#sound-player)


## Technologies

### Twitch API Unifier (TAU)
A dockerized admin interface for receiving Twitch Events via EventSub (Twitch API). We use it to listen for follows, subscriptions, channel redemptions, etc. It emits all of its events on Websockets which we consume in our [express](#express) app. See their [project page](https://github.com/Team-TAU/tau) for more info. For chat we use [tmi.js](#tmijs-tmi).

### tmi.js (tmi)
A chat connection client for reading and sending messages in Twitch Chat. We use it to listen for [chat commands](#chat-command) and send messages in chat with our chat bot (on roadmap). See their [project page](https://tmijs.com/) for more info.

### express
The node.js server framework used to run our [server](#server). It is responsible for serving and rendering our [client](#client) as well as receiving events via a socket.io websocket connection. See their [project page](https://expressjs.com/) for more info.

## How it works

### Data Flow Diagram

![TBD App Diagram]()

This diagram shows how all of our code is connected. We don't have a database, but data flow through the application is plentiful.

Understanding this flow will simplify development greatly. "Winging it" is possible too.

### Config Files

The app aims to be highly configurable without needing to write code. We give you some common [client commands](#client-command) (e.g. `playSound`, `renderSoundButtons`, `renderTemplate`, `clearScreen`), but you can create your own functionality if you know how to code in JavaScript.

## Terminology / Vocabulary

We think it's helpful to review terminology and vocabulary used in this application to give you an idea of how things interact.

---

### General

---

#### Client
When we mention the client, we are referring to the browser client application. This is the contents of `src/pages/obs-overlays` and any code that will be run inside the browser: socket.io client listeners, rendering templates, playing sounds, etc.

#### Server
When we mention the server, we are referring to the node.js express application in the `src/*.js` files. The server could also refer to [TAU](#twitch-api-unifier-tau), but we do not edit code in that project.

---

### Domain Specific Data

---

#### Event Command
An event command is one of the follow, subscribe, redeem, etc. events triggered by TAU. All event commands are stored in `obs-overlays/config/eventCommands.mjs`. A list of available client commands can be found in the [Simple Commands](./config.md#simple-commands) documentation.

#### Chat Command
A chat command refers to commands sent via Twitch Chat (e.g. `!clap` or `!brb Bathroom Break`). They can be sent by any viewer in chat, but might not always be acted upon unless they have access permissions and it is a valid command. All chat commands are stored in `obs-overlays/config/chatCommands.mjs`.

#### Client Command
A client command is a function that can be triggered inside the [client application](#client). These commands can be triggered via [chat commands](#chat-command) or [event commands](#event-command). A list of available client commands can be found in the [Client Commands](./config.md#client-commands) documentation.

#### Sound Player
The sound player handles playing of all sounds in the client application. It cannot be used server side. The OBS browser will play sounds that are subsequently captured on stream. You should turn on "monitoring and output" to hear sounds as well. The common browsers (Chrome, Firefox, etc.) require you to interact with the page before a sound can be played. We pull all our sound sources from `obs-overlays/config/soundSources.mjs`. Sound files live in `obs-overlays/sounds/*`.