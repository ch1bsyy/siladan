// src/pages/ChatPage.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiSend, FiFilePlus, FiInfo, FiX } from "react-icons/fi";
import Input from "../components/Input";

// --- Mock Data (Ganti dengan API call) ---
const mockConversations = [
  {
    id: 1,
    name: "Bisma Pargoy",
    avatar: "https://i.pravatar.cc/150?u=pegawai@opd.go.id",
    lastMessage: "Yang di ruang arsip, printer laserjet",
    unread: 2,
    role: "pegawai_opd",
    opd: "Sekretariat DPRD",
    email: "pegawai@opd.go.id",
  },
  {
    id: 2,
    name: "Warga A",
    avatar: "https://i.pravatar.cc/150?u=warga@mail.com",
    lastMessage: "Bagaimana cara lapor kerusakan?",
    unread: 0,
    role: "masyarakat",
    email: "warga@mail.com",
  },
  {
    id: 3,
    name: "Andi",
    avatar: "https://i.pravatar.cc/150?u=teknisi@siladan.go.id",
    lastMessage: "Siap, laksanakan",
    unread: 0,
    role: "teknisi",
    opd: "Internal",
  },
  {
    id: 4,
    name: "Warga B",
    avatar: "https://i.pravatar.cc/150?u=admin@kota.go.id",
    lastMessage: "Mau minta tolong dong",
    unread: 1,
    role: "admin_kota",
    opd: "Internal",
  },
];

const mockMessages = {
  1: [
    {
      id: "m1",
      sender: "user",
      text: "Halo, ini Bisma. Printer saya rusak lagi.",
    },
    {
      id: "m2",
      sender: "helpdesk",
      text: "Halo Pak Bisma. Printer yang mana ya?",
    },
    {
      id: "m3",
      sender: "user",
      text: "Yang di ruang arsip, printer laserjet.",
    },
  ],
  2: [
    { id: "m4", sender: "user", text: "Permisi, mau tanya." },
    { id: "m5", sender: "user", text: "Bagaimana cara lapor kerusakan?" },
  ],
  3: [{ id: "m6", sender: "user", text: "Siap, laksanakan." }],
  4: [{ id: "m7", sender: "user", text: "Mau minta tolong dong" }],
};
// ------------------------------------

const ChatPage = () => {
  const [selectedId, setSelectedId] = useState(mockConversations[0].id);
  const [newMessage, setNewMessage] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const navigate = useNavigate();

  // Ref to auto-scroll to the last message
  const messagesEndRef = useRef(null);

  // Find User data and active chat
  const activeConversation = useMemo(
    () => mockMessages[selectedId] || [],
    [selectedId]
  );

  const activeUser = useMemo(
    () => mockConversations.find((c) => c.id === selectedId),
    [selectedId]
  );

  // Auto-scroll down when a new message arrives or the chat is changed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return null;
    console.log("Mengirim pesan:", newMessage);
    // API Logic
    setNewMessage("");
  };

  const handleCreateTicketClick = () => {
    navigate("/dashboard/new-ticket", {
      state: { prefillUser: activeUser },
    });
  };

  if (!activeUser) {
    return <div className="dark:text-white">Memuat percakapan...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-full gap-4 md:gap-6">
        {/* --- COLUMN 1: INBOX CHAT --- */}
        <div className="flex flex-col h-1/3 md:h-full w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-white dark:bg-slate-800">
          {/* Header Inbox */}
          <div className="border-b p-4 border-slate-200 dark:border-slate-700">
            <Input
              id="search-chat"
              placeholder="Cari percakapan..."
              rightIcon={<FiSearch />}
            />
          </div>
          {/* List Chat */}
          <div className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
            {mockConversations.map((convo) => (
              <InboxItem
                key={convo.id}
                convo={convo}
                isActive={convo.id === selectedId}
                onClick={() => setSelectedId(convo.id)}
              />
            ))}
          </div>
        </div>

        {/* --- COLUMN 2: CHAT WINDOW --- */}
        <div className="flex flex-1 flex-col md:h-full w-full md:w-2/4 lg:w-3/4 rounded-lg shadow-lg bg-white dark:bg-slate-800">
          {/* Header Chat Active */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
            {/* Info User */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                  {activeUser.name}
                </h3>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                aria-label="Lihat Info"
              >
                <FiInfo size={20} />
              </button>
              <button
                onClick={handleCreateTicketClick}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg bg-[#F7AD19] px-3 py-2 text-base font-semibold text-[#053F5C] hover:bg-yellow-400 cursor-pointer"
                aria-label="Lihat Info"
              >
                <FiFilePlus size={20} />
                <span className="hidden sm:inline">Buat Tiket</span>
              </button>
            </div>
          </div>

          {/* Content Chat */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
            {activeConversation.map((msg, index) => (
              <ChatMessage key={msg.id || index} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Send Message */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-end gap-2 border-t p-4 border-slate-200 dark:border-slate-700"
          >
            <Input
              id="message-input"
              className="flex-1"
              placeholder="Ketik balasan Anda..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#429EBD] text-white hover:bg-[#053F5C]"
            >
              <FiSend />
            </button>
          </form>
        </div>
      </div>

      {isInfoModalOpen && (
        <UserInfoModal
          user={activeUser}
          onClose={() => setIsInfoModalOpen(false)}
        />
      )}
    </>
  );
};

// --- MODAL FOR USER INFO ---
const UserInfoModal = ({ user, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
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
        ? "bg-slate-100 dark:bg-slate-700"
        : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
    }`}
  >
    <img
      src={convo.avatar}
      alt={convo.name}
      className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
    />
    <div className="min-w-0 flex-1">
      <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
        {convo.name}
      </p>
      <p className="truncate text-sm text-slate-500 dark:text-slate-400">
        {convo.lastMessage}
      </p>
    </div>
    {convo.unread > 0 && (
      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
        {convo.unread}
      </span>
    )}
  </button>
);

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
          isUser
            ? "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
            : "bg-[#429EBD] text-white"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="break-words">
    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {label}
    </dt>
    <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white">
      {value}
    </dd>
  </div>
);

export default ChatPage;
