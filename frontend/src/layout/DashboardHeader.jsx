import React from "react";
import DarkModeToggler from "../components/DarkModeToggler";
import NotificationDropdown from "../components/NotificationDropdown";

const DashboardHeader = () => {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-end gap-4 bg-white px-4 lg:px-6 shadow-2xs dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <DarkModeToggler />
        <NotificationDropdown />
      </div>
    </header>
  );
};

export default DashboardHeader;
