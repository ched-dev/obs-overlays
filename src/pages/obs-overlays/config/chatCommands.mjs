// @ts-check

import { fakeBroadcaster } from "../mock/chatters.mjs"

/**
 * Chat Commands Configuration
 * ===
 * Twitch chat message commands to listen for
 */

/**
 * @typedef {import("../types").ChatCommand} ChatCommand
 */

/** @type {ChatCommand[]} */
const chatCommands = [
  {
    commandName: "babysteps",
    allowedRoles: ["any"],
    shortcuts: ["!s babysteps"]
  },
  {
    commandName: "back",
    allowedRoles: ["broadcaster"],
    shortcuts: ["!clear"],
    chatCommandCallback: () => ([
      {
        clientCommand: "sendBotMessage",
        args: [`!task start`]
      }
    ])
  },
  {
    commandName: "books",
    allowedRoles: ["any"],
    chatCommandCallback: () => ([
      {
        clientCommand: "sendBotMessage",
        args: [`check out the books we've built assessments for: https://ched.dev/books`]
      }
    ])
  },
  {
    commandName: "brb",
    allowedRoles: ["broadcaster"],
    chatCommandCallback: ({ args }) => ([
      {
        clientCommand: "renderTemplate",
        args: [
          {
            template: "message-template",
            title: "> Notice",
            message: `BRB, ${args.join(" ") || "Feeding the cat"}`,
            sound: "brb",
            timeout: false
          }
        ],
      },
      {
        clientCommand: "sendBotMessage",
        args: [`!task pause`]
      }
    ])
  },
  {
    commandName: "boring",
    allowedRoles: ["any"],
    shortcuts: ["!s boring"]
  },
  {
    commandName: "bullshit",
    allowedRoles: ["any"],
    aliases: ["bs"],
    shortcuts: ["!s bullshit"]
  },
  {
    commandName: "clap",
    allowedRoles: ["any"],
    shortcuts: ["!s clap"]
  },
  {
    commandName: "clear",
    allowedRoles: ["broadcaster"],
    chatCommandCallback: () => ({
      clientCommand: "clearScreen"
    })
  },
  {
    commandName: "codekatas",
    allowedRoles: ["any"],
    aliases: ["katas"],
    chatCommandCallback: () => ([
      {
        clientCommand: "sendBotMessage",
        args: [`a list of our favorite code katas: https://gist.github.com/ched-dev/28f48a3044e7ca14ba294c7732033dee`]
      }
    ])
  },
  {
    commandName: "coin",
    allowedRoles: ["any"],
    shortcuts: ["!s coin"]
  },
  {
    commandName: "commands",
    allowedRoles: ["any"],
    chatCommandCallback: (commandData) => ({
      clientCommand: "sendCommands",
      args: [commandData]
    })
  },
  {
    commandName: "dark",
    allowedRoles: ["any"],
    shortcuts: ["!s dark"]
  },
  {
    commandName: "discord",
    allowedRoles: ["any"],
    chatCommandCallback: () => ({
      clientCommand: "sendBotMessage",
      args: ["join the community and get alerts for live streams with  discord chat: https://discord.gg/Z8CqGuJjrb"]
    })
  },
  {
    commandName: "drop",
    allowedRoles: ["any"],
    shortcuts: ["!s womp"]
  },
  {
    commandName: "dumb",
    allowedRoles: ["any"],
    shortcuts: ["!s dumb"]
  },
  {
    commandName: "end",
    allowedRoles: ["broadcaster"],
    shortcuts: ["!socials"],
    chatCommandCallback: () => ([
      // {
      //   clientCommand: "sendBotMessage",
      //   args: [`!task start`]
      // },
      // {
      //   clientCommand: "sendBotMessage",
      //   args: [`!drop chedde2Chedded`]
      // }
    ])
  },
  {
    commandName: "eyes",
    allowedRoles: ["any"],
    shortcuts: ["!s eyes"]
  },
  {
    commandName: "fortune",
    allowedRoles: ["broadcaster"],
    chatCommandCallback: () => ({
      clientCommand: "clearScreen"
    })
  },
  {
    commandName: "funny",
    allowedRoles: ["any"],
    shortcuts: ["!s funny"]
  },
  {
    commandName: "gigawhat",
    allowedRoles: ["any"],
    aliases: ["gigawatt"],
    shortcuts: ["!s gigawhat"]
  },
  {
    commandName: "github",
    allowedRoles: ["any"],
    chatCommandCallback: () => ({
      clientCommand: "sendBotMessage",
      args: ["steal my code from me: https://github.com/ched-dev"]
    })
  },
  {
    commandName: "hatemylife",
    allowedRoles: ["broadcaster", "subscriber"],
    shortcuts: ["!s ihatemylife"]
  },
  {
    commandName: "highaf",
    allowedRoles: ["any"],
    shortcuts: ["!s afroman"]
  },
  {
    commandName: "lurk",
    allowedRoles: ["any"],
    chatCommandCallback: ({ chatter }) => ({
      clientCommand: "sendBotMessage",
      args: [`/me ${chatter.userName} slowly fades away into the night`]
    })
  },
  {
    commandName: "meow",
    allowedRoles: ["any"],
    shortcuts: ["!s meow"]
  },
  {
    commandName: "nailedit",
    allowedRoles: ["any"],
    shortcuts: ["!s nailedit"]
  },
  {
    commandName: "nerd",
    allowedRoles: ["any"],
    shortcuts: ["!s nerd"]
  },
  {
    commandName: "noah",
    allowedRoles: ["any"],
    shortcuts: ["!s noah"]
  },
  {
    commandName: "lazy",
    aliases: ["ok"],
    allowedRoles: ["any"],
    shortcuts: ["!s dontcare"]
  },
  {
    commandName: "overlays",
    allowedRoles: ["any"],
    chatCommandCallback: () => ({
      clientCommand: "sendBotMessage",
      args: ["All our OBS Overlays (follows, subscribe, etc.) and some chat commands (!clap) are controlled with our project https://github.com/ched-dev/obs-overlays which is still a work in progress!"]
    })
  },
  {
    commandName: "rimshot",
    allowedRoles: ["any"],
    shortcuts: ["!s rimshot"]
  },
  {
    commandName: "rude",
    allowedRoles: ["any"],
    shortcuts: ["!s rude"]
  },
  {
    commandName: "socials",
    allowedRoles: ["any"],
    shortcuts: ["!discord", "!youtube", "!github", "!twitter"]
  },
  {
    commandName: "sound",
    aliases: ["s"],
    allowedRoles: ["any"],
    chatCommandCallback: ({ args, chatter }) => ({
      clientCommand: "playSound",
      args: [args[0], chatter],
    })
  },
  {
    commandName: "sounds",
    allowedRoles: ["any"],
    chatCommandCallback: ({ chatter }) => ({
      clientCommand: "sendSoundNames",
      args: [chatter]
    })
  },
  {
    commandName: "spread",
    allowedRoles: ["any"],
    shortcuts: ["!s spreadit"]
  },
  {
    commandName: "start",
    allowedRoles: ["broadcaster"],
    shortcuts: ["!socials"],
    chatCommandCallback: () => ([
      {
        clientCommand: "sendBotMessage",
        args: [`!task start`]
      },
      // {
      //   clientCommand: "sendBotMessage",
      //   args: [`!drop chedde2Chedded`]
      // }
    ])
  },
  {
    commandName: "tasks",
    allowedRoles: ["any"],
    chatCommandCallback: () => ({
      clientCommand: "sendBotMessage",
      args: [`The Tasks you see on screen are from our project OBS Tasks Overlays. You can set it up on your own stream by only adding a browser source in OBS. Check it out at: https://github.com/ched-dev/obs-tasks-overlay`]
    })
  },
  { // allowing top level command to call restricted sounds
    commandName: "thinking",
    allowedRoles: ["any"],
    chatCommandCallback: () => ({
      clientCommand: "playSound",
      args: ["larry", fakeBroadcaster]
    })
  },
  {
    commandName: "time",
    allowedRoles: ["any"],
    shortcuts: ["!s time"]
  },
  {
    commandName: "twitter",
    allowedRoles: ["any"],
    chatCommandCallback: () => ({
      clientCommand: "sendBotMessage",
      args: [`you tweet? i tweet: https://twitter.com/ched_dev`]
    })
  },
  {
    commandName: "vip",
    allowedRoles: ["broadcaster", "moderator", "vip"],
    shortcuts: ["!s anotherone"]
  },
  {
    commandName: "whoami",
    allowedRoles: ["any"],
    chatCommandCallback: ({ chatter }) => ({
      clientCommand: "sendBotMessage",
      args: [`@${chatter.userName} - you're a ...`]
    })
  },
  {
    commandName: "wtf",
    allowedRoles: ["any"],
    shortcuts: ["!s pcloadletter"]
  },
  {
    commandName: "yeahsure",
    allowedRoles: ["any"],
    shortcuts: ["!s yeahsure"]
  },
  {
    commandName: "yoink",
    allowedRoles: ["any"],
    shortcuts: ["!s yoink"]
  },
  {
    commandName: "youtube",
    allowedRoles: ["any"],
    aliases: ["yt"],
    chatCommandCallback: () => ({
      clientCommand: "sendBotMessage",
      args: ["check out YouTube for all past streams: https://bit.ly/ched_dev-youtube"]
    })
  },
  // {
  //   commandName: "wishlist",
  //   allowedRoles: ["any"],
  //   chatCommandCallback: () => ({
  //     clientCommand: "sendBotMessage",
  //     args: ["I put together a wishlist of books I would like to review for you: https://www.amazon.com/gp/registry/wishlist/2ZXBNOATQA89A/ref=pdp_new_wl"]
  //   })
  // },
  {
    commandName: "wow",
    allowedRoles: ["any"],
    shortcuts: ["!s wow"]
  },
]

export default chatCommands