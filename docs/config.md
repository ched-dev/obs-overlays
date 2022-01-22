# Configuration

This application is highly customizable with simple JavaScript configuration. Here you will find all of the options we have built-in and how to use them.

**Table of Contents:**  
- [Default Config](#default-config)
  - [`config/config.mjs`](#configconfigmjs)
- [Listener & Command Config](#listener--command-config)
  - [Client Command Callback](#client-command-callback)
    - [Simple Commands](#simple-commands)
    - [Alias Commands](#alias-commands)
    - [Shortcut Commands](#shortcut-commands)
    - [Argument Commands](#argument-commands)
  - [`config/eventCommands.mjs`](#configeventcommandsmjs)
  - [`config/chatCommands.mjs`](#configchatcommandsmjs)
- [Integration Config](#integration-config)
  - [`config/templates.mjs`](#configtemplatesmjs)
  - [`config/sounds.mjs`](#configsoundsmjs)
  - [`config/twitchChat.mjs`](#configtwitchchatmjs)

## Default Config

This app is pre-configured to my needs for the time being. Feel free to fork and use your own configuration. In the future we hope to make configuration even simpler with JSON which could allow upgrade paths to receive new features.

Configuration is stored at `src/pages/obs-overlays/*`.

---

### `config/config.mjs`

The main configuration that holds some loose items and imports additional configuration from `config/*`.

**Required options:**  
- `NOTIFICATION_AUTO_CLOSE_TIMEOUT` is stored in milliseconds
- `DEFAULT_NOTIFICATION_TEMPLATE` from `index.html` (defaults to `"message-template"`)
- `DEFAULT_NOTIFICATION_SOUND` from `config/sourceSounds.mjs` names (defaults to `"wow"`)
- `DEFAULT_SOUND_CLIP_VOLUME` is used in Sound Player as a fallback if `config/soundSources.mjs` entry does not contain a `volume` (defaults to `0.8`)

---

### `config/eventCommands.mjs`

This file stores all the event listeners from TAU's `websocket_event.event_type`.

Some sample events are `channel-follow`, `channel-subscribe`, `channel-raid`, etc. To see a full list, visit [Twitch Events Specs page](./specs/index.md#twitch-events).

Each event has respective data so we use `eventCommandCallback(eventData)` to allow you to pull data as needed. You can see the format of `eventData` under the "Websocket Stream" in the [TAU Dashboard]()

**Example tauListener config**  
```js
{
  eventName: "channel-follow",
  eventCommandCallback: (eventData) => ({
    clientCommand: "renderTemplate",
    args: [{
      title: "New Follower",
      userName: eventData.user_name,
      action: "follwed",
      sound: "coin",
      timeout: 7 * 1000,
      template: "user-action-template"
    }]
  })
}
```

**Additional configuration available:**  
- `sound` which maps to a `config.soundSources.*` name
- `timeout` which controls the auto-close of a notification (a millisecond value `7 * 1000`, or `false` to leave open)
- `template` which matches the id of an `index.html` `<script>` template (defaults to `message-template`)
- the remaining properties are passed to template HTML and available as `{propName}` (e.g. `{userName} just {action}!`)

All of the `eventCommands` will be emitted to the if you listen for it. We don't emit events if you don't have a listener for it.

---

### `config/chatCommands.mjs`

This file holds all [chat commands](./overview.md#chat-command) we are listening for. A chat command is triggered via Twitch Chat using a message like `!clap` or with args `!brb Bathroom Break`.

Commands can have specific traits to them, such as [simple](#simple-commands) (minimum props required), [alias](#alias-commands), [shortcuts](#shortcut-commands), or provide [arguments](#argument-commands).

---

#### Simple Commands

We start with a simple command as the bare bones for triggering things when a chat command is used.

**Example of simple command:**  
```js
{
  commandName: "sounds",
  allowedRoles: ["any"],
  chatCommandCallback: () => ({
    clientCommand: "renderSoundButtons"
  })
}
```

**Simple Command Props (available in all type of commands):**  
- `commandName` is the name of the command, minus the `!` (e.g. `!sound wow` would be `commandName: "sound"`)
- `allowedRoles` are the chatter roles required for this command to run. A chatter can run a command if they match _ANY_ of the roles. Available roles in order of exclusivity:
  - `broadcaster` the user who is broadcasting. We use this as default to prevent exposing commands if `allowedRoles` not provided.
  - `moderator` is a moderator in the channel
  - `vip` is a vip in the channel
  - `subscriber` is someone who is currently subscribed in the channel
  - `any` is any viewer who can send a chat
- `chatCommandCallback()` is used to format our data and configuration for calling [client commands](./overview.md#client-command). Available client commands are:
  - `renderSoundButtons` renders available sound names on screen, has no args
  - `clearScreen` clears all content on the screen, has no args
  - `playSound` plays a sound by name (e.g. `args: ["soundName"]`)
  - `renderTemplate` renders a matching `index.html` `<script>` template by id (e.g. `args: ["template-id"]`)
  - `sendBotMessage` sends a message to chat from your bot account (e.g. `args: ["Message to send"]`)
  - `ignore` allows you to skip running a `clientCommand` for this entry. Alternatively, you can return a falsy value from `chatCommandCallback()`.
  - Invalid command names and args will be ignored
  - See [Argument Commands](#argument-commands) for args info on `chatCommandCallback()`

---

#### Alias Commands

We define an alias command as a command with the `aliases` array which allows this command to be called with a different `commandName`. 

**Example of alias command:**  
```js
{
  commandName: "sound",
  aliases: ["s"],
  allowedRoles: ["any"],
  chatCommandCallback: ({ commandName, args }) => ({
    clientCommand: "playSound",
    args
  })
}
```

**Alias Command Props:**  
- `aliases` should be an array of alias strings (e.g. `aliases: ["s"]` allows `!s soundName` to rewrite to `!sound soundName`). Any arguments passed will be passed along to main `commandName`.

---

#### Shortcut Commands

We define a shortcut command as a command with the `shortcuts` property which triggers additional commands you've defined.

**Example of shortcut command:**  
```js
{
  commandName: "clap",
  allowedRoles: ["any"],
  shortcuts: ["!s clap"]
}
```

**Shortcut Command Props:**  
- Inherits all [simple command props](#simple-commands)
- `shortcuts` allow us to run other commands. It works as if a user was to send a message with the shortcut (e.g. `ched_dev: !sound wow`) so permissions of the shortcut will be honored by their command (e.g. `commandName: "sound"`)
- can still use `chatCommandCallback()` if desired

---

#### Argument Commands

We define an argument command as a command that passes arguments on to the client command. You can pass args through as they were given, or generate your own args based on passed in args.

**Example of argument command:**  
```js
{
  commandName: "sound",
  aliases: ["s"],
  allowedRoles: ["any"],
  chatCommandCallback: ({ commandName, args }) => ({
    clientCommand: "playSound",
    args
  })
}
```

**Argument Command Props:**  
- Inherits props from all other types of commands
- `chatCommandCallback()` should return `args` that are passed on to the [client command](./overview.md#client-command). They are spread on as arguments (e.g. `args: ["one", "two"]` will become `playSound("one", "two")`).

**Example of `chatCommandCallback()` with dynamic args:**  
```js
{
  commandName: "brb",
  allowedRoles: ["broadcaster"],
  chatCommandCallback: ({ commandName, args }) => ({
    clientCommand: "renderTemplate",
    args: [
      {
        template: "message-template",
        message: `BRB ~ ${args.join(" ") || "Feeding the cat"}`,
        sound: "brb",
        timeout: false
      }
    ]
  })
}
```

**`chatCommandCallback()` arguments:**  
- `commandInfo` is the only argument passed to `chatCommandCallback()` and it's an object with the following properties:
  - `commandName` is the name of the command (e.g. `sound`, `s`, `brb`). This could be different than the `commandName` on the top level because it could be one of the `aliasCommands`.
  - `args` is the remaining values split on an empty string (e.g. `!brb Bathroom Break` -> `args: ["Bathroom", "Break"]` and `!sound wow` -> `args: ["wow"]`). You can use the args to allow subcommands or combine back to one value (e.g. `args.join(" ")` -> `"Bathroom Break"`).
  - `channelName` is the name of the channel this is running in (e.g. `#ched_dev`)
  - `chatter` is aggregated information about the chatter. Available properties include:
    - `roles`
      - see roles
    - `features`
      - `firstMessage` is true if it's the users first message in this channel
      - `highlightedMessage` is whether the message was redeemed with "Highlight My Message"

---

### `config/soundSources.mjs`

This file holds all sounds that can be played with the [Sound Player](./overview.md#sound-player). The key of the object is the sound name. The sound name is what matches with the `!sound soundName` command.

**Example of sound source config:**  
```js
'airhorn': {
  audioSource: 'sounds/air-horn.mp3',
  volume: 0.2
}
```

**Sound source props:**  
- the key name (e.g. `'airhorn'`) is how we reference the `soundName`. It can be formatted how you please (e.g. `air-horn`, `air_horn`, `airHorn`) but cannot contain spaces and is case sensitive.
- `audioSource` is the path to the sound file. We store all sounds in `sounds/*`.
- `volume` is the volume level to set for this specific sound. A value of `0 ... 1` (e.g. `0.3`, `1.0`). If none is provided we use a default value from [`config/config.mjs`](#configconfigmjs). We use this to level out volume of loud vs quiet clips, then you can set the global volume level in OBS audio output.

---

### `config/twitchChat.mjs`

This file holds additional configuration related to tmi.js, but we don't support additional tmi.js configuration yet.