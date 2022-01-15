const AUTO_CLOSE_TIMEOUT = 10 * 1000
const DEFAULT_AUDIO_VOLUME = 0.8
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
  'airhorn': {
    audio: new Audio('./sounds/air-horn.mp3'),
    volume: 0.2
  },
  'anotherone': {
    audio: new Audio('./sounds/dj-khaled-another-one.mp3'),
    volume: 1.0
  },
  'applause': {
    audio: new Audio('./sounds/applause-tv.mp3'),
    volume: 0.2
  },
  'boring': {
    audio: new Audio('./sounds/simpsons-homer-boring.mp3')
  },
  'brb': {
    audio: new Audio('./sounds/elevator-music.mp3'),
    volume: 0.4
  },
  'chomp': {
    audio: new Audio('./sounds/chomp-on-this.mp3'),
    volume: 1.0
  },
  'coin': {
    audio: new Audio('./sounds/mario-coin.mp3')
  },
  'crickets': {
    audio: new Audio('./sounds/crickets-chirping.mp3'),
    volume: 0.4
  },
  'dark': {
    audio: new Audio('./sounds/hello-darkness.mp3'),
    volume: 1.0
  },
  'dead': {
    audio: new Audio('./sounds/mario-death.mp3'),
    volume: 0.2
  },
  'eyes': {
    audio: new Audio('./sounds/simpsons-my-eyes-goggles.mp3'),
    volume: 0.6
  },
  'hold': {
    audio: new Audio('./sounds/elevator-music.mp3'),
    volume: 0.4
  },
  'larry': {
    audio: new Audio('./sounds/larry.mp3'),
    volume: 0.3
  },
  'listen': {
    audio: new Audio('./sounds/simpsons-shut-up-for-a-sec.mp3')
  },
  'meow': {
    audio: new Audio('./sounds/meow.mp3'),
    volume: 0.4
  },
  'nerd': {
    audio: new Audio('./sounds/simpsons-homer-nerd.m4a'),
    volume: 1.0
  },
  'repeat': {
    audio: new Audio('./sounds/simpsons-homer-repeat.mp3'),
    volume: 0.6
  },
  'rimshot': {
    audio: new Audio('./sounds/rimshot.mp3'),
    volume: 0.4
  },
  'sad': {
    audio: new Audio('./sounds/sad.mp3'),
    volume: 0.2
  },
  'sax': {
    audio: new Audio('./sounds/simpsons-saxamaphone.mp3')
  },
  'seinfeld': {
    audio: new Audio('./sounds/seinfeld-intro.mp3')
  },
  'shitt': {
    audio: new Audio('./sounds/sheeeit.mp3'),
    volume: 1.0
  },
  'shutup': {
    audio: new Audio('./sounds/simpsons-shut-up-for-a-sec.mp3')
  },
  'stop': {
    audio: new Audio('./sounds/simpsons-stop-hes-already-dead.mp3'),
    volume: 0.4
  },
  'suspense': {
    audio: new Audio('./sounds/mlb-charge.mp3'),
    volume: 0.4
  },
  'womp': {
    audio: new Audio('./sounds/womp.mp3'),
    volume: 0.2
  },
  'wow': {
    audio: new Audio('./sounds/wow.mp3'),
    volume: 0.2
  },
  'yoink': {
    audio: new Audio('./sounds/simpsons-bart-yoink.mp3'),
    volume: 0.2
  },
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
  action: "follwed",
  sound: "coin",
  timeout: 7 * 1000
}));

listenForEvent("channel-subscribe", (eventData) => ({
  title: "New Subscriber",
  userName: eventData.user_name,
  action: "subscribed",
  sound: "wow"
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
  sound: "chomp",
  timeout: 12 * 1000
}));

function listenForEvent(eventName, getData) {
  socket.on(eventName, (eventData) => renderMessage(getData(eventData)));
}

function renderMessage(eventData) {
  canvasEl.innerHTML = templates.message(eventData);
  notificationSound(eventData.sound);
  startNotificationTimeout(eventData.timeout);
}

function startNotificationTimeout(timeout = AUTO_CLOSE_TIMEOUT) {
  if (notificationTimeout !== false) {
    clearTimeout(notificationTimeout)
    notificationTimeout = false
  }

  notificationTimeout = setTimeout(() => clearNotification(), timeout)
}

function clearNotification() {
  canvasEl.innerHTML = ""}

function notificationSound(name = 'wow') {
  const soundClip = chatSounds[name];

  soundClip.audio.volume = soundClip.volume || DEFAULT_AUDIO_VOLUME; // 0-1
  soundClip.audio.currentTime = 0;
  soundClip.audio.play();
}



// debugging chat sound volume
function renderSoundButtons() {
  let html = ""
  for (const soundName in chatSounds) {
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
renderSoundButtons()
