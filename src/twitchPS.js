const env = require('./env')
const TwitchPS = require('twitchps');

// ERROR: Connects but doesn't seem to get events
 
// Initial topics are required
let init_topics = [
  {topic: `channel-points-channel-v1.${env.twitch_user_id}`, token: env.access_token },
  {topic: `community-points-channel-v1.${env.twitch_user_id}`, token: env.access_token },
];
// Optional reconnect, debug options (Defaults: reconnect: true, debug: false)
var ps = new TwitchPS({init_topics: init_topics, reconnect: true, debug: true});

ps.on('connected', (x) => {
  console.log("connected", x)
});

ps.on('disconnected', (x) => {
  console.log("- disconnected", x)
});

ps.on('reconnected', (x) => {
  console.log("- reconnected", x)
});

ps.on('reward-redeemed', (data) => {
  console.log("--- reward redeemed", data);
  // Use data here
});

ps.on('channel-points', (data) => {
  console.log("--- reward redeemed", data);
  // Use data here
});