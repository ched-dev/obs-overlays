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
    commandName: "brb",
    allowedRoles: ["broadcaster"],
    chatCommandCallback: ({ args }) => ({
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
    commandName: "boring",
    allowedRoles: ["any"],
    shortcuts: ["!s boring"]
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
      args: ["join the community and get alerts for live streams in The Discord: https://discord.gg/Z8CqGuJjrb"]
    })
  },
  {
    commandName: "eyes",
    allowedRoles: ["any"],
    shortcuts: ["!s eyes"]
  },
  {
    commandName: "fortune",
    allowedRoles: ["broadcaster"],
    chatCommandCallback: (commandData) => ({
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
    commandName: "sound",
    aliases: ["s"],
    allowedRoles: ["any"],
    chatCommandCallback: ({ commandName, args, chatter }) => ({
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
    commandName: "vip",
    allowedRoles: ["broadcaster", "moderator", "vip"],
    shortcuts: ["!s anotherone"]
  },
  {
    commandName: "whoami",
    allowedRoles: ["any"],
    chatCommandCallback: ({ commandName, args, chatter }) => ({
      clientCommand: "sendBotMessage",
      args: [`@${chatter.userName}, you're a ...`]
    })
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
      args: ["i made a URL just for you https://bit.ly/ched_dev-youtube"]
    })
  },
  {
    commandName: "wow",
    allowedRoles: ["any"],
    shortcuts: ["!s wow"]
  },
]

export default chatCommands