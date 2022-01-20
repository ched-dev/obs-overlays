require('dotenv').config()

module.exports = {
  host_name: process.env.HOST_NAME || "localhost",
  port: process.env.PORT,
  twitch_user_id: process.env.TWITCH_USER_ID,
  twitch_user_name: process.env.TWITCH_USER_NAME,
  tau_port: process.env.TAU_PORT,
  tau_auth_token: process.env.TAU_AUTH_TOKEN,
  twitch_bot_user_name: process.env.TWITCH_BOT_USER_NAME,
  twitch_bot_channel_name: process.env.TWITCH_BOT_CHANNEL_NAME,
  twitch_bot_oauth_token: process.env.TWITCH_BOT_OAUTH_TOKEN
}