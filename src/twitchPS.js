const env = require('./env')
const TwitchPS = require('twitchps');

/**
 * NOTES:
 * - twitchps only supports listening for events
 * - twitchps supports: bits, bits-badge, channel-points, community-channel-points, subscriptions, whispers, stream-status, moderator-actions
 * - missing follows and highlight my message
 * - i don't understand the difference between community-points-channel-v1 and channel-points-channel-v1
 */
 
// Initial topics are required
let init_topics = [
  {topic: `channel-bits-events-v1.${env.twitch_user_id}`, token: env.access_token },
  {topic: `channel-bits-badge-unlocks.${env.twitch_user_id}`, token: env.access_token },
  {topic: `community-points-channel-v1.${env.twitch_user_id}`, token: env.access_token },
  {topic: `channel-subscribe-events-v1.${env.twitch_user_id}`, token: env.access_token }
];
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
  // from community-points-channel-v1

  // timestamp - {string} - Time the pubsub message was sent
  // redemption - {object} - Data about the redemption, includes unique id and user that redeemed it
  // channel_id - {string} - ID of the channel in which the reward was redeemed.
  // redeemed_at - {string} - Timestamp in which a reward was redeemed
  // reward - {object} - Data about the reward that was redeemed
  // user_input - {string} - [Optional] A string that the user entered if the reward requires input
  // status - {string} - reward redemption status, will be FULFULLED if a user skips the reward queue, UNFULFILLED otherwise
  console.log("--- reward redeemed", data);
  // Use data here
});

ps.on('channel-points', (data) => {
  // from channel-points-channel-v1

  // timestamp - {string} - Time the pubsub message was sent
  // redemption - {object} - Data about the redemption, includes unique id and user that redeemed it
  // channel_id - {string} - ID of the channel in which the reward was redeemed.
  // redeemed_at - {string} - Timestamp in which a reward was redeemed
  // reward - {object} - Data about the reward that was redeemed
  // user_input - {string} - [Optional] A string that the user entered if the reward requires input
  // status - {string} - reward redemption status, will be FULFULLED if a user skips the reward queue, UNFULFILLED otherwise
  console.log("--- channel points", data);
  // Use data here
});

ps.on('bits', (data) => {
  // badge_entitlement - {object} (v2 only)
  // bits_used - {integer}
  // channel_id - {string}
  // channel_name - {string}
  // chat_message - {string}
  // context - {string}
  // is_anonymous - {boolean} (v2 only)
  // message_id - {string}
  // message_type - {string}
  // time - {string}
  // total_bits_used - {integer}
  // user_id - {string}
  // user_name - {string}
  // version - {string}
  console.log("--- bits", data);
  // Use data here
});

ps.on('bits-badge', (data) => {
  // user_id - {string} - ID of user who earned the new Bits badge
  // user_name - {string} - Login of user who earned the new Bits badge
  // channel_id - {string} - ID of channel where user earned the new Bits badge
  // channel_name - {string} - Login of channel where user earned the new Bits badge
  // badge_tier - {int} - Value of Bits badge tier that was earned (1000, 10000, etc.)
  // chat_message - {string} - [Optional] Custom message included with share
  // time - {string} - Time when the bits were used. RFC 3339 format
  console.log("--- bits-badge", data);
  // Use data here
});

ps.on('community-points-all', (data) => {
  // type - {string}
  // timestamp - {string}
  // event - {object}
  console.log("--- community-points-all", data);
  // Use data here
});

ps.on('community-goal-created', (data) => {
  // timestamp - {string}
  // event - {object}
  console.log("--- community-goal-created", data);
  // Use data here
});

ps.on('community-goal-updated', (data) => {
  // timestamp - {string}
  // event - {object}
  console.log("--- community-goal-updated", data);
  // Use data here
});

ps.on('subscribe', (data) => {
  // user_name - {string}
  // display_name - {string}
  // channel_name - {string}
  // user_id - {string}
  // channel_id- {string}
  // time- {string}
  // sub_plan- {string}
  // sub_plan_name - {string}
  // months - {integer}
  // cumulative_months - {integer}
  // context - {string}
  // sub_message - {object}
  // sub_message.message - {string}
  // sub_message.emotes - {array}
  // recipient_id - {integer}
  // recipient_user_name - {string}
  // recipient_display_name - {string}
  console.log("--- subscribe", data);
  // Use data here
});
