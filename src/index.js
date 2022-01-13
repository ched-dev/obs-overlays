const env = require('./env');
const app = require('./app');
const WebSocket = require('ws');

const expressPort = process.env.PORT || 5000;

const tauSocketUrl = `ws://localhost:${env.tau_port}/ws/twitch-events/`;
console.log("TAU Socket URL:", tauSocketUrl);

const ws = new WebSocket(tauSocketUrl);

ws.on('open', () => {
  console.log("Socket Open:", tauSocketUrl)

  // initiate events to this socket
  ws.send(
    JSON.stringify({
      token: env.tau_auth_token
    })
  );

  console.log("TAU Connected and listening for events...");
});

ws.on('message', (data) => {
  const eventData = JSON.parse(data);
  console.log('--- message', eventData);
});

// express server
app.listen(expressPort, async () => {    
  console.log(`Express Listening: http://localhost:${expressPort}`);
});
