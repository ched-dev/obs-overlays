const app = require('./app');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { emitTwitchEventsOnSocket } = require('./tau-socket')
const { emitChatCommandsOnSocket } = require('./twitch-chat')

const expressPort = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer);

// socket.io connection used to send events to client
io.on("connection", async (socket) => {
  console.log("Socket.io Client Connected", socket.id)

  // import is an esmodule thing
  const obsOverlaysConfig = await import('./pages/obs-overlays/config/config.mjs');

  emitTwitchEventsOnSocket(obsOverlaysConfig.eventCommands, socket);
  emitChatCommandsOnSocket(obsOverlaysConfig.chatCommands, socket, obsOverlaysConfig.twitchChatConfig);
});

// express server
httpServer.listen(expressPort, async () => {    
  console.log(`Express Listening: http://localhost:${expressPort}`);
});
