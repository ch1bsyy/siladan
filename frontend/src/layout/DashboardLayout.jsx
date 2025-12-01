import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import EmergencyBanner from "../features/warroom/components/EmergencyBanner";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden flex-col">
      <EmergencyBanner />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
