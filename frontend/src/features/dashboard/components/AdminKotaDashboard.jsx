import React, { useState, useEffect } from "react";
import {
  FiLayout,
  FiAlertOctagon,
  FiCheckCircle,
  FiPieChart,
  FiBarChart2,
  FiServer,
} from "react-icons/fi";

import StatCard from "./StatCard";
import TicketChartWidget from "./TicketChartWidget";
// import QuickActionsWidgetOPD from "./QuickActionsWidgetOPD";

// import WarRoomStatusWidget from "./WarRoomStatusWidget";
// import LiveTicketFeed from "./LiveTicketFeed";
// import TopOPDWidget from "./TopOPDWidget";

import { useLoading } from "../../../context/LoadingContext";
import { getDashboardData } from "../services/dashboardService";
import toast from "react-hot-toast";

const AdminKotaDashboard = () => {
  const { showLoading, hideLoading } = useLoading();

  const [stats, setStats] = useState({
    totalTiket: 0,
    openCritical: 0,
    selesai: 0,
    sedangProses: 0,
  });

  const [chartData, setChartData] = useState([]);

  // Warna Chart Prioritas (Low: Biru, Medium: Kuning, High: Merah)
  const priorityColors = ["#3B82F6", "#F59E0B", "#EF4444"];

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboard = async () => {
    try {
      showLoading("Memuat data dashboard kota...");
      const response = await getDashboardData();

      if (response.success && response.dashboard) {
        const d = response.dashboard;

        // 1. Mapping Statistik KPI

        // "Total Tiket"
        const total = d.total_tickets || 0;

        // "Insiden Critical/High" (Ambil dari by_priority.high)
        // Idealnya di-filter lagi yang statusnya open, tapi data agregat dashboard biasanya global.
        // Kita pakai jumlah total High Priority sebagai indikator kewaspadaan.
        const criticalCount = d.by_priority?.high || 0;

        // "Sedang Proses" (Assigned + In Progress + Pending Approval)
        const onProcess =
          (d.by_status?.assigned || 0) +
          (d.by_status?.in_progress || 0) +
          (d.by_status?.pending_approval || 0);

        // "Selesai"
        const finished =
          (d.by_status?.resolved || 0) + (d.by_status?.closed || 0);

        setStats({
          totalTiket: total,
          openCritical: criticalCount,
          sedangProses: onProcess,
          selesai: finished,
        });

        // 2. Mapping Chart (Berdasarkan Prioritas - Data yang tersedia)
        const byPrio = d.by_priority || {};
        const prioData = [
          { name: "Low", value: byPrio.low || 0 },
          { name: "Medium", value: byPrio.medium || 0 },
          { name: "High", value: byPrio.high || 0 },
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
      {/* SECTION 1: HEADER & KPI */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-[#053F5C] dark:text-[#9FE7F5] mb-4">
          <FiBarChart2 size={24} /> <span>Command Center Kota</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tiket (All OPD)"
            value={stats.totalTiket}
            icon={FiLayout}
            colorClass="bg-blue-600"
          />
          <StatCard
            title="Tiket Prioritas Tinggi"
            value={stats.openCritical}
            icon={FiAlertOctagon}
            colorClass="bg-red-600"
            desc="Total tiket High Priority"
          />
          <StatCard
            title="Sedang Diproses"
            value={stats.sedangProses}
            icon={FiPieChart}
            colorClass="bg-orange-500"
            desc="Lintas OPD"
          />
          <StatCard
            title="Tingkat Penyelesaian"
            value={stats.selesai}
            icon={FiCheckCircle}
            colorClass="bg-green-600"
            desc="Tiket Resolved/Closed"
          />
        </div>
      </div>

      {/* SECTION 2: CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM 1: CHART (2/3 Lebar) */}
        <div className="lg:col-span-1 h-full">
          <TicketChartWidget
            title="Sebaran Prioritas Insiden"
            height="300px"
            data={chartData}
            colors={priorityColors}
          />
        </div>

        {/* KOLOM 2: INFRASTRUKTUR STATUS (Manual/Static) */}
        {/* Karena data API tidak ada, kita keep ini sebagai tampilan statis agar dashboard 'terlihat' penuh */}
        <div className="lg:col-span-2 h-full">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
            <h3 className="font-bold text-slate-800 text-base md:text-lg dark:text-white mb-6 flex items-center gap-2">
              <FiServer
                className="text-[#053F5C] dark:text-[#429EBD]"
                size={20}
              />
              Status Infrastruktur Kota
            </h3>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-medium dark:text-slate-300">
                    Data Center Utama
                  </span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  ONLINE
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium dark:text-slate-300">
                    Jaringan FO Backbone
                  </span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  STABLE
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                  <span className="text-sm font-medium dark:text-slate-300">
                    Email Server
                  </span>
                </div>
                <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                  HIGH LOAD
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
              *Data monitoring infrastruktur (Real-time Simulation)
            </div>
          </div>
        </div>

        {/* KOLOM 3: AKSI CEPAT */}
        {/* <div className="lg:col-span-1">
          <QuickActionsWidgetOPD />
        </div> */}
      </div>
    </div>
  );
};

export default AdminKotaDashboard;
