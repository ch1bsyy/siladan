export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", (data) => {
      io.emit("new_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
