import React, { useState } from "react";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiClock,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

// MOCK DATA
const initialNotifications = [
  {
    id: 1,
    title: "Tiket #1234 Diperbarui",
    message:
      "Teknisi Budi telah menambahkan worklog baru pada tiket 'Printer Macet'.",
    type: "info", // info, success, warning, error
    isRead: false,
    time: "5 menit yang lalu",
  },
  {
    id: 2,
    title: "Permintaan Disetujui",
    message: "Permintaan laptop baru Anda telah disetujui oleh Kepala Dinas.",
    type: "success",
    isRead: false,
    time: "1 jam yang lalu",
  },
  {
    id: 3,
    title: "SLA Warning",
    message: "Tiket #TK-998 mendekati batas waktu SLA (kurang dari 2 jam).",
    type: "warning",
    isRead: true,
    time: "3 jam yang lalu",
  },
  {
    id: 4,
    title: "Sistem Maintenance",
    message: "Sistem akan mengalami downtime pada hari Sabtu pukul 22:00 WIB.",
    type: "error",
    isRead: true,
    time: "1 hari yang lalu",
  },
  {
    id: 5,
    title: "Tiket Selesai",
    message: "Tiket #TK-887 telah diselesaikan. Silakan beri rating.",
    type: "success",
    isRead: true,
    time: "2 hari yang lalu",
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  // Derived State
  const filteredNotifications = notifications.filter((n) =>
    filter === "all" ? true : !n.isRead
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handlers
  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Helper Icon
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "warning":
        return <FiAlertCircle className="text-orange-500" size={20} />;
      case "error":
        return <FiAlertCircle className="text-red-500" size={20} />;
      default:
        return <FiInfo className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-5 pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FiBell className="text-[#053F5C] dark:text-[#429EBD]" />
            Notifikasi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Anda memiliki{" "}
            <span className="font-bold text-[#053F5C] dark:text-white">
              {unreadCount}
            </span>{" "}
            notifikasi yang belum dibaca.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center justify-center min-h-11 min-w-11 gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-green-600 hover:text-white dark:hover:bg-green-700 transition-colors cursor-pointer"
          >
            <FiCheck size={18} /> Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 text-sm md:text-[15px] font-medium border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setFilter("all")}
          className={`pb-3 px-1 ${
            filter === "all"
              ? "text-[#053F5C] dark:text-[#429EBD] border-b-2 border-[#053F5C] dark:border-[#429EBD]"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-400"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`pb-3 px-1 ${
            filter === "unread"
              ? "text-[#053F5C] dark:text-[#429EBD] border-b-2 border-[#053F5C] dark:border-[#429EBD]"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-400"
          }`}
        >
          Belum Dibaca
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3 p-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleRead(notif.id)}
              className={`flex flex-col justify-center items-center sm:flex-row gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                notif.isRead
                  ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-80"
                  : "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 shadow-sm"
              }`}
            >
              {/* Icon */}
              <div
                className={`mt-1 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm`}
              >
                {getIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <h4
                    className={`text-base font-bold mb-1 sm:mb-0 ${
                      notif.isRead
                        ? "text-slate-700 dark:text-slate-300"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0 ml-2">
                    <FiClock size={12} /> {notif.time}
                  </span>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    notif.isRead
                      ? "text-slate-500"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {notif.message}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent trigger read onClick
                  handleDelete(notif.id);
                }}
                className="flex items-center justify-center min-h-11 min-w-11 text-slate-400 hover:text-red-500 transition-colors p-2 self-center"
                title="Hapus notifikasi"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <FiBell className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500">
              Tidak ada notifikasi untuk ditampilkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
