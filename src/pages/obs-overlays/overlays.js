const AUTO_CLOSE_TIMEOUT = 5 * 1000
let notificationTimeout = false
const canvasEl = document.querySelector("#canvas")

const templates = {
  message: (data) => {
    let html = document.querySelector("#message-template").text;
    for (const [propName, value] of Object.entries(data || {})) {
      html = html.replace(`{${propName}}`, value);
    }
    return html;
  }
}

console.log("init overlays.js", {
  templates
})

const socket = io();

// client-side
socket.on("connect", () => {
  console.log("Socket.io Connected:", socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log("Socket.io Disconnected:", socket.id); // undefined
});

socket.on("channel-follow", (eventData) => {
  console.log("channel-follow:", eventData);

  canvasEl.innerHTML = templates.message({
    title: "New Follower",
    userName: eventData.user_name,
    action: "follwed"
  })
  startNotificationTimeout();
});

socket.on("channel-subscribe", (eventData) => {
  console.log("channel-subscribe:", eventData);

  canvasEl.innerHTML = templates.message({
    title: "New Subscriber",
    userName: eventData.user_name,
    action: "subscribed"
  });
  startNotificationTimeout();
});

function startNotificationTimeout() {
  if (notificationTimeout !== false) {
    clearTimeout(notificationTimeout)
    notificationTimeout = false
  }

  notificationTimeout = setTimeout(() => clearNotification(), AUTO_CLOSE_TIMEOUT)
}

function clearNotification() {
  canvasEl.innerHTML = ""
}