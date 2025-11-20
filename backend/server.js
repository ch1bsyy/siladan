/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import http from "http";
import app from "./app.js"; // ini mengarah ke file yang kamu kirim tadi
import { Server } from "socket.io";
import registerSocketHandlers from "./src/socket/socket.js";

const server = http.createServer(app);

// Integrasi Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Daftarkan event socket
registerSocketHandlers(io);

// Export io agar bisa dipakai di controller
export { io };

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
