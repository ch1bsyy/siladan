/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiSend,
  FiFilePlus,
  FiInfo,
  FiX,
  FiUser,
} from "react-icons/fi";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

// --- KONFIGURASI SOCKET ---
// Socket.io server ada di root URL, bukan di path /api/v1/...
const SOCKET_URL =
  "https://siladan-rest-api-711057748791.asia-southeast2.run.app";

// Inisialisasi socket di luar komponen agar singleton
const socket = io(SOCKET_URL, {
  autoConnect: false, // Penting: Jangan auto connect dulu
  transports: ["polling", "websocket"], // Biarkan diawali polling dulu agar aman
  withCredentials: true, // Urutan transport: WebSocket dulu, fallback ke Polling
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Data user login (pegawai/helpdesk)

  // --- STATE MANAGEMENT ---
  const [conversations, setConversations] = useState([]); // Daftar User (Sidebar)
  const [messages, setMessages] = useState({}); // Mapping pesan per User ID
  const [selectedId, setSelectedId] = useState(null); // ID User yang aktif dibuka
  const [newMessage, setNewMessage] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // 'connected', 'disconnected', 'error'

  const messagesEndRef = useRef(null);

  // --- 1. SETUP KONEKSI SOCKET (USE EFFECT) ---
  useEffect(() => {
    if (user) {
      console.log("🔄 Helpdesk Staff Connecting...");
      setConnectionStatus("connecting");

      // Update query params sebelum connect
      socket.io.opts.query = {
        userId: user.id,
        role: "helpdesk", // Role khusus untuk staff agar masuk room 'staff_room'
      };

      socket.connect();

      // --- EVENT LISTENERS ---

      const onConnect = () => {
        console.log("✅ Helpdesk Connected! Socket ID:", socket.id);
        setConnectionStatus("connected");
        // Setelah connect, minta daftar percakapan
        socket.emit("get_conversations", { userId: user.id });
      };

      const onDisconnect = (reason) => {
        console.warn("⚠️ Socket Disconnected:", reason);
        setConnectionStatus("disconnected");
      };

      const onConnectError = (err) => {
        console.error("❌ Socket Connection Error:", err.message);
        setConnectionStatus("error");
      };

      const onConversations = (data) => {
        console.log("📋 Conversations loaded:", data);
        handleConversationsList(data);
      };

      const onConversationMessages = ({ conversationId, messages }) => {
        console.log("💬 Messages loaded for:", conversationId);
        handleConversationMessages(conversationId, messages);
      };

      const onReceiveMessage = (data) => {
        console.log("📨 Pesan diterima:", data);
        handleIncomingMessage(data);
      };

      // Pasang Listeners
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("connect_error", onConnectError);
      socket.on("conversations", onConversations);
      socket.on("conversation_messages", onConversationMessages);
      socket.on("receive_message", onReceiveMessage);

      // Cleanup saat unmount / user logout
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("connect_error", onConnectError);
        socket.off("conversations", onConversations);
        socket.off("conversation_messages", onConversationMessages);
        socket.off("receive_message", onReceiveMessage);

        socket.disconnect();
      };
    }
  }, [user]); // Re-run hanya jika user berubah

  // --- 2. LOGIC HANDLER DATA ---

  // Handle Pesan Masuk (Realtime)
  const handleIncomingMessage = (data) => {
    // Data: { id, sender_id, recipient_id, message, created_at, ... }
    const senderId = String(data.sender_id);
    const recipientId = String(data.recipient_id);
    const myId = String(user?.id);

    // Tentukan siapa lawan bicara
    // Jika pesan dari saya -> lawan bicara adalah recipient
    // Jika pesan untuk saya/staff -> lawan bicara adalah sender
    const otherUserId = senderId === myId ? recipientId : senderId;
    const isFromMe = senderId === myId;

    // A. Update Messages State
    setMessages((prev) => {
      const currentMessages = prev[otherUserId] || [];
      // Cegah duplikat pesan (jika ID sama)
      if (currentMessages.some((m) => m.id === data.id)) return prev;

      return {
        ...prev,
        [otherUserId]: [
          ...currentMessages,
          {
            id: data.id || Date.now(),
            sender: isFromMe ? "helpdesk" : "user",
            text: data.message,
            time: data.created_at
              ? new Date(data.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Now",
          },
        ],
      };
    });

    // B. Update Sidebar (Conversations List)
    setConversations((prev) => {
      const index = prev.findIndex((c) => String(c.id) === otherUserId);
      let newConvos = [...prev];

      if (index > -1) {
        // User sudah ada di list -> Update last message & unread count
        const existing = newConvos[index];
        // Jika sedang chat dengan user ini, unread tetap 0. Jika tidak, tambah 1.
        const isChatOpen = String(selectedId) === otherUserId;

        newConvos[index] = {
          ...existing,
          lastMessage: data.message,
          unread: isChatOpen ? 0 : (existing.unread || 0) + 1,
          // Pindahkan ke paling atas (opsional, tp UX bagus)
          // timestamp: Date.now()
        };

        // (Opsional) Pindahkan ke index 0 agar naik ke atas
        // const item = newConvos.splice(index, 1)[0];
        // newConvos.unshift(item);
      } else {
        // User baru -> Tambahkan ke list
        // Hanya tambahkan jika pesan BUKAN dari saya (pesan masuk baru)
        if (!isFromMe) {
          newConvos.unshift({
            id: otherUserId,
            name: `User ${otherUserId}`, // Idealnya nama user dari DB, sementara ID dulu
            avatar: `https://ui-avatars.com/api/?name=${otherUserId}&background=random`,
            lastMessage: data.message,
            unread: 1,
          });
        }
      }
      return newConvos;
    });
  };

  // Handle Load List Percakapan
  const handleConversationsList = (data) => {
    if (!Array.isArray(data)) return;

    const formatted = data.map((c) => ({
      id: String(c.id || c.user_id), // Pastikan ID string
      name: c.full_name || c.username || `User ${c.id}`,
      avatar:
        c.avatar ||
        `https://ui-avatars.com/api/?name=${
          c.full_name || c.username || c.id
        }&background=random`,
      lastMessage: c.lastMessage || "",
      unread: c.unread || 0,
    }));
    setConversations(formatted);
  };

  // Handle Load History Pesan
  const handleConversationMessages = (conversationId, rawMessages) => {
    if (!Array.isArray(rawMessages)) return;

    const formatted = rawMessages.map((msg) => ({
      id: msg.id,
      sender: String(msg.sender_id) === String(user?.id) ? "helpdesk" : "user",
      text: msg.message,
      time: msg.created_at
        ? new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Now",
    }));

    setMessages((prev) => ({
      ...prev,
      [String(conversationId)]: formatted,
    }));
  };

  // --- 3. UI HELPERS & EFFECTS ---

  const activeConversation = useMemo(
    () => (selectedId ? messages[String(selectedId)] || [] : []),
    [selectedId, messages]
  );

  const activeUser = useMemo(
    () => conversations.find((c) => c.id === selectedId),
    [selectedId, conversations]
  );

  // Auto Scroll ke bawah saat pesan baru masuk / ganti chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation, selectedId]);

  // Reset Unread saat buka chat
  useEffect(() => {
    if (selectedId) {
      // 1. Reset di UI Frontend
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, unread: 0 } : c))
      );

      // 2. Request History Pesan ke Server
      if (user) {
        console.log("📥 Fetching messages for:", selectedId);
        socket.emit("get_messages", {
          conversationId: selectedId,
          userId: user.id,
        });

        // (Opsional) Emit event 'mark_read' ke server jika ada endpointnya
      }
    }
  }, [selectedId, user]);

  // --- 4. ACTION HANDLERS ---

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedId || !user) return;

    // A. Kirim ke Server via Socket
    const payload = {
      sender_id: user.id,
      recipient_id: selectedId, // Kirim ke ID User lawan bicara
      message: newMessage,
      sender_role: "helpdesk",
    };

    socket.emit("send_message", payload);

    // B. Optimistic UI Update (Langsung muncul tanpa nunggu server)
    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender: "helpdesk",
      text: newMessage,
      time: "Sending...",
      isTemp: true, // Flag untuk styling (misal agak transparan)
    };

    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), tempMsg],
    }));

    setNewMessage("");
  };

  const handleCreateTicketClick = () => {
    navigate("/dashboard/new-ticket", {
      state: { prefillUser: activeUser }, // Bawa data user ke form tiket
    });
  };

  // --- 5. RENDER UTAMA ---

  return (
    <>
      <div className="flex flex-col md:flex-row h-full gap-4 md:gap-6">
        {/* === SIDEBAR: DAFTAR CHAT === */}
        <div className="flex flex-col h-1/3 md:h-full w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-white dark:bg-slate-800 flex-shrink-0">
          {/* Header Sidebar */}
          <div className="border-b p-4 border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white">
              Inbox
            </h2>
            {/* Indikator Status Koneksi */}
            <div
              className={`w-3 h-3 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              title={`Status: ${connectionStatus}`}
            ></div>
          </div>

          {/* Search Box */}
          <div className="p-4 pt-2 border-b border-slate-100 dark:border-slate-700">
            <Input
              id="search-chat"
              placeholder="Cari user..."
              rightIcon={<FiSearch />}
            />
          </div>

          {/* List Percakapan */}
          <div className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                <FiMessageCircle
                  size={32}
                  className="mx-auto mb-2 opacity-20"
                />
                <p>Belum ada percakapan aktif.</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <InboxItem
                  key={convo.id}
                  convo={convo}
                  isActive={convo.id === selectedId}
                  onClick={() => setSelectedId(convo.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* === MAIN: CHAT WINDOW === */}
        <div className="flex flex-1 flex-col h-full w-full rounded-lg shadow-lg bg-white dark:bg-slate-800 overflow-hidden relative">
          {!activeUser ? (
            // State: Belum pilih chat
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <FiUser size={40} className="opacity-50" />
              </div>
              <p className="text-lg font-medium">
                Pilih percakapan untuk mulai membalas
              </p>
              <p className="text-sm opacity-70">
                Anda terhubung sebagai Helpdesk
              </p>
            </div>
          ) : (
            <>
              {/* Header Chat Active */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-10 shadow-sm">
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-base">
                      {activeUser.name}
                    </h3>
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
                      Online
                    </p>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Detail User"
                  >
                    <FiInfo size={20} />
                  </button>
                  <button
                    onClick={handleCreateTicketClick}
                    className="flex items-center gap-2 bg-[#F7AD19] text-[#053F5C] px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-sm"
                  >
                    <FiFilePlus size={18} />
                    <span>Buat Tiket</span>
                  </button>
                </div>
              </div>

              {/* Chat Area (Messages) */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin bg-slate-50 dark:bg-slate-900/50">
                {activeConversation.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <p className="text-sm">
                      Belum ada riwayat pesan dengan user ini.
                    </p>
                  </div>
                ) : (
                  activeConversation.map((msg, index) => (
                    <ChatMessage key={msg.id || index} message={msg} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-3 items-end"
              >
                <div className="flex-1 relative">
                  <Input
                    id="message-input"
                    className="w-full pr-10" // Padding right buat icon kalau mau
                    placeholder="Ketik balasan Anda..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    !newMessage.trim() || connectionStatus !== "connected"
                  }
                  className={`flex h-11 w-11 items-center justify-center rounded-lg text-white transition-all shadow-md ${
                    !newMessage.trim() || connectionStatus !== "connected"
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-[#429EBD] hover:bg-[#053F5C]"
                  }`}
                >
                  <FiSend size={20} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Modal Info User */}
      {isInfoModalOpen && activeUser && (
        <UserInfoModal
          user={activeUser}
          onClose={() => setIsInfoModalOpen(false)}
        />
      )}
    </>
  );
};

// --- SUB COMPONENTS ---

const UserInfoModal = ({ user, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full mb-3 shadow-md"
          />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {user.name}
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
            User
          </span>
        </div>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
          <InfoRow label="ID User" value={user.id} />
          <InfoRow label="Email" value={user.email || "-"} />
          <InfoRow label="Role" value={user.role || "User Umum"} />
          <InfoRow label="OPD" value={user.opd || "-"} />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const InboxItem = ({ convo, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 border ${
      isActive
        ? "bg-blue-50 dark:bg-slate-700 border-blue-200 dark:border-blue-500 shadow-sm"
        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50"
    }`}
  >
    <div className="relative">
      <img
        src={convo.avatar}
        alt={convo.name}
        className="h-12 w-12 flex-shrink-0 rounded-full object-cover bg-gray-200"
      />
      {convo.unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
          {convo.unread}
        </span>
      )}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex justify-between items-start mb-1">
        <p
          className={`truncate text-sm ${
            isActive
              ? "font-bold text-slate-900 dark:text-white"
              : "font-semibold text-slate-700 dark:text-slate-200"
          }`}
        >
          {convo.name}
        </p>
        {/* Timestamp bisa ditambah disini jika ada di data */}
      </div>
      <p
        className={`truncate text-xs ${
          isActive
            ? "text-slate-600 dark:text-slate-300"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {convo.lastMessage || "Belum ada pesan"}
      </p>
    </div>
  </button>
);

const ChatMessage = ({ message }) => {
  // "sender: helpdesk" berarti pesan dari SAYA (Pegawai)
  const isMe = message.sender === "helpdesk";

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col max-w-[80%] md:max-w-[70%] ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm shadow-sm relative ${
            isMe
              ? "bg-[#429EBD] text-white rounded-tr-none"
              : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-tl-none"
          } ${message.isTemp ? "opacity-70" : "opacity-100"}`}
        >
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.text}
          </div>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 px-1">
          {message.time}
        </span>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-100 dark:border-slate-600/50 last:border-0">
    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 sm:mb-0">
      {label}
    </dt>
    <dd className="text-sm font-medium text-slate-900 dark:text-white text-right break-all sm:pl-4">
      {value || "-"}
    </dd>
  </div>
);

// Helper Icon Component (Optional jika belum diimport)
const FiMessageCircle = ({ size, className }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default ChatPage;
