import React from "react";
import { FiClock, FiMapPin } from "react-icons/fi";

const recentTickets = [
  {
    id: 1,
    opd: "Dispendukcapil",
    title: "Printer KTP Macet",
    time: "Baru Saja",
    status: "new",
  },
  {
    id: 2,
    opd: "Kecamatan Rungkut",
    title: "WiFi Publik Mati",
    time: "2 menit lalu",
    status: "new",
  },
  {
    id: 3,
    opd: "Dinas Kesehatan",
    title: "Aplikasi Puskesmas Error 500",
    time: "5 menit lalu",
    status: "critical",
  },
  {
    id: 4,
    opd: "Bappeda",
    title: "Permintaan Akun Zoom",
    time: "12 menit lalu",
    status: "normal",
  },
  {
    id: 5,
    opd: "Satpol PP",
    title: "Radio Komunikasi Gangguan",
    time: "15 menit lalu",
    status: "normal",
  },
];

const LiveTicketFeed = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-0 overflow-hidden h-full flex flex-col scrollbar-thin">
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-bold text-slate-800 dark:text-white text-base md:text-lg flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Live Traffic Tiket
        </h3>
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          Real-time
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        {recentTickets.map((ticket, idx) => (
          <div
            key={idx}
            className="p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold uppercase text-[#053F5C] dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded">
                {ticket.opd}
              </span>
              <span className="text-xs flex text-slate-500 dark:text-slate-400 items-center gap-1">
                <FiClock size={10} /> {ticket.time}
              </span>
            </div>
            <h4
              className={`text-sm font-semibold ${
                ticket.status === "critical"
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              {ticket.title}
            </h4>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-600 dark:text-slate-400 group-hover:text-[#053F5C] transition-colors">
              <FiMapPin size={10} /> <span>Surabaya</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-center border-t border-slate-100 dark:border-slate-700">
        <button className="text-xs md:text-sm font-bold text-[#053F5C] dark:text-[#9FE7F5] hover:underline cursor-pointer">
          Lihat Semua Aktivitas
        </button>
      </div>
    </div>
  );
};

export default LiveTicketFeed;
