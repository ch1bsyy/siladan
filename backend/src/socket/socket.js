// ============================================
// DUMMY DATA - Ganti dengan query database
// ============================================

// Data user dengan role: helpdesk atau pelapor
const DUMMY_USERS = [
  { 
    id: 1, 
    nama: "Helpdesk Andi", 
    email: "andi.helpdesk@siladan.com", 
    role: "helpdesk",
    avatar: "https://ui-avatars.com/api/?name=Andi+HD"
  },
  { 
    id: 2, 
    nama: "Helpdesk Budi", 
    email: "budi.helpdesk@siladan.com", 
    role: "helpdesk",
    avatar: "https://ui-avatars.com/api/?name=Budi+HD"
  },
  { 
    id: 3, 
    nama: "Siti (Pelapor)", 
    email: "siti@customer.com", 
    role: "pelapor",
    avatar: "https://ui-avatars.com/api/?name=Siti"
  },
  { 
    id: 4, 
    nama: "Joko (Pelapor)", 
    email: "joko@customer.com", 
    role: "pelapor",
    avatar: "https://ui-avatars.com/api/?name=Joko"
  },
  { 
    id: 5, 
    nama: "Rina (Pelapor)", 
    email: "rina@customer.com", 
    role: "pelapor",
    avatar: "https://ui-avatars.com/api/?name=Rina"
  }
];

// Data tiket: setiap tiket adalah 1 room chat
const DUMMY_TICKETS = [
  { 
    id_tiket: 101, 
    no_tiket: "TKT-2025-001",
    judul: "Laptop tidak bisa nyala",
    pelapor_id: 3,        // Siti (yang buat ticket)
    helpdesk_id: 1,       // Andi Helpdesk (yang handle)
    status: "open",
    created_at: "2025-11-20T10:00:00Z"
  },
  { 
    id_tiket: 102, 
    no_tiket: "TKT-2025-002",
    judul: "Printer tidak bisa print",
    pelapor_id: 4,        // Joko
    helpdesk_id: 2,       // Budi Helpdesk
    status: "in_progress",
    created_at: "2025-11-21T14:30:00Z"
  },
  { 
    id_tiket: 103, 
    no_tiket: "TKT-2025-003",
    judul: "Internet lambat",
    pelapor_id: 5,        // Rina
    helpdesk_id: 1,       // Andi Helpdesk
    status: "open",
    created_at: "2025-11-22T09:15:00Z"
  }
];

// Dummy chat history (nanti save ke database)
const CHAT_HISTORY = [];

// Track online users per ticket
const ONLINE_USERS = {};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Validasi user dari database
const validateUser = (userId) => {
  const user = DUMMY_USERS.find(u => u.id === userId);
  
  if (!user) {
    return { valid: false, error: "User tidak ditemukan" };
  }
  
  return { valid: true, user };
};

// Validasi akses ke ticket
const validateTicketAccess = (userId, ticketId) => {
  const ticket = DUMMY_TICKETS.find(t => t.id_tiket === ticketId);
  
  if (!ticket) {
    return { valid: false, error: "Ticket tidak ditemukan" };
  }
  
  const user = DUMMY_USERS.find(u => u.id === userId);
  
  // Cek akses: hanya pelapor atau helpdesk yang handle ticket ini
  const hasAccess = 
    ticket.pelapor_id === userId ||  // Pelapor yang buat ticket
    ticket.helpdesk_id === userId;   // Helpdesk yang handle
  
  if (!hasAccess) {
    return { 
      valid: false, 
      error: `${user.role === 'pelapor' ? 'Pelapor' : 'Helpdesk'} tidak memiliki akses ke ticket ini` 
    };
  }
  
  return { valid: true, ticket };
};

