import React, { useState, useEffect } from "react";
import {
  FiInbox,
  FiAlertTriangle,
  FiCheckCircle,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";

import StatCard from "./StatCard";
// import TicketListWidget from "./TicketListWidget";
import TicketChartWidget from "./TicketChartWidget";
import QuickActionsWidgetOPD from "./QuickActionsWidgetOPD";
// import TechnicianStatusWidget from "./TechnicianStatusWidget";

import { useLoading } from "../../../context/LoadingContext";
import { getDashboardData } from "../services/dashboardService";
import toast from "react-hot-toast";

const AdminOPDDashboard = () => {
  const { showLoading, hideLoading } = useLoading();

  const [stats, setStats] = useState({
    totalTiket: 0,
    perluTindakan: 0,
    sedangProses: 0,
    selesai: 0,
  });

  const [chartData, setChartData] = useState([]);

  const priorityColors = ["#3B82F6", "#F59E0B", "#EF4444"];

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboard = async () => {
    try {
      showLoading("Memuat data dashboard...");
      const response = await getDashboardData();

      if (response.success && response.dashboard) {
        const d = response.dashboard;

        // 1. Mapping Statistik KPI
        // "Perlu Tindakan" biasanya tiket status OPEN yang harus di-assign
        const openTickets = d.by_status?.open || 0;

        // "Sedang Proses" = Assigned (Teknisi) + In Progress + Menunggu Approval
        const onProcess =
          (d.by_status?.assigned || 0) +
          (d.by_status?.in_progress || 0) +
          (d.by_status?.pending_approval || 0);

        // "Selesai"
        const finished =
          (d.by_status?.resolved || 0) + (d.by_status?.closed || 0);

        setStats({
          totalTiket: d.total_tickets || 0,
          perluTindakan: openTickets,
          sedangProses: onProcess,
          selesai: finished,
        });

        // 2. Mapping Chart Berdasarkan PRIORITAS
        // Data dari: "by_priority": { "low": 12, "medium": 38, "high": 17 }
        const prioData = [
          { name: "Low", value: d.by_priority?.low || 0 },
          { name: "Medium", value: d.by_priority?.medium || 0 },
          { name: "High", value: d.by_priority?.high || 0 },
        ].filter((item) => item.value > 0);

        setChartData(prioData);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="space-y-6 dark:text-white animate-fade-in pb-10">
      {/* SECTION 1: KPI CARDS */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-[#053F5C] dark:text-[#9FE7F5] mb-4">
          <FiBarChart2 size={24} /> <span>Operasional OPD</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tiket"
            value={stats.totalTiket}
            icon={FiInbox}
            colorClass="bg-blue-500"
          />
          <StatCard
            title="Perlu Tindakan (Open)"
            value={stats.perluTindakan}
            icon={FiAlertTriangle}
            colorClass="bg-red-600"
            desc="Tiket belum ditugaskan"
          />
          <StatCard
            title="Sedang Diproses"
            value={stats.sedangProses}
            icon={FiPieChart}
            colorClass="bg-orange-500"
            desc="Ditangani Teknisi / Approval"
          />
          <StatCard
            title="Selesai"
            value={stats.selesai}
            icon={FiCheckCircle}
            colorClass="bg-green-500"
          />
        </div>
      </div>

      {/* SECTION 2: CHART & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Chart (Lebar 2/3) */}
        <div className="lg:col-span-2">
          <TicketChartWidget
            title="Sebaran Tiket Berdasarkan Prioritas"
            height="300px"
            data={chartData}
            colors={priorityColors}
          />
        </div>

        {/* Kolom Kanan: Aksi Cepat (Lebar 1/3) */}
        <div className="lg:col-span-1">
          <QuickActionsWidgetOPD />
        </div>
      </div>
    </div>
  );
};

export default AdminOPDDashboard;
