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
    commandName: "art",
    allowedRoles: ["any"],
    shortcuts: ["!s art"]
  },
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
  // {
  //   commandName: "books",
  //   allowedRoles: ["any"],
  //   chatCommandCallback: () => ([
  //     {
  //       clientCommand: "sendBotMessage",
  //       args: [`check out the books we've built assessments for: https://ched.dev/books`]
  //     }
  //   ])
  // },
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
    aliases: ["applause"],
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
    commandName: "commands",
    allowedRoles: ["any"],
    chatCommandCallback: (commandData) => ({
      clientCommand: "sendCommands",
      args: [commandData]
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
    commandName: "fail",
    allowedRoles: ["any"],
    shortcuts: ["!s concern"]
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
      args: ["steal my code: https://github.com/ched-dev"]
    })
  },
  {
    commandName: "gottem",
    allowedRoles: ["any"],
    shortcuts: ["!s gottem"]
  },
  {
    commandName: "hatemylife",
    allowedRoles: ["broadcaster", "subscriber"],
    shortcuts: ["!s ihatemylife"]
  },
  {
    commandName: "hydrate",
    allowedRoles: ["any"],
    shortcuts: ["!s hydrate"]
  },
  {
    commandName: "lurk",
    allowedRoles: ["any"],
    shortcuts: ["!s nobody"],
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
    commandName: "next",
    allowedRoles: ["any"],
    shortcuts: ["!s time"]
  },
  {
    commandName: "nice",
    allowedRoles: ["any"],
    shortcuts: ["!s nice"]
  },
  {
    commandName: "no",
    allowedRoles: ["any"],
    shortcuts: ["!s noah"]
  },
  {
    commandName: "notlistening",
    allowedRoles: ["any"],
    shortcuts: ["!s listening"]
  },
  {
    commandName: "lazy",
    aliases: ["ok"],
    allowedRoles: ["any"],
    shortcuts: ["!s dontcare"]
  },
  {
    commandName: "offbyone",
    allowedRoles: ["any"],
    shortcuts: ["!s miscount"]
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
    commandName: "pain",
    allowedRoles: ["any"],
    shortcuts: ["!s pain"]
  },
  {
    commandName: "project",
    allowedRoles: ["any"],
    chatCommandCallback: () => ({
      clientCommand: "sendBotMessage",
      args: ["Our new project is a Redwood JS App version of our Amazon Product Price scanner. It's getting close to user beta, but you can view it now at https://unboxed.deals"]
    })
  },
  {
    commandName: "railway",
    allowedRoles: ["any"],
    chatCommandCallback: () => ({
      clientCommand: "sendBotMessage",
      args: ["I host most of my projects on Railway.app, use my referral code to sign up https://railway.app?referralCode=tfNFtC"]
    })
  },
  {
    commandName: "repeat",
    allowedRoles: ["any"],
    shortcuts: ["!s rookie"]
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
    commandName: "rules",
    allowedRoles: ["any"],
    shortcuts: ["!s rules"]
  },
  {
    commandName: "serious",
    allowedRoles: ["any"],
    shortcuts: ["!s serious"]
  },
  {
    commandName: "socials",
    allowedRoles: ["any"],
    shortcuts: ["!youtube", "!twitter"]
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