// Get chat history untuk ticket tertentu
const getChatHistory = (ticketId) => {
  return CHAT_HISTORY.filter(chat => chat.ticketId === ticketId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

// Save chat ke history (nanti ganti dengan save ke database)
const saveChatMessage = (messageData) => {
  CHAT_HISTORY.push(messageData);
  // TODO: Save to database
  // await supabase.from('chat_messages').insert(messageData);
};

// Get online users in a ticket
const getOnlineUsersInTicket = (ticketId) => {
  return ONLINE_USERS[ticketId] || [];
};

// ============================================
// SOCKET HANDLERS
// ============================================

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ========================================
    // EVENT: join_ticket_chat
    // User join ke room chat ticket tertentu
    // ========================================
    socket.on("join_ticket_chat", (data) => {
      try {
        console.log("📥 Received join_ticket_chat:", data);
        
        const { userId, ticketId } = data;

        // Validasi input
        if (!userId || !ticketId) {
          socket.emit("error", { 
            message: "Data tidak lengkap", 
            error: "userId dan ticketId required",
            received: data
          });
          console.log("❌ Invalid input:", data);
          return;
        }

        // 1. Validasi user
        const userValidation = validateUser(userId);
        if (!userValidation.valid) {
          socket.emit("error", { 
            message: "Autentikasi gagal", 
            error: userValidation.error,
            userId: userId
          });
          console.log(`❌ User validation failed for userId ${userId}`);
          return;
        }

        // 2. Validasi akses ke ticket
        const ticketValidation = validateTicketAccess(userId, ticketId);
        if (!ticketValidation.valid) {
          socket.emit("error", { 
            message: "Akses ditolak", 
            error: ticketValidation.error,
            userId: userId,
            ticketId: ticketId
          });
          console.log(`❌ Access denied for userId ${userId} to ticket ${ticketId}`);
          return;
        }

        // 3. Simpan info user ke socket
        const user = userValidation.user;
        const ticket = ticketValidation.ticket;
      
      socket.userId = user.id;
      socket.userName = user.nama;
      socket.userRole = user.role;  // "helpdesk" atau "pelapor"
      socket.userAvatar = user.avatar;
      socket.ticketId = ticketId;

      // 4. Join ke room ticket
      const roomName = `ticket:${ticketId}`;
      socket.join(roomName);

      // 5. Track online users
      if (!ONLINE_USERS[ticketId]) {
        ONLINE_USERS[ticketId] = [];
      }
      ONLINE_USERS[ticketId].push({
        socketId: socket.id,
        userId: user.id,
        userName: user.nama,
        userRole: user.role,
        avatar: user.avatar,
        joinedAt: new Date()
      });

      // 6. Kirim chat history ke user yang baru join
      const chatHistory = getChatHistory(ticketId);
      socket.emit("chat_history", {
        ticketId,
        messages: chatHistory
      });

      // 7. Kirim info ticket & user yang authenticated
      socket.emit("joined_ticket_chat", {
        ticket: {
          id: ticket.id_tiket,
          no: ticket.no_tiket,
          judul: ticket.judul,
          status: ticket.status
        },
        user: {
          id: user.id,
          nama: user.nama,
          role: user.role,  // ← ROLE JELAS DI SINI
          avatar: user.avatar
        },
        onlineUsers: getOnlineUsersInTicket(ticketId)
      });

      // 8. Broadcast ke user lain di room: ada user baru join
      socket.to(roomName).emit("user_joined_chat", {
        userId: user.id,
        userName: user.nama,
        userRole: user.role,  // ← ROLE TERLIHAT OLEH USER LAIN
        avatar: user.avatar,
        ticketId
      });

      console.log(`✅ ${user.role.toUpperCase()} "${user.nama}" joined chat ticket ${ticket.no_tiket}`);
      
      } catch (error) {
        console.error("❌ Error in join_ticket_chat:", error);
        socket.emit("error", { 
          message: "Terjadi kesalahan server", 
          error: error.message 
        });
      }
    });

    // ========================================
    // EVENT: send_chat_message
    // Kirim pesan dalam ticket chat
    // ========================================
    socket.on("send_chat_message", (data) => {
      // Validasi: user harus sudah join ticket dulu
      if (!socket.userId || !socket.ticketId) {
        socket.emit("error", { 
          message: "Anda belum join ke chat. Gunakan join_ticket_chat dulu." 
        });
        return;
      }

      const { message } = data;

      // Buat message object
      const messageData = {
        id: Date.now(), // nanti ganti dengan ID dari database
        ticketId: socket.ticketId,
        senderId: socket.userId,
        senderName: socket.userName,
        senderRole: socket.userRole,  // ← ROLE PENGIRIM JELAS
        senderAvatar: socket.userAvatar,
        message: message,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      // Save ke history (nanti save ke database)
      saveChatMessage(messageData);

      // Broadcast ke semua user di room ticket ini
      io.to(`ticket:${socket.ticketId}`).emit("new_chat_message", messageData);

      console.log(`💬 [${socket.userRole.toUpperCase()}] ${socket.userName}: ${message.substring(0, 50)}...`);
    });

    // ========================================
    // EVENT: typing
    // Typing indicator
    // ========================================
    socket.on("typing", () => {
      if (!socket.ticketId) return;

      socket.to(`ticket:${socket.ticketId}`).emit("user_typing", {
        userId: socket.userId,
        userName: socket.userName,
        userRole: socket.userRole  // ← ROLE YANG SEDANG TYPING
      });
    });

    // ========================================
    // EVENT: stop_typing
    // Stop typing indicator
    // ========================================
    socket.on("stop_typing", () => {
      if (!socket.ticketId) return;

      socket.to(`ticket:${socket.ticketId}`).emit("user_stop_typing", {
        userId: socket.userId
      });
    });

    // ========================================
    // EVENT: mark_as_read
    // Mark chat messages as read
    // ========================================
    socket.on("mark_as_read", (data) => {
      const { ticketId, messageIds } = data;
      
      // TODO: Update database
      // await supabase.from('chat_messages')
      //   .update({ isRead: true })
      //   .in('id', messageIds);

      socket.to(`ticket:${ticketId}`).emit("messages_read", {
        userId: socket.userId,
        messageIds
      });
    });

    // ========================================
    // EVENT: disconnect
    // User disconnect dari socket
    // ========================================
    socket.on("disconnect", () => {
      if (socket.userId && socket.ticketId) {
        // Remove dari online users
        if (ONLINE_USERS[socket.ticketId]) {
          ONLINE_USERS[socket.ticketId] = ONLINE_USERS[socket.ticketId]
            .filter(u => u.socketId !== socket.id);
        }

        // Notify user lain
        socket.to(`ticket:${socket.ticketId}`).emit("user_left_chat", {
          userId: socket.userId,
          userName: socket.userName,
          userRole: socket.userRole  // ← ROLE YANG DISCONNECT
        });

        console.log(`❌ ${socket.userRole.toUpperCase()} "${socket.userName}" left chat`);
      }

      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
}
