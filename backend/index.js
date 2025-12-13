const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const server = http.createServer(app);

// Konfigurasi Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Ganti dengan URL frontend saat production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userId = String(socket.handshake.query.userId);
  const role = socket.handshake.query.role;

  console.log(`User Connect: ${userId} | Role: ${role}`);

  // --- LOGIC JOIN ROOM ---
  if (role === "helpdesk") {
    // Jika dia mengaku sebagai 'helpdesk' (dari ChatPage), masukkan ke Room Staff
    socket.join("staff_room");
    console.log(`>>> ${userId} joined STAFF_ROOM (Siap terima pesan)`);
  } else {
    // Jika dia 'pegawai' biasa atau 'masyarakat', masuk room privat
    socket.join(userId);
    console.log(`>>> ${userId} joined PRIVATE ROOM`);
  }

  // --- LOGIC KIRIM PESAN ---
  socket.on("kirim_pesan", (data) => {
    console.log(`Pesan dari ${data.sender} ke ${data.recipientId}`);

    if (data.recipientId === "staff_room") {
      io.to("staff_room").emit("pesan_masuk_staff", data);
    } else {
      // Pastikan kirim ke room String
      io.to(String(data.recipientId)).emit("pesan_masuk_user", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnect", userId);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket Server berjalan di port ${PORT}`);
});
