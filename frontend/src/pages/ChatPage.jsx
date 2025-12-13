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
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import io from "socket.io-client";

// Setup Socket (Ganti URL jika sudah deploy)
const socket = io.connect("http://localhost:3001", { autoConnect: false });

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Ambil data pegawai yang login

  // --- STATE MANAGEMENT ---
  const [conversations, setConversations] = useState([]); // List User di Kiri
  const [messages, setMessages] = useState({}); // Mapping pesan per User ID
  const [selectedId, setSelectedId] = useState(null); // ID User yang sedang dibuka chatnya
  const [newMessage, setNewMessage] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // --- 1. SETUP KONEKSI SOCKET ---
  useEffect(() => {
    if (user) {
      console.log("Helpdesk Staff Connecting...");

      // PENTING: Force role menjadi 'helpdesk' agar masuk ke staff_room
      socket.io.opts.query = {
        userId: user.id,
        role: "helpdesk", // <--- GANTI INI (Sebelumnya 'pegawai')
      };

      socket.connect();

      // Debugging: Pastikan connect
      socket.on("connect", () => {
        console.log("Helpdesk Connected ID:", socket.id);
      });

      socket.on("pesan_masuk_staff", (data) => {
        console.log("Pesan diterima Helpdesk:", data); // Cek log ini nanti
        handleIncomingMessage(data);
      });
    }

    return () => {
      socket.off("pesan_masuk_staff");
      socket.off("connect");
      socket.disconnect();
    };
  }, [user]);

  // --- 2. LOGIC MENERIMA PESAN (INBOX & CHAT) ---
  const handleIncomingMessage = (data) => {
    // 1. Pastikan userId selalu STRING agar konsisten sebagai key object
    const { userId, text, role, avatar } = data;
    const userIdString = String(userId);

    // A. Update History Pesan
    setMessages((prev) => {
      const userMessages = prev[userIdString] || [];
      return {
        ...prev,
        [userIdString]: [
          // Gunakan userIdString sebagai key
          ...userMessages,
          {
            id: Date.now(),
            sender: "user",
            text: text,
            time: data.time || new Date().toLocaleTimeString(),
          },
        ],
      };
    });

    // B. Update/Buat List Percakapan di Sidebar (Inbox)
    setConversations((prev) => {
      // Bandingkan dengan String(c.id)
      const existingConvoIndex = prev.findIndex(
        (c) => String(c.id) === userIdString
      );

      let updatedConversations = [...prev];

      if (existingConvoIndex > -1) {
        const existing = updatedConversations[existingConvoIndex];
        updatedConversations[existingConvoIndex] = {
          ...existing,
          lastMessage: text,
          // Cek selectedId juga sebagai string
          unread: String(selectedId) !== userIdString ? existing.unread + 1 : 0,
        };
      } else {
        updatedConversations.push({
          id: userIdString, // Simpan sebagai string
          name:
            role === "pegawai"
              ? `Pegawai (${userIdString})`
              : `Masyarakat (${userIdString.slice(0, 4)})`,
          avatar:
            avatar ||
            `https://ui-avatars.com/api/?name=${userIdString}&background=random`,
          lastMessage: text,
          unread: 1,
          role: role,
        });
      }
      return updatedConversations;
    });
  };

  // --- 3. HELPERS ---
  const activeConversation = useMemo(
    // Akses messages dengan string key
    () => (selectedId ? messages[String(selectedId)] || [] : []),
    [selectedId, messages]
  );

  const activeUser = useMemo(
    () => conversations.find((c) => c.id === selectedId),
    [selectedId, conversations]
  );

  // Auto-scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Reset unread saat membuka chat
    if (selectedId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, unread: 0 } : c))
      );
    }
  }, [activeConversation, selectedId]);

  // --- 4. LOGIC MENGIRIM PESAN ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedId) return;

    const msgData = {
      text: newMessage,
      sender: "helpdesk", // Tanda ini pesan dari kita
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // 1. Update UI Sendiri (Optimistic)
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), msgData],
    }));

    // 2. Kirim ke Socket Server
    socket.emit("kirim_pesan", {
      text: newMessage,
      senderId: user?.id,
      role: "pegawai",
      recipientId: selectedId, // ID Tujuan (Masyarakat)
    });

    // 3. TODO: Panggil API Backend Teman untuk simpan ke Database (Backup)
    // await api.post('/chat/send', { ... });

    setNewMessage("");
  };

  const handleCreateTicketClick = () => {
    navigate("/dashboard/new-ticket", {
      state: { prefillUser: activeUser },
    });
  };

  // --- RENDER UI ---

  return (
    <>
      <div className="flex flex-col md:flex-row h-full gap-4 md:gap-6">
        {/* --- COLUMN 1: INBOX CHAT --- */}
        <div className="flex flex-col h-1/3 md:h-full w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-white dark:bg-slate-800">
          <div className="border-b p-4 border-slate-200 dark:border-slate-700">
            <Input
              id="search-chat"
              placeholder="Cari percakapan..."
              rightIcon={<FiSearch />}
            />
          </div>
          <div className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">
                Belum ada pesan masuk.
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

        {/* --- COLUMN 2: CHAT WINDOW --- */}
        <div className="flex flex-1 flex-col md:h-full w-full md:w-2/4 lg:w-3/4 rounded-lg shadow-lg bg-white dark:bg-slate-800 overflow-hidden">
          {!activeUser ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <FiUser size={48} className="mb-2 opacity-50" />
              <p>Pilih percakapan untuk mulai membalas</p>
            </div>
          ) : (
            <>
              {/* Header Chat Active */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {activeUser.name}
                    </h3>
                    <p className="text-xs text-green-500">Online via Web</p>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    title="Info User"
                  >
                    <FiInfo size={20} />
                  </button>
                  <button
                    onClick={handleCreateTicketClick}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg bg-[#F7AD19] px-3 py-2 text-base font-semibold text-[#053F5C] hover:bg-yellow-400 cursor-pointer"
                  >
                    <FiFilePlus size={20} />
                    <span className="hidden sm:inline">Buat Tiket</span>
                  </button>
                </div>
              </div>

              {/* Content Chat */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin bg-slate-50 dark:bg-slate-900/50">
                {activeConversation.length === 0 && (
                  <p className="text-center text-xs text-slate-400 mt-4">
                    Mulai percakapan baru
                  </p>
                )}
                {activeConversation.map((msg, index) => (
                  <ChatMessage key={msg.id || index} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Send Message */}
              <form
                onSubmit={handleSendMessage}
                className="flex items-end gap-2 border-t p-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <Input
                  id="message-input"
                  className="flex-1"
                  placeholder="Ketik balasan Anda..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#429EBD] text-white hover:bg-[#053F5C] transition-colors"
                >
                  <FiSend />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {isInfoModalOpen && activeUser && (
        <UserInfoModal
          user={activeUser}
          onClose={() => setIsInfoModalOpen(false)}
        />
      )}
    </>
  );
};

// --- SUB COMPONENTS (TIDAK BERUBAH BANYAK) ---

const UserInfoModal = ({ user, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Informasi Pengguna
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <InfoRow label="Nama" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Peran" value={user.role} />
          {user.opd && <InfoRow label="OPD" value={user.opd} />}
          <InfoRow label="ID Chat" value={user.id} />
        </div>
      </div>
    </div>
  );
};

const InboxItem = ({ convo, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors ${
      isActive
        ? "bg-slate-100 dark:bg-slate-700 border-l-4 border-[#429EBD]"
        : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
    }`}
  >
    <img
      src={convo.avatar}
      alt={convo.name}
      className="h-10 w-10 flex-shrink-0 rounded-full object-cover bg-gray-200"
    />
    <div className="min-w-0 flex-1">
      <div className="flex justify-between items-center">
        <p className="truncate font-semibold text-slate-800 dark:text-slate-200 text-sm">
          {convo.name}
        </p>
        {convo.unread > 0 && (
          <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white min-w-[20px] text-center">
            {convo.unread}
          </span>
        )}
      </div>
      <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-1">
        {convo.lastMessage || "Belum ada pesan"}
      </p>
    </div>
  </button>
);

const ChatMessage = ({ message }) => {
  // "sender: helpdesk" berarti pesan dari SAYA (Pegawai)
  const isMe = message.sender === "helpdesk";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-md rounded-xl px-4 py-2 text-sm shadow-sm ${
          isMe
            ? "bg-[#429EBD] text-white rounded-br-none"
            : "bg-white text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-600"
        }`}
      >
        <div className="break-words">{message.text}</div>
        <div
          className={`text-[10px] mt-1 text-right ${
            isMe ? "text-blue-100" : "text-slate-400"
          }`}
        >
          {message.time}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="break-words">
    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
      {label}
    </dt>
    <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white">
      {value || "-"}
    </dd>
  </div>
);

export default ChatPage;
