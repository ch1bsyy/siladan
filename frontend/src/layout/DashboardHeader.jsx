import React from "react";
import DarkModeToggler from "../components/DarkModeToggler";
import NotificationDropdown from "../components/NotificationDropdown";
// import { useWarRoom } from "../context/WarRoomContext";
// import { FiAlertTriangle } from "react-icons/fi";

const DashboardHeader = () => {
  // const warRoom = useWarRoom();
  // const triggerMajorIncident =
  //   warRoom?.triggerMajorIncident || (() => console.log("Trigger not ready"));

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-end gap-4 bg-white px-4 lg:px-6 shadow-2xs dark:bg-slate-800">
      <div className="flex items-center gap-3">
        {/* === TOMBOL PEMICU TESTING === */}
        {/* <button
          onClick={triggerMajorIncident}
          className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95 animate-pulse"
          title="Klik untuk simulasi Major Incident"
        >
          <FiAlertTriangle size={14} />
          <span className="hidden sm:inline">TEST WAR ROOM</span>
        </button> */}
        {/* ============================== */}
        <DarkModeToggler />
        <NotificationDropdown />
      </div>
    </header>
  );
};

export default DashboardHeader;
