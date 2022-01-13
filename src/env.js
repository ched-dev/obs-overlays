require('dotenv').config()

module.exports = {
  host_name: process.env.HOST_NAME || "localhost",
  port: process.env.PORT,
  twitch_user_id: process.env.TWITCH_USER_ID,
  client_id: process.env.CLIENT_ID,
  access_token: process.env.ACCESS_TOKEN,
  client_secret: process.env.CLIENT_SECRET,
  secret: process.env.CLIENT_SECRET,
  twitch_oauth_token: process.env.TWITCH_OAUTH_TOKEN,
  tau_port: process.env.TAU_PORT,
  tau_auth_token: process.env.TAU_AUTH_TOKEN
}