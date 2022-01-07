require('dotenv').config();

const middlewares = require('./middlewares');
const app = require('./app');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubMiddleware, EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok')

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const listener = new EventSubListener({
	apiClient,
	adapter: new NgrokAdapter(),
	secret: process.env.SECRET
});
// const middleware = new EventSubMiddleware({
//   apiClient,
//   hostName: 'd560-136-29-65-148.ngrok.io',
//   pathPrefix: '/twitch',
//   secret: process.env.SECRET
// });


(async () => {
  const port = process.env.PORT || 5000;

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

  // https://gist.github.com/OdatNurd/b9f450cb053d2138187596ddf2b554c5
  // what I did was run that, and then go to http://127.0.0.1:4040/inspect/http in browser


  io.on('connection', (socket) => {
    console.log('a user connected');
  });

  // try {
    await listener.subscribeToChannelFollowEvents(user, (data) => {
      console.log("Follow Event", data)
      socket.emit("follow", data)
    })
    // await middleware.subscribeToChannelFollowEvents( '125328655', event => {
    //   console.log(`${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`);
    // });
  // } catch(e) {
  //   console.log("Error", e)
  // }

  // express server
  app.listen(port, async () => {
    
    
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`, /*app._router.stack*/);
    /* eslint-enable no-console */
  });
})()
