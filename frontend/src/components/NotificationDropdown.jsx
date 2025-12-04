import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const mockNotifications = [
  {
    id: 1,
    message: "Tiket #1234 telah diperbarui oleh Teknisi.",
    time: "5 menit yang lalu",
  },
  {
    id: 2,
    message: "Permintaan layanan Anda telah disetujui.",
    time: "1 jam yang lalu",
  },
  {
    id: 3,
    message: "Pengaduan aset 'Printer Rusak' sedang diproses.",
    time: "3 jam yang lalu",
  },
];

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);

  // --- LOGIC LINK DINAMIS ---
  const { user } = useAuth();
  const isPublicUser = user?.role?.name === "pegawai_opd";
  const viewAllLink = isPublicUser
    ? "/notifications"
    : "/dashboard/notifications";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Toggle notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full transition-colors duration-300 bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer hover:bg-slate-300"
      >
        <FiBell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#053F5C]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in-down">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">
              Notifikasi
            </h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              3 Baru
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors group"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#053F5C] dark:group-hover:text-white transition-colors">
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {notif.time}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">
                  Tidak ada notifikasi terbaru.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            <Link
              to={viewAllLink}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-sm font-bold text-[#053F5C] hover:text-[#429EBD] dark:text-[#9FE7F5] dark:hover:text-white transition-colors"
            >
              Lihat Semua Notifikasi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
