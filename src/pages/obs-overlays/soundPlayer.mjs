// @ts-check

import * as config from "./config/config.mjs"

/**
 * @typedef {import("./types").SoundPlayer} SoundPlayer
 */

/** @type {SoundPlayer} */
const soundPlayer = {

  initialized: false,
  sources: config.soundSources,

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
    return this.sources.hasOwnProperty(name) ? this.sources[name] : undefined;
  },
  play(name) {
    if (!name) {
      console.log("Sound Player: No sound name provided");
      return;
    }
    if (!this.initialized) {
      this.init();
    }

    const soundClip = this.get(name);

    if (soundClip && soundClip.audio) {
      soundClip.audio.volume = soundClip.volume || config.DEFAULT_SOUND_CLIP_VOLUME; // 0-1
      soundClip.audio.currentTime = 0;
      soundClip.audio.play();
    }
  }
};

export default soundPlayer;