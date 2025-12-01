import React, { useState } from "react";
import { FiSend, FiInfo } from "react-icons/fi";

const mockMessages = [
  {
    id: 1,
    user: "System",
    text: "War Room Dibuka. Menunggu peserta...",
    type: "system",
    time: "10:00",
  },
  {
    id: 2,
    user: "Admin Kota",
    text: "Selamat pagi, mohon status terkini dari masing-masing OPD.",
    type: "admin",
    time: "10:05",
  },
  {
    id: 3,
    user: "Dinas Kesehatan",
    text: "Dinkes aman pak, koneksi lancar.",
    type: "user",
    time: "10:06",
  },
  {
    id: 4,
    user: "Dispendukcapil",
    text: "Kami down total pak! Antrean layanan berhenti.",
    type: "user",
    time: "10:08",
  },
];

const ChatPanel = ({ role }) => {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        user: role === "admin_kota" ? "Admin Kota" : "Anda",
        text: input,
        type: role === "admin_kota" ? "admin" : "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Live Koordinasi
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </h3>
        <span className="text-xs text-slate-500">24 User Online</span>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50 dark:bg-slate-900/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.type === "system"
                ? "items-center"
                : msg.user === "Anda" ||
                  (msg.type === "admin" && role === "admin_kota")
                ? "items-end"
                : "items-start"
            }`}
          >
            {msg.type === "system" ? (
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded-full my-2">
                {msg.text}
              </span>
            ) : (
              <div
                className={`max-w-[85%] ${
                  msg.type === "admin"
                    ? "bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-800"
                    : "bg-white dark:bg-slate-700"
                } p-3 rounded-lg shadow-sm`}
              >
                <div className="flex justify-between items-center gap-4 mb-1">
                  <span
                    className={`text-xs font-bold ${
                      msg.type === "admin"
                        ? "text-red-600 dark:text-red-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {msg.user}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  {msg.text}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2"
      >
        {role === "admin_kota" && (
          <button
            type="button"
            title="Broadcast Alert"
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <FiInfo size={20} />
          </button>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            role === "admin_kota" ? "Kirim instruksi..." : "Lapor kondisi..."
          }
          className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#053F5C] outline-none dark:text-white"
        />
        <button
          type="submit"
          className="p-2 bg-[#053F5C] text-white rounded-full hover:bg-[#075075] transition-transform active:scale-95"
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
