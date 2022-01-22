# OBS Overlays Overview

This documentation targets a developer trying to add their own features, commands, sounds, etc. to this codebase.

**Table of Contents:**  
- [Technologies](#technologies)
  - [Twitch API Unifier (TAU)](#twitch-api-unifier-tau)
  - [tmi.js (tmi)](#tmijs-tmi)
  - [express](#express)
- [How it works](#how-it-works)
  - [Config Files](#config-files)
  - [Data Flow Diagram](#data-flow-diagram)
- [Terminology / Vocabulary](#terminology--vocabulary)
  - [General](#general)
    - [Client](#client)
    - [Server](#server)
    - [Chat Bot](#chat-bot)
  - [Domain Specific Data](#domain-specific-data)
    - [TAU Dashboard](#tau-dashboard)
    - [Twitch Events](#twitch-events)
    - [Chat Messages](#chat-messages)
    - [Listener](#listener)
    - [Event Command](#event-command)
    - [Chat Command](#chat-command)
    - [Client Command](#client-command)
    - [Sound Player](#sound-player)


## Technologies

### Twitch API Unifier (TAU)
A dockerized admin interface for receiving Twitch Events via Twitch API (EventSub & PubSub). We use it to listen for follows, subscriptions, channel redemptions, etc. It emits all of its events on Websockets which we consume in our [express](#express) app. See the [TAU project page](https://github.com/Team-TAU/tau) for more info. For chat we use [tmi.js](#tmijs-tmi).

You can access the TAU Dashboard to update event subscriptions using your local URL [localhost:5353](http://localhost:5353/).

### tmi.js (tmi)
A chat connection client for reading and sending messages in Twitch Chat. We use it to listen for [Chad Commands](#chat-command) and to send chat bot messages. See the [tmi.js project page](https://tmijs.com/) for more info, but we'll do the connection for you automatically.

### express
The node.js server framework used to run our [server](#server). It is responsible for serving and rendering our [client](#client) as well as receiving events via a socket.io websocket connection. See the [express project page](https://expressjs.com/) for more info, but you won't need to make any changes in express.

## How it works

### Config Files

The app aims to be highly configurable without needing to write custom code. We give you some common [Client Commands](#client-command) to run actions in the client when a listener triggers. You can combine multiple Client Commands for one action, or create your own functionality if you know how to code in JavaScript.

You can follow our [Configuration Guide](./guides.md#customization) or get down to the details in our [Config Docs](./config.md#config).

### Data Flow Diagram

If it helps you, we've thrown together some data flow diagrams, but you don't need to know these details in order to use the application.

![TBD App Diagram]()

This diagram shows how all of our code is connected. We don't have a database, but data flow through the application is plentiful.

Understanding this flow will simplify custom development, but "winging it" is possible too.

## Terminology / Vocabulary

We think it's helpful to review terminology and vocabulary used in this application to give you an idea of how things interact.

---

### General

---

#### Client
When we mention the client, we are referring to the browser client application. This is the contents of `src/pages/obs-overlays/*` and any code that will be run inside the browser: socket.io client listeners, rendering templates, playing sounds, etc.

This code is written using JavaScript ESModules and runs directly in the browser (not recompiled). We've added Typescript support via JSDoc.

Follow the [Running the Application Guide](./guides.md#running-the-application) to get the client up and running.

#### Server
When we mention the server, we are referring to the node.js express application in the `src/*.js` files. The server could also refer to [TAU](#twitch-api-unifier-tau), but we do not need to edit code TAU.

Follow the [Running the Application Guide](./guides.md#running-the-application) to get the server up and running.

Follow the [TAU project page](https://github.com/Team-TAU/tau) to get the TAU server up and running.

---

### Domain Specific Data

---

#### TAU Dashboard
The TAU Dashboard is the admin interface for managing subscriptions to [Twitch Events](#twitch-events). We need to enable subscriptions in the dashboard before we can receive them in our [Server](#server). 

#### Twitch Events
Twitch Events come from the Twitch API, ping our TAU Dashboard, then forward along to our [Server](#server) if we are subscribed to them. We setup our [Event Commands](#event-command) to listen for events and send actions to the client with [Client Commands](#client-command). See a [list of available Twitch Events](#twitch-events) in our specs. We need to enable subscriptions in the dashboard before we can receive them in our Server.

#### Chat Messages
Chat Messages are the messages any user sends through the Twitch Chat. If the chat message matches one of our [Chat Commands](#chat-command), we will pass along the resulting [Client Command](#client-command) to the client.

#### Listener
A listener is what we use to listen for [Twitch Events](#twitch-events) via [Event Commands](#event-command), or [Twitch Chat Messages]() via [Chat Commands](#chat-command).

Listeners are simplified JavaScript code that can be copy/pasted with some minor changes, or allow advanced configuration when your needs grow.

#### Event Command
An event command is one of the follow, subscribe, redeem, etc. events triggered by [TAU](#twitch-api-unifier-tau). All event commands are stored in `obs-overlays/config/eventCommands.mjs`. The callback returns a [Client Command](#client-command) to run.

#### Chat Command
A chat command refers to commands sent via Twitch Chat (e.g. `!clap` or `!brb Bathroom Break`). They can be sent by any viewer in chat, but might not always be acted upon unless they have access permissions and it is a valid command. All chat command listeners are stored in `obs-overlays/config/chatCommands.mjs`.

#### Client Command
A client command is a function (render template, play sound, etc.) that can be triggered inside the [Client](#client). These commands can be triggered via [Chat Commands](#chat-command) or [Event Commands](#event-command). A list of available client commands can be found in the [Client Commands Spec](./specs/index.md#client-commands).

#### Sound Player
The sound player handles playing of all sounds in the client application. It cannot be used server side. The OBS browser will play sounds that are subsequently captured on stream. You should turn on "Monitoring and Output" to hear sounds as well. The common browsers (Chrome, Firefox, etc.) require you to interact with the page before a sound can be played. We pull all our sound sources from `obs-overlays/config/soundSources.mjs`. Sound files live in `obs-overlays/sounds/*`.