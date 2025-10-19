import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";

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
  // eslint-disable-next-line no-unused-vars
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef(null);

  // Hook for close dropdown if clicked outside component
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
      {/* Bell Icon */}
      <button
        aria-label="Toggle notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full transition-colors duration-300 bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
      >
        <FiBell size={20} />
        {/* badge hasn't read*/}
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#053F5C]" />
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 md:w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold     text-slate-800 dark:text-white">
              Notifikasi
            </h3>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {notif.time}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-2 text-center">
                <p className="text-sm text-slate-500">
                  Tidak ada notifikasi terbaru.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/50">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center font-medium text-[#429EBD] hover:text-[#053F5C] dark:text-[#9FE7F5] dark:hover:text-white"
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
