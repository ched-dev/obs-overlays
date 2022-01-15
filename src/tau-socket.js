const env = require('./env');
const WebSocket = require('ws');
const socketListeners = {
  // [socket.id]: { [event-name]: eventCallback }
}

module.exports = {
  tauSocket: null,
  tauSocketUrl: `ws://localhost:${env.tau_port}/ws/twitch-events/`,
  init() {
    this.tauSocket = new WebSocket(this.tauSocketUrl);

    this.tauSocket.on('open', () => {
      console.log("Socket Open:", this.tauSocketUrl)
    
      // initiate events to this socket
      this.tauSocket.send(
        JSON.stringify({
          token: env.tau_auth_token
        })
      );
    
      console.log("TAU Connected and listening for events...");
    });
    
    this.tauSocket.on('message', (data) => {
      const eventData = JSON.parse(data);
      console.log('--- message', eventData);
    
      const eventType = eventData.event_type; // channel-follow
    
      for (const [socketId, listeners] of Object.entries(socketListeners)) {
        if (listeners.hasOwnProperty(eventType) && typeof listeners[eventType] === "function") {
          listeners[eventType](eventData.event_data)
        }
      }
    });
  },
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