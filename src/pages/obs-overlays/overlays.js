console.log("init overlays.js")

const socket = io();

// client-side
socket.on("connect", () => {
  console.log("Socket.io Connected:", socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log("Socket.io Disconnected:", socket.id); // undefined
});

socket.on("channel-follow", (eventData) => {
  console.log("channel-follow:", eventData);
});
