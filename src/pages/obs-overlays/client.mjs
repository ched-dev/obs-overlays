// @ts-check

import * as config from "./config/config.mjs"
import soundPlayer from "./soundPlayer.mjs"
import { fakeBroadcaster } from "./mock/chatters.mjs"

/**
 * Client Application
 * ===
 * The home of the client where all Client Commands are triggered
 */

/**
 * @typedef {import("./types").ClientCommands} ClientCommands
 * @typedef {import("./types").ClientCommandResult} ClientCommandResult
 * @typedef {import("./types").EventCommand} EventCommand
 * @typedef {import("./types").EventCommandCallbackData} EventCommandCallbackData
 * @typedef {import("./types").ChatCommand} ChatCommand
 * @typedef {import("./types").ChatCommandChatter} ChatCommandChatter
 * @typedef {import("./types").ChatCommandCallbackData} ChatCommandCallbackData
 * @typedef {import("./types").RenderTemplateData} RenderTemplateData
 */

// exposed client commands
// these commands should handle bad user provided data (__proto__, toString) in args
// use object.hasOwnProperty(propName) before using object[propName]
/** @type {ClientCommands} */
const clientCommands = {
  playSound,
  renderTemplate,
  renderSoundButtons,
  sendSoundNames,
  clearScreen,
  sendBotMessage,
  sendCommands,
  ignore() {}
}

/** @type {Record<string,string>} */
const urlParams = Object.fromEntries(new URLSearchParams(window.location.search).entries());
// const debugMode = Boolean(urlParams.debugMode)
/** @type {false | NodeJS.Timeout} */
let notificationTimeout = false
/** @type {HTMLElement} */
const canvasEl = document.querySelector("#canvas")
const socket = window.io();
soundPlayer.init();

console.log("init client.js", {
  config,
  clientCommands,
  urlParams
})

config.eventCommands.map(eventCommand => {
  listenForEventCommand(eventCommand)
})

config.chatCommands.map(chatCommand => {
  listenForChatCommand(chatCommand)
})

// config can be array of config, or single item
/**
 * @param {ClientCommandResult} commandConfig
 */
function handleClientCommand(commandConfig) {
  if (!commandConfig || typeof commandConfig !== "object") {
    console.error("`handleClientCommand()` invalid commandConfig:", commandConfig);
    return;
  }
  if (Array.isArray(commandConfig)) {
    commandConfig.map(handleClientCommand);
    return;
  }

  if (urlParams.browserMode && config.BROWSER_MODE_DENIED_COMMANDS.includes(commandConfig.clientCommand)) {
    console.log(`// skipping ${commandConfig.clientCommand}`)
    return
  }

  const clientCommand = clientCommands.hasOwnProperty(commandConfig.clientCommand) && clientCommands[commandConfig.clientCommand];

  if (clientCommand) {
    clientCommand.apply(undefined, commandConfig.args || []);
  }
}

/**
 * @param {EventCommand} eventCommand
 */
function listenForEventCommand({ eventName, eventCommandCallback = () => {} }) {
  socket.on(eventName, (
    /** @type {EventCommandCallbackData} */ eventData
  ) => {
    handleClientCommand(eventCommandCallback(eventData));
  });
}

/**
 * @param {ChatCommand} chatCommand
 */
function listenForChatCommand({ commandName, chatCommandCallback = () => {} }) {
  socket.on(`!${commandName}`, (
    /** @type {ChatCommandCallbackData} */ commandData
  ) => {
    handleClientCommand(chatCommandCallback(commandData));
  });
}

/**
 * 
 * @param {RenderTemplateData} templateData 
 * @returns {void}
 */
function renderTemplate(templateData) {
  if (typeof templateData !== "object") {
    console.error("renderTemplate: templateData is incorrect format", { templateData });
    return
  }

  const templateName = templateData.template || config.DEFAULT_NOTIFICATION_TEMPLATE;
  const templateEl = document.querySelector(`#${templateName}`);

  if (!templateEl) {
    console.error(`Template does not exist: ${templateName}`)
    return
  }

  // get template and render
  let html = templateEl.textContent;
  for (const [propName, value] of Object.entries(templateData || {})) {
    html = html.replace(`{${propName}}`, value);
  }

  canvasEl.innerHTML = html;
  templateData.sound && playSound(templateData.sound, fakeBroadcaster);
  startNotificationTimeout(templateData.timeout);
}

function startNotificationTimeout(timeout = config.NOTIFICATION_AUTO_CLOSE_TIMEOUT) {
  if (notificationTimeout !== false) {
    clearTimeout(notificationTimeout)
    notificationTimeout = false
  }

  // 0 or false will not run
  if (!timeout) return

  notificationTimeout = setTimeout(() => clearScreen(), timeout)
}

function clearScreen() {
  canvasEl.innerHTML = "";
}

/**
 * Play a sound by name, or send available sounds in chat
 * @type {ClientCommands["playSound"]}
 * @param {string} name The name of the sound source
 * @param {ChatCommandChatter} [chatter] Chatter requesting the sound
 */
function playSound(name, chatter) {
  const hasSound = soundPlayer.get(name, chatter)
  
  if (!hasSound && config.SEND_AVAILABLE_SOUNDS_MESSAGE && chatter) {
    sendSoundNames(chatter)
  } else {
    soundPlayer.play(name, chatter)
  }
}

/**
 * Send a bot message with chatters available sounds
 * @param {ChatCommandChatter} chatter 
 */
function sendSoundNames(chatter) {
  const soundNames = soundPlayer.getAllNames(chatter).join(", ")

  sendBotMessage(`@${chatter.userName} - here's a list of valid sounds: ${soundNames}`)
}

function renderSoundButtons() {
  let html = ""
  for (const soundName in soundPlayer.sources) {
    html += `
      <button data-sound-name="${soundName}" class="sound-button">
        ${soundName}
      </button>
    `
  }
  canvasEl.innerHTML = `
    <div class="notification-position bottom-right">
      <div className="button-group">
        ${html}
      </div>
    </div>
  `
  canvasEl.addEventListener('click', (e) => {
    /** @type {Partial<HTMLButtonElement>} */
    const htmlEl = e.target;
    if (htmlEl.dataset.soundName) {
      playSound(htmlEl.dataset.soundName, fakeBroadcaster)
    }
  })
}

/**
 * @param {string} message
 */
function sendBotMessage(message) {
  socket.emit('sendBotMessage', message);
}

/**
 * @param {ChatCommandCallbackData} commandData
 */
function sendCommands(commandData) {
  const { chatter } = commandData
  const allowedCommands = []
  config.chatCommands.map(({ commandName, allowedRoles, aliases }) => {
    
    if (allowedRoles.includes("any") || allowedRoles.find(role => chatter.roles[role])) {
      allowedCommands.push(`!${commandName}`)
      // check aliases too man!
      if (aliases && aliases.length) {
        aliases.map(alias => (
          allowedCommands.push(`!${alias}`)
        ))
      }
    }
  })

  const commandsString = allowedCommands.join(" ")

  console.log("commandData", commandData)
  sendBotMessage(`@${chatter.userName} - you can run: ${commandsString}`)
}

// client-side logging
socket.on("connect", () => {
  console.log("Socket.io Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket.io Disconnected:", socket.id);
});