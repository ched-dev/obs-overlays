// twitch chat commands to listen for
export default [
  {
    commandName: "brb",
    allowedRoles: ["broadcaster"],
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
    allowedRoles: ["any"],
    shortcuts: ["!s clap"]
  },
  {
    commandName: "clear",
    allowedRoles: ["broadcaster"],
    clientCallback: () => ({
      clientCommand: "clearNotification"
    })
  },
  {
    commandName: "dark",
    allowedRoles: ["any"],
    shortcuts: ["!s dark"]
  },
  {
    commandName: "eyes",
    allowedRoles: ["any"],
    shortcuts: ["!s eyes"]
  },
  {
    commandName: "sound",
    aliases: ["s"],
    allowedRoles: ["any"],
    clientCallback: ({ commandName, args }) => ({
      clientCommand: "playSound",
      args,
    })
  },
  {
    commandName: "sounds",
    allowedRoles: ["any"],
    clientCallback: () => ({
      clientCommand: "renderSoundButtons"
    })
  },
  {
    commandName: "fortune",
    allowedRoles: ["broadcaster"],
    serverCallback: (commandData) => {

    },
    clientCallback: (commandData) => ({
      
    })
  },
  {
    commandName: "meow",
    allowedRoles: ["any"],
    shortcuts: ["!s meow"]
  },
  {
    commandName: "thinking",
    allowedRoles: ["any"],
    shortcuts: ["!s larry"]
  },
  {
    commandName: "vip",
    allowedRoles: ["broadcaster", "vip"],
    shortcuts: ["!s anotherone"]
  },
]