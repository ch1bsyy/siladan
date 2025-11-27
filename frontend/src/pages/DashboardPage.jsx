import React from "react";
import { useAuth } from "../context/AuthContext";
import HelpdeskDashboard from "../features/dashboard/components/HelpdeskDashboard";
import TeknisiDashboard from "../features/dashboard/components/TeknisiDashboard";

const AdminKotaDashboard = () => (
  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold dark:text-white">
      Dashboard Admin Kota
    </h2>
    <p className="dark:text-slate-300">
      Widget untuk admin kota akan muncul di sini.
    </p>
  </div>
);

const DashboardPage = () => {
  const { user, hasPermission } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
        Selamat Datang, {user?.name}!
      </h1>

      {hasPermission(["manage", "ticket"]) && <HelpdeskDashboard />}

      {hasPermission(["process", "ticket"]) && <TeknisiDashboard />}

      {hasPermission(["manage", "all"]) && <AdminKotaDashboard />}
    </div>
  );
};

export default DashboardPage;
