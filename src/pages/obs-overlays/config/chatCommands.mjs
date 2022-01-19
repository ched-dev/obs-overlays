// twitch chat commands to listen for
export default [
  {
    commandName: "brb",
    clientCallback: ({ args }) => ({
      clientCommand: "renderTemplate",
      args: [
        {
          template: "message-template",
          message: `BRB ~ ${args.join(" ") || "Feeding the cat"}`,
          sound: "brb",
          timeout: false
        }
      ],
    })
  },
  {
    commandName: "clap",
    shortcuts: ["!s clap"]
  },
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
  {
    commandName: "meow",
    shortcuts: ["!s meow"]
  },
  {
    commandName: "thinking",
    shortcuts: ["!s larry"]
  },
]