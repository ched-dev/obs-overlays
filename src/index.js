const env = require('./env');
const app = require('./app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { emitTwitchEventsOnSocket } = require('./tau-socket')

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log("Socket.io Client Connected", socket.id)

  emitTwitchEventsOnSocket({
    "channel-follow": (eventData) => {
      console.log("emitted channel-follow", eventData)
    },
    "channel-subscribe": (eventData) => {
      console.log("emitted channel-subscribe", eventData)
    }
  }, socket);
});

const expressPort = process.env.PORT || 5000;

// express server
httpServer.listen(expressPort, async () => {    
  console.log(`Express Listening: http://localhost:${expressPort}`);
});
