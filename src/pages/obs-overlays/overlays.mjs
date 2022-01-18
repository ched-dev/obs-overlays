import * as config from "./config/config.mjs"
import soundPlayer from "./soundPlayer.mjs"

// exposed client commands
const clientCommands = {
  playSound,
  renderTemplate,
  renderSoundButtons,
  clearNotification
}

let notificationTimeout = false
const canvasEl = document.querySelector("#canvas")
const socket = io();
soundPlayer.init();

console.log("init overlays.js", {
  config
})

config.tauListeners.map(listener => {
  listenForEvent(listener.eventName, listener.clientCallback)
})

config.chatCommands.map(listener => {
  listenForChatCommand(listener.commandName, listener.clientCallback)
})

function listenForEvent(eventName, getData) {
  socket.on(eventName, (eventData) => renderTemplate(getData(eventData)));
}

function listenForChatCommand(commandName, clientCallback = () => {}) {
  socket.on(`!${commandName}`, (commandData) => {
    const clientCaller = clientCallback(commandData);
    const clientCommand = clientCommands.hasOwnProperty(clientCaller.clientCommand) && clientCommands[clientCaller.clientCommand]

    // console.log({
    //   commandData,
    //   clientCaller,
    //   clientCommand
    // })

    if (clientCommand) {
      clientCommand(...clientCaller.args || [])
    }
  });
}

function renderTemplate(eventData) {
  const templateName = eventData.template || config.DEFAULT_NOTIFICATION_TEMPLATE;
  const templateEl = document.querySelector(`#${templateName}`);

  if (!templateEl) {
    console.error(`Template does not exist: ${templateName}`)
    return
  }

  // get template and render
  let html = templateEl.textContent;
  for (const [propName, value] of Object.entries(eventData || {})) {
    html = html.replace(`{${propName}}`, value);
  }

  canvasEl.innerHTML = html;
  eventData.sound && playSound(eventData.sound);
  eventData.timeout && startNotificationTimeout(eventData.timeout);
}

function startNotificationTimeout(timeout = config.NOTIFICATION_AUTO_CLOSE_TIMEOUT) {
  if (notificationTimeout !== false) {
    clearTimeout(notificationTimeout)
    notificationTimeout = false
  }

  notificationTimeout = setTimeout(() => clearNotification(), timeout)
}

function clearNotification() {
  canvasEl.innerHTML = "";
}

function playSound(name = config.DEFAULT_NOTIFICATION_SOUND) {
  soundPlayer.play(name);
}


// client-side
socket.on("connect", () => {
  console.log("Socket.io Connected:", socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log("Socket.io Disconnected:", socket.id); // undefined
});



// debugging chat sound volume
function renderSoundButtons() {
  let html = ""
  for (const soundName in soundPlayer.sources) {
    html += `
      <button data-sound-name="${soundName}" class="sound-button">
        ${soundName}
      </button>
    `
  }
  canvas.innerHTML = `
    <div class="notification-position bottom-right">
      <div className="button-group">
        ${html}
      </div>
    </div>
  `
  canvas.addEventListener('click', (e) => {
    if (e.target.dataset.soundName) {
      playSound(e.target.dataset.soundName)
    }
  })
}
if (config.DEBUG_RENDER_SOUND_BUTTONS) renderSoundButtons()
