/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiPlus,
  FiTag,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiBarChart2,
  FiBookOpen,
  FiPieChart,
} from "react-icons/fi";
import { TfiTimer } from "react-icons/tfi";
import { SlCalender } from "react-icons/sl";
import { IoChatbubblesOutline } from "react-icons/io5";
import Logo from "../assets/images/logo-siladan.png";

const navigationLinks = [
  {
    name: "Dashboard",
    to: "/dashboard",
    icon: FiGrid,
    permission: ["read", "dashboard"],
  },
  {
    name: "Manajemen Tiket",
    to: "/dashboard/manage-tickets",
    icon: FiTag,
    permission: ["assign", "ticket"],
  },
  {
    name: "Buat Tiket",
    to: "/dashboard/new-ticket",
    icon: FiPlus,
    permission: ["create", "ticket"],
  },
  {
    name: "Percakapan",
    to: "/dashboard/chat",
    icon: IoChatbubblesOutline,
    permission: ["handle", "chat"],
  },
  {
    name: "Pengerjaan Tiket",
    to: "/dashboard/assigned-tickets",
    icon: FiActivity,
    permission: ["process", "ticket"],
  },
  {
    name: "Buat Artikel Solusi",
    to: "/dashboard/create-article",
    icon: FiBookOpen,
    permission: ["create", "article"],
  },
  {
    name: "Review Artikel",
    to: "/dashboard/review-articles",
    icon: FiFileText,
    permission: ["approve", "article"],
  },
  {
    name: "Laporan Kinerja",
    to: "/dashboard/reports",
    icon: FiBarChart2,
    permission: ["process", "ticket"],
  },
  {
    name: "Atur Operasional",
    to: "/dashboard/settings/operational",
    icon: SlCalender,
    permission: ["manage", "settings"],
  },
  {
    name: "Atur SLA",
    to: "/dashboard/settings/sla",
    icon: TfiTimer,
    permission: ["manage", "settings"],
  },
  {
    name: "Kelola Pengguna",
    to: "/dashboard/users",
    icon: FiUsers,
    permission: ["manage", "user"],
  },

  {
    name: "Laporan OPD",
    to: "/dashboard/opd-reports",
    icon: FiPieChart,
    permission: ["view", "report"],
  },
];

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Filter Navigation by Permission
  const accessibleLinks = navigationLinks.filter((link) =>
    hasPermission(link.permission)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`relative flex h-screen flex-col shadow-lg bg-white dark:bg-slate-800 p-4 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 flex h-9 w-9 items-center justify-center rounded-full border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 dark:border-slate-700 cursor-pointer"
      >
        {isCollapsed ? (
          <FiChevronRight size={22} />
        ) : (
          <FiChevronLeft size={22} />
        )}
      </button>
      <div className="flex items-center">
        <img
          src={Logo}
          alt="Logo"
          className="w-22 drop-shadow-2xl filter brightness-70 dark:filter-none flex-shrink-0"
        />
        {!isCollapsed && (
          <span className="text-xl font-bold text-[#053F5C] dark:text-white">
            SILADAN
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 py-4 overflow-y-auto scrollbar-thin">
        {accessibleLinks.map((link) => (
          <SidebarItem
            key={link.name}
            to={link.to}
            icon={link.icon}
            text={link.name}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-2 border-t pt-3 border-slate-200 dark:border-slate-700">
        <SidebarItem
          to="/dashboard/profile"
          icon={FiSettings}
          text="Pengaturan Profil"
          isCollapsed={isCollapsed}
        />

        {/* User Info & Logout */}
        <div
          className={`flex items-center overflow-hidden px-2 pb-2 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="min-w-0 flex-1 flex items-center gap-3">
              <img
                src={user.avatar}
                alt="Foto Profil"
                className="w-11 h-11 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 flex-shrink-0"
              />
              <div>
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.role?.label}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            aria-label="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

// Sub Komponen
const SidebarItem = ({ to, icon: Icon, text, isCollapsed }) => {
  const baseClasses =
    "flex items-center min-h-[44px] min-w-[44px] gap-3 rounded-md px-3 py-2 transition-colors";
  const activeClasses =
    "bg-[#053F5C]/10 font-semibold text-[#053F5C] dark:bg-[#9FE7F5]/10 dark:text-[#9FE7F5]";
  const inactiveClasses =
    "text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white";

  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${
          isCollapsed ? "justify-center" : ""
        }`
      }
    >
      <Icon size={20} className="flex-shrink-0" />
      {!isCollapsed && <span className="truncate">{text}</span>}
    </NavLink>
  );
};

export default DashboardSidebar;
