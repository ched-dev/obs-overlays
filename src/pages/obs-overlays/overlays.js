const AUTO_CLOSE_TIMEOUT = 7 * 1000
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

const chatSounds = {
  'jeff': new Audio('./sounds/jeff.mp3'),
  'hellodarkness': new Audio('./sounds/hello_darkness.mp3'),
  'heylisten': new Audio('./sounds/hey_listen.mp3'),
  'plusultra': new Audio('./sounds/plus_ultra.mp3'),
  'sad': new Audio('./sounds/sad.mp3'),
  'wow': new Audio('./sounds/wow.mp3'),
  'womp': new Audio('./sounds/womp.mp3'),
  'smash': new Audio('./sounds/smash.mp3'),
  'meow': new Audio('./sounds/meow.mp3'),
  'airhorn': new Audio('./sounds/air-horn.mp3'),
  'applause': new Audio('./sounds/applause.mp3'),
  'pikachu': new Audio('./sounds/pikachu.mp3'),
  'oof': new Audio('./sounds/oof.mp3'),
  'mariodeath': new Audio('./sounds/mario_death.mp3'),
  'nani': new Audio('./sounds/nani.mp3'),
  'happybirthday': new Audio('./sounds/happy_birthday.mp3'),
};


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

listenForEvent("channel-follow", (eventData) => ({
  title: "New Follower",
  userName: eventData.user_name,
  action: "follwed"
}));

listenForEvent("channel-subscribe", (eventData) => ({
  title: "New Subscriber",
  userName: eventData.user_name,
  action: "subscribed"
}));

listenForEvent("channel-channel_points_custom_reward_redemption-add", (eventData) => ({
  title: "New Redemption",
  userName: eventData.user_name,
  action: `redeemed ${eventData.reward.title}`,
  sound: "meow"
}));


listenForEvent("channel-raid", (eventData) => ({
  title: "Incoming Raid!",
  userName: eventData.from_broadcaster_user_name,
  action: `raided with ${eventData.viewers} viewers`,
  sound: "applause"
}));

function listenForEvent(eventName, getData) {
  socket.on(eventName, (eventData) => renderMessage(getData(eventData)));
}

function renderMessage(eventData) {
  canvasEl.innerHTML = templates.message(eventData);
  notificationSound(eventData.sound);
  startNotificationTimeout();
}

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

function notificationSound(name = 'wow') {
  chatSounds[name].currentTime = 0;
  chatSounds[name].play();
}