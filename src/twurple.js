const env = require('./env');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');

// const { NgrokAdapter } = require('@twurple/eventsub-ngrok');
const { ReverseProxyAdapter, EventSubListener } = require('@twurple/eventsub');

// ERROR: listener.listen() hangs

console.log("twurple.js: w/ ReverseProxyAdapter")

async function testEventSub() {
  // Create an auth provider tied to our application's client ID and secret.
  const authProvider = new ClientCredentialsAuthProvider(
    env.client_id,
    env.client_secret
  );

  // Create a Twitch API instance from which we can make requests. This will
  // be tied to the app token. The app tokens are good for 60 days, so the
  // client provider may fetch a new one as needed.
  const api = new ApiClient({ authProvider });

  // Setup an Ngrok adapter which initiates on port 8000
  // const adapter = new NgrokAdapter(env.port);
  
  // Setup the adapter to map external to internal
  const adapter = new ReverseProxyAdapter({
    hostName: env.host_name,
    port: env.port
  });
  console.log(`ReverseProxyAdapter: ${env.host_name}:${env.port}`);

  // Set up an EventSubListener instance to listen help us listen for our events
  const listener = new EventSubListener({
    apiClient: api,
    secret: env.secret,
    adapter,
  });
  console.log(`EventSubListener created`);

  // The EventSubListener starts an internal web server on the port that we
  // configured to listen for the incoming events from Twitch. It's also
  // possible via Twurple MiddleWare to use this directly with an existing
  // express server if desired.
  //
  // This sets the server listening for incoming events that have been
  // registered with it. This needs to be done first because setting up a
  // listener for the first time requires Twitch to send us a verification that
  // we need to respond to.
  await listener.listen();
  console.log(`started listener.listen()`);

  await listener.subscribeToChannelRedemptionAddEvents(env.twitch_user_id, (data) => {
    console.log("Redemption Event", data)
  });
  console.log(`started listening for event: redemption`);

  const hostName = await adapter.getHostName()
  const ngrokPort = await adapter.getListenerPort()
  console.log(`Complete: ${hostName}:${ngrokPort}`);
}

testEventSub();