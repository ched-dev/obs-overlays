const env = require('./env');
const WebSocket = require('ws');
const socketListeners = {
  // [socket.id]: { [event-name]: eventCallback }
}

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

  const eventType = eventData.event_type; // channel-follow

  for (const [socketId, listeners] of Object.entries(socketListeners)) {
    if (listeners.hasOwnProperty(eventType) && typeof listeners[eventType] === "function") {
      listeners[eventType](eventData.event_data)
    }
  }
});

module.exports = {
  socket: ws,
  emitTwitchEventsOnSocket: (events, socket) => {
    const eventsWithSocket = {}

    events.map(({ eventName }) => {
      console.log(socket.id, "listening for:", eventName);
      eventsWithSocket[eventName] = (eventData) => {
        socket.emit(eventName, eventData);
        console.log(`${socket.id} received:`, eventName, eventData);
      }
    })

    socketListeners[socket.id] = eventsWithSocket
  },
  emitChatCommandsOnSocket: (commands, socket) => {

  }
};