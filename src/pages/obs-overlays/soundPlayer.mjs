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
      soundClip.audio = new Audio(soundClip.audioSource)
    }
    this.initialized = true;
  },
  get(name, chatter) {
    if (!this.sources.hasOwnProperty(name)) {
      return undefined
    }

    const source = this.sources[name];

    if (!source.allowedRoles) {
      return source;
    }
    else if (source.allowedRoles && chatter) {
      const allowedToPlay = source.allowedRoles.find(roleName => chatter.roles.hasOwnProperty(roleName) && chatter.roles[roleName] === true)

      if (allowedToPlay) {
        return source;
      }
    }

    return undefined;
  },
  getAllNames(chatter) {
    const allowedSounds = []

    for (const [soundName, soundSource] of Object.entries(this.sources)) {
      if (!soundSource.allowedRoles) {
        allowedSounds.push(soundName);
      }
      else if (chatter) {
        const allowedToPlay = soundSource.allowedRoles.find(roleName => chatter.roles.hasOwnProperty(roleName) && chatter.roles[roleName] === true)
  
        if (allowedToPlay) {
          allowedSounds.push(soundName);
        }
      }
    }
    
    return allowedSounds;
  },
  play(name, chatter) {
    if (!name) {
      console.log("Sound Player: No sound name provided");
      return;
    }
    if (!this.initialized) {
      this.init();
    }

    const soundClip = this.get(name, chatter);

    if (!soundClip && chatter) {
      console.log(`Sound Player: Chatter "${chatter.userName}" does not have access to play sound "${name}"`);
      return;
    }

    if (soundClip && soundClip.audio) {
      soundClip.audio.volume = soundClip.volume || config.DEFAULT_SOUND_CLIP_VOLUME; // 0-1
      soundClip.audio.currentTime = 0;
      soundClip.audio.play();
    }
  }
};

export default soundPlayer;