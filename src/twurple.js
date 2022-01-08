const env = require('./env');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');

const { NgrokAdapter } = require('@twurple/eventsub-ngrok');
const { EventSubListener } = require('@twurple/eventsub');

// ERROR: listener.listen() hangs

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

  // Set up an EventSubListener instance to listen help us listen for our events
  const listener = new EventSubListener({
    apiClient: api,
    secret: env.secret,
    adapter: new NgrokAdapter(),
  });

  // The EventSubListener starts an internal web server on the port that we
  // configured to listen for the incoming events from Twitch. It's also
  // possible via Twurple MiddleWare to use this directly with an existing
  // express server if desired.
  //
  // This sets the server listening for incoming events that have been
  // registered with it. This needs to be done first because setting up a
  // listener for the first time requires Twitch to send us a verification that
  // we need to respond to.
  console.log(`Setting up for incoming Twitch events`);
  await listener.listen();

  console.log(`Listening for event: listen`);
  await listener.subscribeToChannelFollowEvents(env.twitch_user_id, event => {
    console.log('Received a follow event');
  });

  console.log('setup complete');
}

testEventSub();