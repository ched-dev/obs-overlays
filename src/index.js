const env = require('./env');
const middlewares = require('./middlewares');
const app = require('./app');
const { ClientCredentialsAuthProvider, StaticAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubMiddleware, EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok')

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// ERROR: listener.listen() hangs
console.log("src/index.js: Twurple Redemption Events");

const authProvider = new ClientCredentialsAuthProvider(env.client_id, env.client_secret);

// const authProvider = new StaticAuthProvider(env.client_id, env.access_token);
const apiClient = new ApiClient({ authProvider });



(async () => {
  const port = process.env.PORT || 5000;

  // const tokenInfo = await authProvider.getAccessToken();
  // console.log("token", token)
  // const appAuthProvider = new StaticAuthProvider(env.client_id, env.access_token, undefined, "app");
  // const apiClient = new ApiClient({ authProvider: appAuthProvider });

  const listener = new EventSubListener({
    apiClient,
    adapter: new NgrokAdapter(),
    secret: env.secret
  });

  const user = await apiClient.users.getUserByName("ched_dev");
  // 261129104
  console.log("user", user.id);

  const lner = listener.listen()
  console.log("listener", lner);
  // listener Promise { <pending> }
  lner.then(x => {
    console.log(`NGROK Listening: http://localhost:8000`, x);
  }).catch(x => {
    console.log("NGROK catch", x)
  })

  // documentation way, doesn't work
  // await listener.listen();
  // console.log(`NGROK Listening: http://localhost:8000`);

  // https://gist.github.com/OdatNurd/b9f450cb053d2138187596ddf2b554c5
  // what I did was run that, and then go to http://127.0.0.1:4040/inspect/http in browser


  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  // try {
    // await listener.subscribeToChannelFollowEvents(user, (data) => {
    //   console.log("Follow Event", data)
    //   socket.emit("follow", data)
    // })
    // await middleware.subscribeToChannelFollowEvents(env.twitch_user_id, event => {
    //   console.log(`${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`);
    // });
  // } catch(e) {
  //   console.log("Error", e)
  // }

  // express server
  app.listen(port, async () => {
    await listener.subscribeToChannelRedemptionAddEvents(user, (data) => {
      console.log("Redemption Event", data)
      socket.emit("follow", data)
    })
    
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`, /*app._router.stack*/);
    /* eslint-enable no-console */
  });
})()
