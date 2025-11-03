import React from "react";
import { useAuth } from "../context/AuthContext";
import HelpdeskDashboard from "../features/dashboard/components/HelpdeskDashboard";

const DashboardPage = () => {
  const { user, hasPermission } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
        Selamat Datang, {user?.name}!
      </h1>

      {hasPermission(["assign", "ticket"]) && <HelpdeskDashboard />}
    </div>
  );
};

export default DashboardPage;
