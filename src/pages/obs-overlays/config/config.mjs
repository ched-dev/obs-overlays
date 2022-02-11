import eventCommands from "./eventCommands.mjs"
import chatCommands from "./chatCommands.mjs"
import twitchChatConfig from "./twitchChat.mjs"
import soundSources from "./soundSources.mjs"

export const NOTIFICATION_AUTO_CLOSE_TIMEOUT = 10 * 1000
export const DEFAULT_NOTIFICATION_TEMPLATE = "message-template"
export const DEFAULT_NOTIFICATION_SOUND = null
export const DEFAULT_SOUND_CLIP_VOLUME = 0.8
export const SEND_AVAILABLE_SOUNDS_MESSAGE = true
export const BROWSER_MODE_DENIED_COMMANDS = ["playSound"]

export {
  eventCommands,
  chatCommands,
  twitchChatConfig,
  soundSources
}