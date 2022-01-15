const DEFAULT_AUDIO_VOLUME = 0.8;

export default {
  // init all audio sources so they are ready to play
  // only works in browser
  // the user must interact with the page before audio can play
  init() {
    for (const [soundName, soundClip] of Object.entries(this.sources)) {
      soundClip.audio = new Audio(soundClip.audioSource)
    }
    this.initialized = true;
  },
  get(name) {
    return this.sources[name];
  },
  play(name) {
    const soundClip = this.get(name);

    if (!this.initialized) {
      this.init();
    }

    if (soundClip.audio) {
      soundClip.audio.volume = soundClip.volume || DEFAULT_AUDIO_VOLUME; // 0-1
      soundClip.audio.currentTime = 0;
      soundClip.audio.play();
    }
  },
  sources: {
    'airhorn': {
      audioSource: './sounds/air-horn.mp3',
      volume: 0.2
    },
    'anotherone': {
      audioSource: './sounds/dj-khaled-another-one.mp3',
      volume: 1.0
    },
    'applause': {
      audioSource: './sounds/applause-tv.mp3',
      volume: 0.2
    },
    'boring': {
      audioSource: './sounds/simpsons-homer-boring.mp3',
    },
    'brb': {
      audioSource: './sounds/elevator-music.mp3',
      volume: 0.4
    },
    'chomp': {
      audioSource: './sounds/chomp-on-this.mp3',
      volume: 1.0
    },
    'coin': {
      audioSource: './sounds/mario-coin.mp3',
    },
    'crickets': {
      audioSource: './sounds/crickets-chirping.mp3',
      volume: 0.4
    },
    'dark': {
      audioSource: './sounds/hello-darkness.mp3',
      volume: 1.0
    },
    'dead': {
      audioSource: './sounds/mario-death.mp3',
      volume: 0.2
    },
    'eyes': {
      audioSource: './sounds/simpsons-my-eyes-goggles.mp3',
      volume: 0.6
    },
    'hold': {
      audioSource: './sounds/elevator-music.mp3',
      volume: 0.4
    },
    'larry': {
      audioSource: './sounds/larry.mp3',
      volume: 0.3
    },
    'listen': {
      audioSource: './sounds/simpsons-shut-up-for-a-sec.mp3',
    },
    'meow': {
      audioSource: './sounds/meow.mp3',
      volume: 0.4
    },
    'nerd': {
      audioSource: './sounds/simpsons-homer-nerd.m4a',
      volume: 1.0
    },
    'repeat': {
      audioSource: './sounds/simpsons-homer-repeat.mp3',
      volume: 0.6
    },
    'rimshot': {
      audioSource: './sounds/rimshot.mp3',
      volume: 0.4
    },
    'sad': {
      audioSource: './sounds/sad.mp3',
      volume: 0.2
    },
    'sax': {
      audioSource: './sounds/simpsons-saxamaphone.mp3',
    },
    'seinfeld': {
      audioSource: './sounds/seinfeld-intro.mp3',
    },
    'shitt': {
      audioSource: './sounds/sheeeit.mp3',
      volume: 1.0
    },
    'shutup': {
      audioSource: './sounds/simpsons-shut-up-for-a-sec.mp3',
    },
    'stop': {
      audioSource: './sounds/simpsons-stop-hes-already-dead.mp3',
      volume: 0.4
    },
    'suspense': {
      audioSource: './sounds/mlb-charge.mp3',
      volume: 0.4
    },
    'womp': {
      audioSource: './sounds/womp.mp3',
      volume: 0.2
    },
    'wow': {
      audioSource: './sounds/wow.mp3',
      volume: 0.2
    },
    'yoink': {
      audioSource: './sounds/simpsons-bart-yoink.mp3',
      volume: 0.2
    },
  }
};