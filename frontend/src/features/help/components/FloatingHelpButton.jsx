import React, { useState, useRef, useEffect } from "react";
import {
  FiMessageCircle,
  FiHeadphones,
  FiX,
  FiSend,
  FiMinimize2,
  FiUser,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

/* ==========================================
   INTERNAL COMPONENT: CHAT WIDGET
   ========================================== */
const ChatWidget = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Ada yang bisa kami bantu terkait layanan SILADAN?",
      sender: "admin",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terakhir
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");

    // Simulasi Auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Terima kasih. Petugas kami akan segera terhubung dengan Anda.",
          sender: "admin",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1500);
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
            <p className="text-xs text-blue-200">Online • Siap membantu</p>
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

/* ==========================================
   MAIN COMPONENT
   ========================================== */
const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open("https://wa.me/6281357571468", "_blank");
  };

  const handleLiveChat = () => {
    setIsOpen(false); // Tutup menu speed dial
    setIsChatOpen(true); // Buka widget chat
  };

  return (
    <>
      {/* Widget Chat (Muncul jika state isChatOpen true) */}
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Menu Options (Hanya muncul jika Chat Widget tertutup dan Menu terbuka) */}
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

        {/* Main Trigger Button (Disembunyikan jika chat terbuka agar tidak menumpuk) */}
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
