import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FiMessageCircle,
  FiHeadphones,
  FiX,
  FiSend,
  FiMinimize2,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

// --- SOCKET URL (ROOT SERVER, BUKAN PATH API) ---
// Socket.io server listen di root URL
const SOCKET_URL =
  "https://siladan-rest-api-711057748791.asia-southeast2.run.app";

// Kita inisialisasi di luar agar tidak re-render, TAPI kita set autoConnect false
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["polling", "websocket"], // Biarkan diawali polling dulu agar aman
  withCredentials: true, // Tambahkan polling untuk fallback
  reconnection: true,
  reconnectionAttempts: 5,
});

/* INTERNAL COMPONENT: CHAT WIDGET */
const ChatWidget = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // --- 1. LOGIC IDENTITAS ---
  const activeIdentity = useMemo(() => {
    try {
      if (user && user.id) {
        return {
          id: String(user.id),
          name: user.username || user.name || "User",
          role: "pegawai", // User login dianggap pegawai/internal user
          avatar: user.avatar,
        };
      } else {
        let guestId = localStorage.getItem("guest_id");
        if (!guestId) {
          guestId = uuidv4();
          localStorage.setItem("guest_id", guestId);
        }
        return {
          id: guestId,
          name: "Masyarakat",
          role: "masyarakat",
          avatar: null,
        };
      }
    } catch (e) {
      console.error("Identity Error", e);
      return { id: "unknown", name: "Guest", role: "masyarakat" };
    }
  }, [user]);

  // --- 2. KONEKSI SOCKET & LOAD DATA ---
  useEffect(() => {
    if (!activeIdentity.id) return;

    console.log("🔌 Menghubungkan socket sebagai:", activeIdentity.name);

    // Putus koneksi lama jika ada (agar query params terupdate)
    if (socket.connected) {
      socket.disconnect();
    }

    // Update Auth Data di Socket
    socket.io.opts.query = {
      role: activeIdentity.role,
      userId: activeIdentity.id,
    };

    // Sambungkan
    socket.connect();

    // Minta History Chat setelah connect
    socket.on("connect", () => {
      console.log("✅ Socket Connected!");
      // Minta history chat spesifik untuk user ini
      socket.emit("get_messages", {
        conversationId: "staff_room", // Ini jika user chat ke admin (staff_room)
        userId: activeIdentity.id,
      });
    });

    // Listener: Load History
    const handleHistory = ({ messages: history }) => {
      if (!Array.isArray(history)) return;

      const formatted = history.map((msg) => ({
        id: msg.id,
        text: msg.message || "",
        // Logic sender: Jika ID pengirim == ID saya, berarti "me"
        sender:
          String(msg.sender_id) === String(activeIdentity.id) ? "me" : "admin",
        time: msg.created_at
          ? new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Now",
      }));
      setMessages(formatted);
    };

    // Listener: Pesan Baru Masuk
    const handleReceiveMessage = (data) => {
      console.log("📩 Pesan masuk:", data);

      // Cek apakah pesan ini relevan untuk saya
      // 1. Saya yang kirim (untuk konfirmasi UI di tab lain)
      // 2. Pesan ditujukan ke saya (recipient_id == my_id)
      const isMyMessage = String(data.sender_id) === String(activeIdentity.id);
      const isForMe = String(data.recipient_id) === String(activeIdentity.id);

      if (isMyMessage || isForMe) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev; // Cegah duplikat
          return [
            ...prev,
            {
              id: data.id || Date.now(),
              text: data.message,
              sender: isMyMessage ? "me" : "admin",
              time: data.created_at
                ? new Date(data.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Now",
            },
          ];
        });
      }
    };

    socket.on("conversation_messages", handleHistory);
    socket.on("receive_message", handleReceiveMessage);

    // Cleanup saat unmount
    return () => {
      socket.off("connect");
      socket.off("conversation_messages", handleHistory);
      socket.off("receive_message", handleReceiveMessage);
      socket.disconnect(); // Putus koneksi agar tidak leak
    };
  }, [activeIdentity]); // Re-run jika identitas berubah (login/logout)

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 3. KIRIM PESAN ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Optimistic UI Update (Langsung tampilkan pesan sebelum server respon)
    const tempId = Date.now();
    // eslint-disable-next-line no-unused-vars
    const newMessageUI = {
      id: tempId,
      text: inputText,
      sender: "me",
      time: "Sending...",
    };

    // Jangan setMessages di sini jika server akan emit balik event 'receive_message' ke pengirim juga.
    // Tapi untuk UX cepat, bisa dipakai. Jika server emit balik, pastikan logika deduplikasi ID jalan.

    const messageData = {
      sender_id: activeIdentity.id,
      recipient_id: "staff_room", // User selalu kirim ke staff
      message: inputText,
      sender_role: activeIdentity.role,
    };

    socket.emit("send_message", messageData);
    setInputText("");
  };

  return (
    <div className="fixed bottom-5 right-6 w-[90vw] max-w-[350px] h-[450px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden scrollbar-thin z-50 animate-slide-up">
      {/* Header */}
      <div className="bg-[#053F5C] p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <FiHeadphones size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#053F5C] rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm">Helpdesk SILADAN</h3>
            <p className="text-xs text-blue-200">
              {user ? `Halo, ${user.username}` : "Online • Siap membantu"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full"
        >
          <FiMinimize2 size={20} />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 text-xs md:text-sm mt-10">
            Belum ada pesan. Mulai percakapan sekarang.
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex flex-col ${
              msg.sender === "me" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${
                msg.sender === "me"
                  ? "bg-[#053F5C] text-white rounded-br-none"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 mx-1">
              {msg.sender === "admin" ? "Helpdesk" : "Anda"} • {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ketik pesan..."
          className="flex-1 min-h-11 min-w-11 bg-slate-100 dark:bg-slate-900 px-4 py-2.5 rounded-full text-sm focus:ring-2 focus:ring-[#053F5C] outline-none dark:text-white"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          type="submit"
          className="p-2.5 min-h-11 min-w-11 flex justify-center items-center bg-[#053F5C] text-white rounded-full hover:bg-[#075075] shadow-md"
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
};

const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && !isChatOpen && (
          <div className="flex flex-col gap-3 animate-fade-in-up">
            <button
              onClick={() =>
                window.open("https://wa.me/6281357571468", "_blank")
              }
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:brightness-110 cursor-pointer"
            >
              <span className="text-sm md:text-base font-bold">
                Chat via WhatsApp
              </span>
              <FaWhatsapp size={24} />
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setIsChatOpen(true);
              }}
              className="flex items-center justify-center gap-3 bg-[#053F5C] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#075075] cursor-pointer"
            >
              <span className="text-sm md:text-base font-bold">
                Chat dengan Helpdesk
              </span>
              <FiHeadphones size={22} />
            </button>
          </div>
        )}
        {!isChatOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform duration-300 ${
              isOpen ? "bg-red-500 rotate-90" : "bg-[#F7AD19] hover:scale-110"
            }`}
          >
            {isOpen ? (
              <FiX size={24} className="text-white" />
            ) : (
              <FiMessageCircle size={28} className="text-[#053F5C]" />
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default FloatingHelpButton;
