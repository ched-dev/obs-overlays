// twitch chat commands to listen for
export default [
  {
    commandName: "clear",
    clientCallback: () => ({
      clientCommand: "clearNotification"
    })
  },
  {
    commandName: "sound",
    aliases: ["s"],
    clientCallback: ({ commandName, args }) => ({
      clientCommand: "playSound",
      args,
    })
  },
  {
    commandName: "sounds",
    clientCallback: () => ({
      clientCommand: "renderSoundButtons"
    })
  },
  {
    commandName: "fortune",
    aliases: [],
    serverCallback: (commandData) => {

    },
    clientCallback: (commandData) => ({
      
    })
  },
]