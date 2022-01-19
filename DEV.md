# Developer Docs

This documentation targets a developer trying to add features, commands, sounds, etc. to this codebase.

**Table of Contents:**  
- [Technologies](#technologies)
  - [Twitch API Unifier (TAU)](#twitch-api-unifier-tau)
  - [tmi.js (tmi)](#tmijs-tmi)
  - [express](#express)
- [How it works](#how-it-works)
  - [Config Files](#config-files)
- [Terminology / Vocabulary](#terminology--vocabulary)
  - [General](#general)
    - [Client](#client)
    - [Server](#server)
  - [Domain Specific Data](#domain-specific-data)
    - [Chat Command](#chat-command)
    - [Client Command](#client-command)
    - [Sound Player](#sound-player)


## Technologies

### Twitch API Unifier (TAU)
A dockerized admin interface for receiving Twitch Events via EventSub (Twitch API). We use it to listen for follows, subscriptions, channel redemptions, etc. It emits all of its events on Websockets which we consume in our express app. For chat we use tmi.js.

### tmi.js (tmi)
A chat connection client for reading and sending messages in Twitch Chat. We use it to listen for [chat commands](#chat-command) and send messages in chat with our chat bot.

### express
The node.js server framework used to run our [server](#server). It is responsible for serving and rendering our [client](#client) via a socket.io websocket connection.

## How it works

![TBD App Diagram]()

This diagram shows how all of our code is connected. We don't have a database, but data flow through the application is plentiful.

Understanding this flow will simplify development greatly. "Winging it" is possible too.

### Config Files

The app aims to be highly configurable without needing to write code. We give you some common [client commands](#client-command) (e.g. Notification, Message, Clear), but you can extend the functionality if you know how to code in JavaScript.

## Terminology / Vocabulary

We think it's helpful to review terminology and vocabulary used in this application to give you an idea of how things interact.

### General

#### Client
When we mention the client, we are referring to the browser client application. This is the contents of `src/pages/obs-overlays` and any code that will be run inside the browser: socket.io client listeners, rendering templates, etc.

#### Server
When we mention the server, we are referring to the node.js express application in the `src/*.js` files. The server could also refer to TAU, but we do not edit code there.

### Domain Specific Data

#### Chat Command
A chat command refers to commands sent via Twitch Chat. They can be sent by any viewer in chat, but might not always be acted upon unless they have access permissions and it is a valid command.

#### Client Command
A client command is a function that can be triggered inside the [client application](#client). These commands are triggered via [chat commands](#chat-command).

#### Sound Player
The sound player handles playing of all sounds in the client application. It cannot be used server side. The OBS browser will play sounds that are captured on stream. You should turn on "monitoring and output" to hear sounds as well. The common browsers (Chrome, Firefox, etc.) require you to interact with the page before a sound can be played. We pull all our sound sources from `obs-overlays/config/soundSources.mjs`. Sound files live in `obs-overlays/sounds/*`.