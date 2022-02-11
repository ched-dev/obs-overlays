// @ts-check

import twitchChatConfig from "../config/twitchChat.mjs"

/**
 * @typedef {import("../types").ChatCommandChatter} ChatCommandChatter
 */

/**
 * A fake broadcaster user used to override sound allowedRoles within clientCommands
 * e.g. playSound(soundName, fakeBroadcaster)
 * @type {ChatCommandChatter}
 */
export const fakeBroadcaster = {
  displayName: twitchChatConfig.channelName,
  userId: "unknown",
  userName: twitchChatConfig.channelName,
  roles: {
    broadcaster: true,
    moderator: true,
    vip: true,
    editor: true,
    follower: true,
    subscriber: true,
    any: true
  },
  features: {
    firstMessage: false,
    highlightedMessage: false
  }
}
