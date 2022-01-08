const env = require('./env')
const TwitchWebhook = require('twitch-webhook')

// ERROR: WebSub is deprecated and will be shutdown on September 16, 2021. Applications that have not accessed WebSub before June 16, 2021 no longer have access to WebSub. Consider using EventSub for Webhooks instead. For more information on the WebSub shutdown plan, see https://discuss.dev.twitch.tv/t/deprecation-of-websub-based-webhooks and the EventSub documentation at https://dev.twitch.tv/docs/eventsub.

const twitchWebhook = new TwitchWebhook({
  client_id: env.client_id,
  access_token: env.access_token,
  client_secret: env.client_secret,
  callback: 'localhost:4343',
  secret: env.secret, // default: false
  // lease_seconds: 259200,    // default: 864000 (maximum value)
  listen: {
    port: env.port,             // default: 8443
    host: '0.0.0.0',      // default: 0.0.0.0
    autoStart: true        // default: true
  }
})

// set listener for all topics
twitchWebhook.on('*', ({ topic, options, endpoint, event }) => {
  // topic name, for example "streams"
  console.log("--- topic", topic)
  // topic options, for example "{user_id: 12826}"
  console.log("--- options", options)
  // full topic URL, for example
  // "https://api.twitch.tv/helix/streams?user_id=12826"
  console.log("--- endpoint", endpoint)
  // topic data, timestamps are automatically converted to Date
  console.log("--- event", event)
})

// set listener for topic
twitchWebhook.on('users/follows', ({ event }) => {
  console.log("--- user/follows event", event)
})

// subscribe to topic
twitchWebhook.subscribe('users/follows', {
  first: 1,
  from_id: env.twitch_user_id
})

// renew the subscription when it expires
// twitchWebhook.on('unsubscribe', (obj) => {
//   twitchWebhook.subscribe(obj['hub.topic'])
// })

// tell Twitch that we no longer listen
// otherwise it will try to send events to a down app
process.on('SIGINT', () => {
  // unsubscribe from all topics
  twitchWebhook.unsubscribe('*')

  // or unsubscribe from each one individually
  // twitchWebhook.unsubscribe('users/follows', {
  //   first: 1,
  //   to_id: env.twitch_user_id
  // })

  process.exit(0)
})