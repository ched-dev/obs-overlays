import tauListeners from "./tauListeners.mjs"
import soundSources from "./soundSources.mjs"
import chatCommands from "./chatCommands.mjs"
import twitchChatConfig from "./twitchChatConfig.mjs"

export const NOTIFICATION_AUTO_CLOSE_TIMEOUT = 10 * 1000
export const DEFAULT_NOTIFICATION_TEMPLATE = "message-template"
export const DEFAULT_NOTIFICATION_SOUND = "wow"
export const DEBUG_RENDER_SOUND_BUTTONS = false
export const DEFAULT_SOUND_CLIP_VOLUME = 0.8

export {
  tauListeners,
  soundSources,
  chatCommands,
  twitchChatConfig
}