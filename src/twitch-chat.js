const env = require('./env');
const tmi = require('tmi.js');
const socketListeners = {
  // [socket.id]: { [command-name]: commandCallback }
}

const twitchChat = {
  init(config = {}, commands = []) {
    if (this.initialized) {
      return
    }

    const broadcaster = config.broadcaster || env.twitch_user_name

    this.client = new tmi.Client({
      channels: [broadcaster]
    });

    this.client.connect();

    console.log("TMI listening to Twitch Chat...")

    this.client.on('message', (channel, tags, message, self) => {
      console.log(`${tags['display-name']}: ${message}`);
      console.log({
        channel,
        tags,
        message,
        self
      })
      const EXAMPLE_DATA = {
        channel: '#ched_dev',
        tags: {
          'badge-info': { subscriber: '10' },
          badges: { broadcaster: '1', subscriber: '0' },
          'client-nonce': '1f678a17069fbe4d2d14d32051382354',
          color: '#DAA520',
          'display-name': 'ched_dev',
          emotes: null,
          'first-msg': false,
          flags: null,
          id: '044d2ff9-dd21-473b-9800-8c12105e33bc',
          mod: false,
          'room-id': '261129104',
          subscriber: true,
          'tmi-sent-ts': '1642395572861',
          turbo: false,
          'user-id': '261129104',
          'user-type': null,
          'emotes-raw': null,
          'badge-info-raw': 'subscriber/10',
          'badges-raw': 'broadcaster/1,subscriber/0',
          username: 'ched_dev',
          'message-type': 'chat'
        },
        message: '!sound yoink',
        self: false
      }

      const cleanedMessage = message.trim()
      const isBroadcaster = tags.username === broadcaster
      const isModerator = tags.mod && config.allowModCommands
      const isHighlightedMessage = tags['msg-id'] === "highlighted-message"
      const isCommand = cleanedMessage.startsWith("!")
      const isCommandAllowed = isBroadcaster || isModerator

      if (!isCommand || !isCommandAllowed) {
        // ignore
        return
      }

      // message examples:
      //   !fortune
      //   !sound yoink
      //   !s yoink (alias)
      //   !yoink -> !sound yoink (command alias)
      const [rawCommand, ...args] = cleanedMessage.slice(1).split(" ")
      const command = rawCommand.toLowerCase()
      console.log('command:', {
        command,
        message,
        args
      })

      // check for shortcut commands
      // shortcut commands fake a message from same user
      const commandConfig = commands.find(c => c.commandName === command)
      console.log({
        commandConfig
      })
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
            commandName: command,
            args
          })
        }
      }
    });

    this.initialized = true;
  },
  emitChatCommandsOnSocket: (commands, socket, config) => {
    // start listening for Twitch Chat messages now
    twitchChat.init(config, commands);

    const commandsWithSocket = {}

    commands.map(({ commandName, aliases, serverCallback }) => {
      console.log(socket.id, "listening for:", `!${commandName}`);

      const commandCallback = (commandData) => {
        socket.emit(`!${commandName}`, commandData);
        console.log(`${socket.id} received:`, `!${commandName}`, commandData);
      }

      commandsWithSocket[commandName] = commandCallback

      // redirect aliases
      if (aliases && aliases.length) {
        aliases.forEach(commandAlias => {
          console.log(socket.id, "listening for:", `!${commandAlias} -> !${commandName}`);
          commandsWithSocket[commandAlias] = commandCallback
        })
      }
    })

    socketListeners[socket.id] = commandsWithSocket
  }
};

module.exports = twitchChat