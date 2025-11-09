import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

const ChatLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-auto md:overflow-hidden p-4 md:p-6">
          <div className="h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
