// @ts-check

import * as config from "./config/config.mjs"
import soundPlayer from "./soundPlayer.mjs"

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
  clearScreen,
  sendBotMessage,
  sendCommands,
  ignore() {}
}

/** @type {false | NodeJS.Timeout} */
let notificationTimeout = false
/** @type {HTMLElement} */
const canvasEl = document.querySelector("#canvas")
const socket = window.io();
soundPlayer.init();

console.log("init client.js", {
  config,
  clientCommands
})

config.eventCommands.map(eventCommand => {
  listenForEventCommand(eventCommand)
})

config.chatCommands.map(chatCommand => {
  listenForChatCommand(chatCommand)
})

// config can be array of config, or single item
/**
 * @param {ClientCommandResult} config
 */
function handleClientCommand(config) {
  if (!config || typeof config !== "object") {
    console.log("`handleClientCommand()` invalid config:", config);
    return;
  }
  if (Array.isArray(config)) {
    config.map(handleClientCommand);
    return;
  }

  const clientCommand = clientCommands.hasOwnProperty(config.clientCommand) && clientCommands[config.clientCommand];

  if (clientCommand) {
    clientCommand.apply(undefined, config.args || []);
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
  templateData.sound && playSound(templateData.sound);
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

function playSound(name = config.DEFAULT_NOTIFICATION_SOUND) {
  soundPlayer.play(name);
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
      playSound(htmlEl.dataset.soundName)
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
  sendBotMessage(`${chatter.userName}, you can run: ${commandsString}`)
}

// client-side logging
socket.on("connect", () => {
  console.log("Socket.io Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket.io Disconnected:", socket.id);
});