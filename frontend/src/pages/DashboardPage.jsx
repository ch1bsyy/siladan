import React from "react";
import { useAuth } from "../context/AuthContext";
import HelpdeskDashboard from "../features/dashboard/components/HelpdeskDashboard";
import TeknisiDashboard from "../features/dashboard/components/TeknisiDashboard";
import AdminOPDDashboard from "../features/dashboard/components/AdminOPDDashboard";
import AdminKotaDashboard from "../features/dashboard/components/AdminKotaDashboard";

const DashboardPage = () => {
  const { user, hasPermission } = useAuth();

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Selamat Datang, {user?.name}!
        </h1>
      </div>

      {/* 2. Section Helpdesk (Triase & Manajemen) */}
      {hasPermission(["manage", "ticket"]) && (
        <section id="area-manajemen">
          <HelpdeskDashboard />
        </section>
      )}

      {/* 3. Section Teknisi (Eksekusi) */}
      {hasPermission(["process", "ticket"]) && (
        <section id="area-pengerjaan">
          <TeknisiDashboard />
        </section>
      )}

      {/* 4. Section OPD (Pengaturan OPD) */}
      {hasPermission(["manage", "settings"]) && (
        <section id="area-admin-opd">
          <AdminOPDDashboard />
        </section>
      )}

      {/* 5. Section Admin Kota */}
      {hasPermission(["manage", "all"]) && <AdminKotaDashboard />}
    </div>
  );
};

export default DashboardPage;
