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
      const userName = tags['display-name'];
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

      const roles = {
        broadcaster: tags.badges?.broadcaster === "1",
        moderator: Boolean(tags.mod),
        vip: tags.badges?.vip === "1",
        editor: false,
        subscriber: tags.badges?.subscriber === "1",
        follower: tags.badges?.follower === "1",
        any: true
      }
      const isHighlightedMessage = tags['msg-id'] === "highlighted-message"
      
      console.log('command:', {
        command,
        commandConfig,
        message,
        roles,
        args
      })

      // access permissions based on roles
      if (!commandConfig.allowedRoles && !roles.broadcaster) {
        // default required role is broadcaster
        return
      }
      const commandIsAllowed = commandConfig.allowedRoles.find(role => roles.hasOwnProperty(role) && Boolean(roles[role]));
      if (!commandIsAllowed) {
        // did not meet access permissions required
        console.log("Invalid Command Permissions:", userName, message)
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