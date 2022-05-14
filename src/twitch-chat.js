// @ts-check
const env = require('./env');
const tmi = require('tmi.js');
const validator = require('validator');

/**
 * @typedef {import("./pages/obs-overlays/types").TwitchChat} TwitchChat
 * @typedef {import("./pages/obs-overlays/types").EventCommands} EventCommands
 * @typedef {import("./pages/obs-overlays/types").EventCommandCallbackData} EventCommandCallbackData
 * @typedef {import("./pages/obs-overlays/types").Socket} Socket
 * @typedef {import("./pages/obs-overlays/types").ChatUserRoles} ChatUserRoles
 * @typedef {import("./pages/obs-overlays/types").ChatUserFeatures} ChatUserFeatures
 * @typedef {import("./pages/obs-overlays/types").ChatCommandChatter} ChatCommandChatter
 * @typedef {import("./pages/obs-overlays/types").ChatCommandCallbackData} ChatCommandCallbackData
 * @typedef {import("./pages/obs-overlays/types").ChatMessageCallbackData} ChatMessageCallbackData
 */

/** @type {TwitchChat} */
const twitchChat = {
  channelName: null,
  ignoredChatters: [],
  hasIdentity: false,
  client: null, // tmi Client
  eventNames: {
    chatMessage: 'chat-message',
    chatCommand: 'chat-command'
  },

  init(config = {}, commands = []) {
    if (this.client) {
      return
    }

    this.channelName = config.channelName || env.twitch_channel_name
    this.ignoredChatters = config.ignoredChatters || []

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
      const displayName = tags['display-name'] || tags.username;
      const userName = tags.username;
      const userId = tags['user-id'];
      if (this.ignoredChatters && (this.ignoredChatters.includes(displayName) || this.ignoredChatters.includes(userName))) {
        return
      }

      const trimmedMessage = message.trim()
      const isCommand = trimmedMessage.startsWith("!")
      /** @type {ChatUserRoles} */
      const roles = {
        broadcaster: tags.badges?.broadcaster === "1",
        moderator: Boolean(tags.mod),
        vip: tags.badges?.vip === "1",
        editor: false,
        subscriber: tags.subscriber,
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
        features,
        isBot: [userName, displayName].includes(config.botName)
      }
      /**
       * @type {ChatMessageCallbackData}
       */
      const chatData = {
        chatter,
        message: trimmedMessage,
        isCommand
      }

      // emit chat message
      this.client.emit(this.eventNames.chatMessage, chatData)
      
      // ignore non "!command" messages from this point on
      if (!isCommand) {
        return
      }

      // message examples:
      //   !fortune
      //   !sound yoink
      //   !s yoink (alias)
      //   !yoink -> !sound yoink (command alias)
      const [rawCommand, ...args] = trimmedMessage.slice(1).split(" ")
      const command = rawCommand.toLowerCase()
      const commandConfig = commands.find(c => command === c.commandName || (c.aliases && c.aliases.includes(command)))

      // running a command that doesn't exist
      if (!commandConfig) {
        console.log("Ignored Command:", message)
        return
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

      /**
       * @type {ChatCommandCallbackData}
       */
      const commandData = {
        channelName: channel,
        commandName: command,
        commandConfig,
        args,
        chatter
      };

      // emit chat command
      this.client.emit(this.eventNames.chatCommand, commandData)
    });
  },
  onChatMessage(callback) {
    this.client?.on(this.eventNames.chatMessage, callback);
  },
  onChatCommand(callback) {
    this.client?.on(this.eventNames.chatCommand, callback);
  },
  emitChatCommandsOnSocket: (commands, clientSocket, twitchChatConfig) => {
    // start listening for Twitch Chat messages now
    twitchChat.init(twitchChatConfig, commands);

    // listen for sending chat bot messages
    clientSocket.on('sendBotMessage', (/** @type {string} **/ message) => {
      console.log("sendBotMessage received:", {
        message
      })
      twitchChat.client.opts.channels.map(channel => {
        twitchChat.client.say(channel, message)
      })
    })

    // listen to chats
    twitchChat.onChatMessage(({ chatter, message, isCommand }) => {
      console.log("Event: onChatMessage", {
        chatter, message, isCommand
      })
      // render in client chat
      if (!isCommand && !message.startsWith("@")) {
        clientSocket.emit('twitch-chat', {
          chatter,
          message: validator.escape(message)
        })
      }
    })

    // listen for chat commands
    twitchChat.onChatCommand((commandData) => {
      console.log("Event: onChatCommand", commandData)
      clientSocket.emit(`!${commandData.commandConfig.commandName}`, commandData)
    })
  }
};

module.exports = twitchChat