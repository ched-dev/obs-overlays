const app = require('./app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { emitTwitchEventsOnSocket } = require('./tau-socket')

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Socket.io Client Connected", socket.id)

  // import is an esmodule thing
  const obsOverlaysConfig = await import('./pages/obs-overlays/config.mjs');

  emitTwitchEventsOnSocket(obsOverlaysConfig.eventListeners, socket);
});

const expressPort = process.env.PORT || 5000;

// express server
httpServer.listen(expressPort, async () => {    
  console.log(`Express Listening: http://localhost:${expressPort}`);
});
