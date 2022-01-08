require('dotenv').config()

module.exports = {
  twitch_user_id: process.env.TWITCH_USER_ID,
  client_id: process.env.CLIENT_ID,
  access_token: process.env.ACCESS_TOKEN,
  client_secret: process.env.CLIENT_SECRET,
  secret: process.env.CLIENT_SECRET,
  twitch_oauth_token: process.env.TWITCH_OAUTH_TOKEN
}