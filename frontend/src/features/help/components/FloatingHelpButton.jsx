import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FiMessageCircle,
  FiHeadphones,
  FiX,
  FiSend,
  FiMinimize2,
  FiUser,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:3001", {
  autoConnect: false,
  transports: ["websocket"],
});

/* INTERNAL COMPONENT: CHAT WIDGET */
const ChatWidget = ({ onClose }) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const getGuestId = () => {
    let id = localStorage.getItem("guest_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("guest_id", id);
    }
    return id;
  };

  const activeIdentity = useMemo(() => {
    if (user) {
      // Jika Login
      return {
        id: user.id, // Gunakan ID asli dari database/login
        name: user.username,
        role: "pegawai", // Beritahu backend ini pegawai
        isGuest: false,
      };
    } else {
      // Jika Tidak Login (Tamu)
      return {
        id: getGuestId(),
        name: "Masyarakat",
        role: "masyarakat",
        isGuest: true,
      };
    }
  }, [user]);

  // // Auto-scroll to last message
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // useEffect(() => {
  //   // 1. Connect ke Socket
  //   socket.io.opts.query = { role: "masyarakat", userId: guestId };
  //   socket.connect();

  //   // 2. Dengarkan balasan dari Staff
  //   socket.on("pesan_masuk_user", (data) => {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now(),
  //         text: data.text,
  //         sender: "admin", // Dianggap admin oleh UI ini
  //         time: new Date().toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         }),
  //       },
  //     ]);
  //   });

  //   return () => {
  //     socket.off("pesan_masuk_user");
  //     socket.disconnect();
  //   };
  // }, [guestId]);
  useEffect(() => {
    console.log("Menghubungkan socket sebagai:", activeIdentity.name);

    // Putus koneksi lama jika identitas berubah (misal habis login)
    if (socket.connected) {
      socket.disconnect();
    }

    // 3. Set Query dengan Identitas yang BENAR
    socket.io.opts.query = {
      role: activeIdentity.role,
      userId: activeIdentity.id,
    };

    socket.connect();

    socket.on("pesan_masuk_user", (data) => {
      console.log("DAPAT BALASAN DARI HELPDESK:", data);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data.text,
          sender: "admin",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      socket.off("pesan_masuk_user");
      // Jangan disconnect total disini agar tidak putus nyambung saat minimize widget
      // socket.disconnect();
    };
  }, [activeIdentity]); // Re-run jika user login/logout

  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //   if (!inputText.trim()) return;

  //   const newUserMsg = {
  //     id: Date.now(),
  //     text: inputText,
  //     sender: "user",
  //     time: new Date().toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //   };

  //   setMessages((prev) => [...prev, newUserMsg]);
  //   setInputText("");

  //   // Simulation Auto-reply
  //   setTimeout(() => {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now() + 1,
  //         text: "Terima kasih. Petugas kami akan segera terhubung dengan Anda.",
  //         sender: "admin",
  //         time: new Date().toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         }),
  //       },
  //     ]);
  //   }, 1500);
  // };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageData = {
      text: inputText,
      sender: "user",
      role: activeIdentity.role, // Ini akan mengirim "pegawai" (BENAR)
      userId: activeIdentity.id, // ID Pegawai OPD (BENAR)

      // PENTING: recipientId harus 'staff_room' agar backend memasukannya ke inbox helpdesk
      recipientId: "staff_room",

      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      // Tambahkan avatar agar di ChatPage fotonya muncul
      avatar:
        user?.avatar ||
        `https://ui-avatars.com/api/?name=${activeIdentity.name}&background=random`,
    };

    // Update UI Sendiri
    setMessages((prev) => [...prev, { ...messageData, id: Date.now() }]);
    setInputText("");

    // Kirim ke Socket
    socket.emit("kirim_pesan", messageData);
  };

  return (
    <div className="fixed bottom-5 right-6 w-[90vw] max-w-[350px] h-[450px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden scrollbar-thin z-50">
      {/* Header */}
      <div className="bg-[#053F5C] p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <FiHeadphones size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#053F5C] rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm">Helpdesk SILADAN</h3>
            <p className="text-xs text-blue-200">
              {user ? `Halo, ${user?.username}` : "Online • Siap membantu"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 flex min-h-11 min-w-11 items-center justify-center hover:bg-white/10 rounded-full transition-colors"
        >
          <FiMinimize2 size={20} />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl text-sm ${
                msg.sender === "user"
                  ? "bg-[#053F5C] text-white rounded-br-none"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 mx-1">
              {msg.sender === "admin" ? "Helpdesk" : "Anda"} • {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ketik pesan..."
          className="flex-1 min-h-11 min-w-11 bg-slate-200 dark:bg-slate-900 px-4 py-2.5 rounded-full text-sm focus:ring-2 focus:ring-[#053F5C] outline-none dark:text-white"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          type="submit"
          className="p-2.5 min-h-11 min-w-11 flex justify-center items-center bg-[#053F5C] text-white rounded-full hover:bg-[#075075] transition-transform active:scale-95 shadow-md"
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
};

/* MAIN COMPONENT */
const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open("https://wa.me/6281357571468", "_blank");
  };

  const handleLiveChat = () => {
    setIsOpen(false);
    setIsChatOpen(true);
  };

  return (
    <>
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Menu Options */}
        {isOpen && !isChatOpen && (
          <div className="flex flex-col gap-3 animate-fade-in-up">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex min-h-11 min-w-11 items-center justify-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:brightness-110 transition-all origin-right cursor-pointer"
            >
              <span className="text-sm md:text-base font-bold whitespace-nowrap">
                Chat via WhatsApp
              </span>
              <FaWhatsapp size={24} />
            </button>

            {/* Live Chat Trigger */}
            <button
              onClick={handleLiveChat}
              className="flex items-center justify-center gap-3 bg-[#053F5C] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#075075] transition-all origin-right cursor-pointer"
            >
              <span className="text-sm md:text-base font-bold whitespace-nowrap">
                Chat dengan Helpdesk
              </span>
              <FiHeadphones size={22} />
            </button>
          </div>
        )}

        {/* Main Trigger Button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex min-h-11 min-w-11 items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform duration-300 cursor-pointer ${
              isOpen ? "bg-red-500 rotate-90" : "bg-[#F7AD19] hover:scale-110"
            }`}
            aria-label="Bantuan"
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
