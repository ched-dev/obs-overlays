const env = require('./env');
const app = require('./app');
const { ClientCredentialsAuthProvider, StaticAuthProvider, getTokenInfo } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { ChatClient } = require('@twurple/chat');

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// Creates an App Token
// const authProvider = new ClientCredentialsAuthProvider(env.client_id, env.client_secret);

// Connects with generated accessToken
const authProvider = new StaticAuthProvider(env.client_id, env.twitch_oauth_token);

// Helix API
// const apiClient = new ApiClient({ authProvider });

// Chat API
const chatClient = new ChatClient({ channels: ['ched_dev'] });

(async () => {
  const port = process.env.PORT || 5000;

  await chatClient.connect();
  console.log("chatClient connected");

  chatClient.onAnyMessage((message) => {
    console.log("Message", message)
  })

  const tokenInfo = await getTokenInfo(env.access_token, env.client_id)
  console.log("tokenInfo", {
    scopes: tokenInfo.scopes,
    userName: tokenInfo.userName,
    userId: tokenInfo.userId
  })

  // const user = await apiClient.users.getUserByName("ched_dev");
  // 261129104
  // console.log("user", user.id);


  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  // express server
  app.listen(port, async () => {    
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`, /*app._router.stack*/);
    /* eslint-enable no-console */
  });
})()
