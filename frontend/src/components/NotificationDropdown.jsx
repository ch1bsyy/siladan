import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiBell } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserNotifications } from "../features/notifications/services/notificationService";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const { user } = useAuth();
  const isPublicUser = user?.role?.name === "pegawai_opd";
  const viewAllLink = isPublicUser
    ? "/notifications"
    : "/dashboard/notifications";

  const fetchNotifications = useCallback(() => {
    if (user?.id) {
      if (notifications.length === 0) setLoading(true);

      getUserNotifications(user.id)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            const sorted = res.data.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setNotifications(sorted.slice(0, 3));
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user, notifications.length]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener("notificationUpdated", handleUpdate);
    return () =>
      window.removeEventListener("notificationUpdated", handleUpdate);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: id,
      });
      // eslint-disable-next-line no-unused-vars
    } catch (_e) {
      return dateString;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Toggle notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full transition-colors duration-300 bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer hover:bg-slate-300"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#053F5C]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in-down">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white">
              Notifikasi
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-slate-500">
                Memuat...
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors group ${
                    !notif.is_read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <p className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-[#053F5C] dark:group-hover:text-white transition-colors font-medium">
                    {notif.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                    {/* Menggunakan format waktu real atau fallback jika library date-fns tidak diinstall */}
                    {notif.created_at
                      ? formatTime(notif.created_at)
                      : "Baru saja"}
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
