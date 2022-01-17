import * as config from "./config/config.mjs"
import soundPlayer from "./soundPlayer.mjs"

let notificationTimeout = false
const canvasEl = document.querySelector("#canvas")
const socket = io();
soundPlayer.init();

const templates = {
  message: (data) => {
    let html = document.querySelector("#message-template").text;
    for (const [propName, value] of Object.entries(data || {})) {
      html = html.replace(`{${propName}}`, value);
    }
    return html;
  },
  messageWithMessage: (data) => {
    let html = document.querySelector("#message-with-message-template").text;
    for (const [propName, value] of Object.entries(data || {})) {
      html = html.replace(`{${propName}}`, value);
    }
    return html;
  }
}

console.log("init overlays.js", {
  templates,
  config
})

config.eventListeners.map(listener => {
  listenForEvent(listener.eventName, listener.clientCallback)
})

function listenForEvent(eventName, getData) {
  socket.on(eventName, (eventData) => renderMessage(getData(eventData)));
}

function renderMessage(eventData) {
  const templateName = eventData.template || config.DEFAULT_NOTIFICATION_TEMPLATE;
  const template = templates.hasOwnProperty(templateName) ? templates[templateName] : null;

  if (!template) {
    console.error(`Template does not exist: ${templateName}`)
    return
  }

  canvasEl.innerHTML = template(eventData);
  notificationSound(eventData.sound);
  startNotificationTimeout(eventData.timeout);
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

function notificationSound(name = 'wow') {
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
      <button data-sound-name="${soundName}">
        ${soundName}
      </button>
    `
  }
  canvas.innerHTML = `
    <div class="notification-position bottom-right">
      ${html}
    </div>
  `
  canvas.addEventListener('click', (e) => {
    if (e.target.dataset.soundName) {
      notificationSound(e.target.dataset.soundName)
    }
  })
}
if (config.DEBUG_RENDER_SOUND_BUTTONS) renderSoundButtons()
