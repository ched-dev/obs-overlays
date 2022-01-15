import * as config from "./config/config.mjs"

export default {
  // init all audio sources so they are ready to play
  // only works in browser
  // the user must interact with the page before audio can play
  init() {
    for (const [soundName, soundClip] of Object.entries(this.sources)) {
      soundClip.audio = new Audio('./' + soundClip.audioSource)
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
      soundClip.audio.volume = soundClip.volume || config.DEFAULT_SOUND_CLIP_VOLUME; // 0-1
      soundClip.audio.currentTime = 0;
      soundClip.audio.play();
    }
  },
  sources: config.soundSources
};