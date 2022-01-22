// @ts-check
const env = require('./env');
const tmi = require('tmi.js');

/**
 * @typedef {import("./pages/obs-overlays/types").TwitchChat} TwitchChat
 * @typedef {import("./pages/obs-overlays/types").TwitchChatSocketListenerEvents} TwitchChatSocketListenerEvents
 * @typedef {import("./pages/obs-overlays/types").TwitchChatSocketListenerEventCallback} TwitchChatSocketListenerEventCallback
 * @typedef {import("./pages/obs-overlays/types").EventCommands} EventCommands
 * @typedef {import("./pages/obs-overlays/types").EventCommandCallbackData} EventCommandCallbackData
 * @typedef {import("./pages/obs-overlays/types").Socket} Socket
 * @typedef {import("./pages/obs-overlays/types").ChatUserRoles} ChatUserRoles
 * @typedef {import("./pages/obs-overlays/types").ChatUserFeatures} ChatUserFeatures
 * @typedef {import("./pages/obs-overlays/types").ChatCommandChatter} ChatCommandChatter
 */

/** @type {TwitchChatSocketListenerEvents} */
const socketListeners = {
  // [socket.id]: { [command-name]: commandCallback }
}

/** @type {TwitchChat} */
const twitchChat = {
  initialized: false,
  channelName: null,
  ignoredChatters: [],
  hasIdentity: false,
  client: null, // tmi Client

  init(config = {}, commands = []) {
    if (this.initialized) {
      return
    }

    this.channelName = config.channelName || env.twitch_channel_name
    this.ignoredChatters = config.ignoredChatters || []
    console.log("this.channelName", this.channelName, env)

    const identity = {
      username: env.twitch_bot_user_name,
      password: env.twitch_bot_oauth_token
    };
    this.hasIdentity = Boolean(identity.username && identity.password)

    this.client = new tmi.Client({
      identity: this.hasIdentity ? identity : undefined,
      channels: [this.channelName]
    });

    this.client.connect();

    console.log("TMI listening to Twitch Chat...")

    this.client.on('message', (channel, tags, message, self) => {
      const displayName = tags['display-name'];
      const userName = tags.username;
      const userId = tags['user-id'];
      if (this.ignoredChatters && this.ignoredChatters.includes(userName)) {
        return
      }
      console.log(`${userName}: ${message}`);
      console.log({
        channel,
        tags,
        message,
        self
      })

      const cleanedMessage = message.trim()
      const isCommand = cleanedMessage.startsWith("!")
      
      // ignore non "!command" messages
      if (!isCommand) {
        return
      }

      // message examples:
      //   !fortune
      //   !sound yoink
      //   !s yoink (alias)
      //   !yoink -> !sound yoink (command alias)
      const [rawCommand, ...args] = cleanedMessage.slice(1).split(" ")
      const command = rawCommand.toLowerCase()
      const commandConfig = commands.find(c => command === c.commandName || (c.aliases && c.aliases.includes(command)))

      // running a command that doesn't exist
      if (!commandConfig) {
        console.log("Invalid Command:", message)
        return
      }

      /** @type {ChatUserRoles} */
      const roles = {
        broadcaster: tags.badges?.broadcaster === "1",
        moderator: Boolean(tags.mod),
        vip: tags.badges?.vip === "1",
        editor: false,
        subscriber: tags.badges?.subscriber === "1",
        follower: tags.badges?.follower === "1",
        any: true
      }
      /** @type {ChatUserFeatures} */
      const features = {
        firstMessage: Boolean(tags['first-msg']),
        highlightedMessage: tags['msg-id'] === "highlighted-message"
      }
      /** @type {ChatCommandChatter} */
      const chatter = {
        userId,
        userName,
        displayName,
        roles,
        features
      }
      
      console.log('command:', {
        command,
        commandConfig,
        args,
        message,
        chatter
      })

      // access permissions based on roles
      if (!commandConfig.allowedRoles && !roles.broadcaster) {
        // default required role is broadcaster
        return
      }
      const commandIsAllowed = commandConfig.allowedRoles.find(role => roles.hasOwnProperty(role) && Boolean(roles[role]));
      if (!commandIsAllowed) {
        // did not meet access permissions required
        console.log("Invalid Command Permissions:", chatter, message)
        return
      }

      // check for shortcut commands
      // shortcut commands fake a message from same user
      if (commandConfig && commandConfig.shortcuts && Array.isArray(commandConfig.shortcuts)) {
        commandConfig.shortcuts.map(shortcut => {
          console.log(`(${command}) triggering shortcut:`, shortcut);
          this.client.emit('message', channel, tags, shortcut, self);
        })
      }

      // trigger command
      for (const [socketId, listeners] of Object.entries(socketListeners)) {
        if (listeners.hasOwnProperty(command) && typeof listeners[command] === "function") {
          listeners[command]({
            channel,
            commandName: command,
            args,
            chatter
          })
        }
      }
    });

    this.initialized = true;
  },
  emitChatCommandsOnSocket: (commands, socket, twitchChatConfig) => {
    // start listening for Twitch Chat messages now
    twitchChat.init(twitchChatConfig, commands);

    // listen for sending chat bot messages
    socket.on('sendBotMessage', (/** @type {string} **/ message) => {
      console.log("sendBotMessage received:", {
        message
      })
      twitchChat.client.opts.channels.map(channel => {
        twitchChat.client.say(channel, message)
      })
    })

    const commandsWithSocket = {}

    commands.map(({ commandName, aliases }) => {
      console.log(socket.id, "listening for chatCommand:", `!${commandName}`);

      /** @type {TwitchChatSocketListenerEventCallback} */
      const commandEmitter = (commandData) => {
        socket.emit(`!${commandName}`, commandData);
        console.log(`${socket.id} received chatCommand:`, `!${commandName}`, commandData);
      }

      commandsWithSocket[commandName] = commandEmitter

      // redirect aliases
      if (aliases && aliases.length) {
        aliases.forEach(commandAlias => {
          console.log(socket.id, "listening for chatCommand:", `!${commandAlias} -> !${commandName}`);
          commandsWithSocket[commandAlias] = commandEmitter
        })
      }
    })

    socketListeners[socket.id] = commandsWithSocket
  }
};

module.exports = twitchChat