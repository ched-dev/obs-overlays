// @ts-check

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
  'airhorn': {
    audioSource: 'sounds/air-horn.mp3',
    volume: 0.2
  },
  'afroman': {
    audioSource: 'sounds/ched.dev/afroman-because-i-got-high.m4a',
    volume: 0.4
  },
  'anotherone': {
    audioSource: 'sounds/dj-khaled-another-one.mp3',
    volume: 1.0
  },
  'applause': {
    audioSource: 'sounds/applause-tv.mp3',
    volume: 0.2
  },
  'art': {
    audioSource: 'sounds/ched.dev/30-rock-i-dont-understand-your-art.m4a',
    volume: 1.0
  },
  'babysteps': {
    audioSource: 'sounds/ched.dev/what-about-bob-baby-steps.m4a',
    volume: 1.0
  },
  'boring': {
    audioSource: 'sounds/simpsons-homer-boring.mp3',
  },
  'brb': {
    audioSource: 'sounds/elevator-music.mp3',
    volume: 0.4
  },
  'cheese': {
    audioSource: 'sounds/ched.dev/30-rock-working-on-my-night-cheese.m4a',
  },
  'chomp': {
    audioSource: 'sounds/chomp-on-this.mp3',
    allowedRoles: ['broadcaster'],
    volume: 1.0
  },
  'clap': {
    audioSource: 'sounds/applause-tv.mp3',
    volume: 0.2
  },
  'coin': {
    audioSource: 'sounds/mario-coin.mp3',
    volume: 0.4
  },
  'crickets': {
    audioSource: 'sounds/crickets-chirping.mp3',
    volume: 0.4
  },
  'dark': {
    audioSource: 'sounds/hello-darkness.mp3',
    volume: 1.0
  },
  'dead': {
    audioSource: 'sounds/mario-death.mp3',
    volume: 0.2
  },
  'dontcare': {
    audioSource: 'sounds/ched.dev/office-space-i-just-dont-care.m4a',
    volume: 1.0
  },
  'eyes': {
    audioSource: 'sounds/simpsons-my-eyes-goggles.mp3',
    volume: 1.0
  },
  'funny': {
    audioSource: 'sounds/ched.dev/bobs-burgers-funny-in-the-wall.m4a',
    volume: 1.0
  },
  'hold': {
    audioSource: 'sounds/elevator-music.mp3',
    volume: 0.4
  },
  'hydrate': {
    audioSource: 'sounds/ched.dev/bttf-hydrate-level-4-please.m4a',
    volume: 0.8
  },
  'ihatemylife': {
    audioSource: 'sounds/ched.dev/youth-brigade-i-hate-my-life.m4a',
    allowedRoles: ['broadcaster', 'moderator', 'vip', 'subscriber'],
    volume: 0.4
  },
  'gigawhat': {
    audioSource: 'sounds/ched.dev/bttf-1.21-gigawatts.m4a',
    volume: 0.8
  },
  'larry': {
    audioSource: 'sounds/larry.mp3',
    allowedRoles: ['broadcaster', 'moderator', 'vip'],
    volume: 0.3
  },
  'listen': {
    audioSource: 'sounds/simpsons-shut-up-for-a-sec.mp3',
  },
  'meow': {
    audioSource: 'sounds/meow.mp3',
    volume: 0.4
  },
  'meowmix': {
    audioSource: 'sounds/ched.dev/dr-evil-meow-mix.m4a',
    volume: 0.6
  },
  'miscount': {
    audioSource: 'sounds/ched.dev/30-rock-miscounted-the-men.m4a',
    volume: 0.6
  },
  'nailedit': {
    audioSource: 'sounds/ched.dev/wamu-ad-tom-nailed-it.m4a'
  },
  'nerd': {
    audioSource: 'sounds/simpsons-homer-nerd.m4a',
    volume: 1.0
  },
  'noah': {
    audioSource: 'sounds/ched.dev/howard-stern-maria-menounos-noah.m4a',
    volume: 0.6
  },
  'repeat': {
    audioSource: 'sounds/simpsons-homer-repeat.mp3',
    volume: 0.6
  },
  'rimshot': {
    audioSource: 'sounds/rimshot.mp3',
    volume: 0.4
  },
  'rude': {
    audioSource: 'sounds/ched.dev/30-rock-rude.m4a',
  },
  'sad': {
    audioSource: 'sounds/sad.mp3',
    volume: 0.2
  },
  'sax': {
    audioSource: 'sounds/simpsons-saxamaphone.mp3',
  },
  'seinfeld': {
    audioSource: 'sounds/seinfeld-intro.mp3',
  },
  'shitt': {
    audioSource: 'sounds/sheeeit.mp3',
    volume: 1.0
  },
  'shutup': {
    audioSource: 'sounds/simpsons-shut-up-for-a-sec.mp3',
  },
  'stop': {
    audioSource: 'sounds/simpsons-stop-hes-already-dead.mp3',
    volume: 0.4
  },
  'suspense': {
    audioSource: 'sounds/mlb-charge.mp3',
    volume: 0.4
  },
  'womp': {
    audioSource: 'sounds/womp.mp3',
    volume: 0.2
  },
  'wow': {
    audioSource: 'sounds/wow.mp3',
    volume: 0.8
  },
  'yoink': {
    audioSource: 'sounds/simpsons-bart-yoink.mp3',
    volume: 0.4
  },
}

export default soundSources