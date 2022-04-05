// @ts-check
const env = require('./env');
const WebSocket = require('ws');

/**
 * @typedef {import("./pages/obs-overlays/types").EventCommands} EventCommands
 * @typedef {import("./pages/obs-overlays/types").EventCommandCallbackData} EventCommandCallbackData
 * @typedef {import("./pages/obs-overlays/types").TauSocket} TauSocket
 * @typedef {import("./pages/obs-overlays/types").TauSocketListeners} TauSocketListeners
 * @typedef {import("./pages/obs-overlays/types").TauSocketListenerEvents} TauSocketListenerEvents
 * @typedef {import("./pages/obs-overlays/types").TauSocketListenerEventCallback} TauSocketListenerEventCallback
 * @typedef {import("./pages/obs-overlays/types").Socket} Socket
 */

/** @type {TauSocketListeners} */
const socketListeners = {
  // [socket.id]: { [event-name]: eventCallback }
}

/**
 * @type {TauSocket}
 */
const tauSocket = {
  tauSocket: null,
  tauSocketUrl: `wss://${env.tau_host}:${env.tau_port}/ws/twitch-events/`,
  init() {
    this.tauSocket = new WebSocket(this.tauSocketUrl);

    this.tauSocket.on('open', () => {
      console.log("TAU Socket Open:", this.tauSocketUrl)
    
      // initiate events to this socket
      this.tauSocket.send(
        JSON.stringify({
          token: env.tau_auth_token
        })
      );
    
      console.log("TAU Connected and listening for events...");
    });
    
    this.tauSocket.on('message', (/** @type {string} **/ data) => {
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
  emitTwitchEventsOnSocket: (eventCommands, socket) => {
    /** @type {TauSocketListenerEvents} */
    const eventsWithSocket = {}

    eventCommands.map(({ eventName }) => {
      console.log(socket.id, "listening for eventCommand:", eventName);
      
      /** @type {TauSocketListenerEventCallback} */
      const commandEmitter = (eventData) => {
        // emit the channel-follow to the client for eventCommandCallback() handling
        socket.emit(eventName, eventData);
        console.log(`${socket.id} emitted eventCommand from server:`, {
          eventName,
          eventData
        });
      }

      eventsWithSocket[eventName] = commandEmitter
    })

    socketListeners[socket.id] = eventsWithSocket
  },
};

module.exports = tauSocket;