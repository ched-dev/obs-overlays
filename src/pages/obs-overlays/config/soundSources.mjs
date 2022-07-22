// @ts-check
import chedDevSources from './ched-dev-sources.mjs'

/**
 * Sound Source Configuration
 * ===
 * Sounds that can be triggered with Client Command `playSound`
 */

/**
 * @typedef {import("../types").SoundSources} SoundSources
 */

/** @type {SoundSources} */
const soundSources = {
  // TODO: reserved for ched.dev stream, please remove
  ...chedDevSources,

  // common sounds
  'airhorn': {
    audioSource: './sounds/air-horn.mp3',
    volume: 0.4
  },
  'applause': {
    audioSource: './sounds/applause-tv.mp3',
    volume: 0.4
  },
  'brb': {
    audioSource: './sounds/elevator-music.mp3',
    volume: 0.4
  },
  'chomp': {
    audioSource: './sounds/chomp-on-this.mp3',
    allowedRoles: ['broadcaster'],
    volume: 1.0
  },
  'clap': {
    audioSource: './sounds/applause-tv.mp3',
    volume: 0.4
  },
  'coin': {
    audioSource: './sounds/mario-coin.mp3',
    volume: 0.4
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
    volume: 0.4
  },
  'hold': {
    audioSource: './sounds/elevator-music.mp3',
    volume: 0.4
  },
  'larry': {
    audioSource: './sounds/larry.mp3',
    allowedRoles: ['broadcaster', 'moderator', 'vip'],
    volume: 0.4
  },
  'meow': {
    audioSource: './sounds/meow.mp3',
    volume: 0.4
  },
  'rimshot': {
    audioSource: './sounds/rimshot.mp3',
    volume: 0.4
  },
  'sad': {
    audioSource: './sounds/sad.mp3',
    volume: 0.4
  },
  'shit': {
    audioSource: './sounds/shit.mp3',
    volume: 1.0
  },
  'suspense': {
    audioSource: './sounds/mlb-charge.mp3',
    volume: 0.4
  },
  'womp': {
    audioSource: './sounds/womp.mp3',
    volume: 0.4
  },
  'wow': {
    audioSource: './sounds/wow.mp3',
    volume: 0.8
  },
}

export default soundSources