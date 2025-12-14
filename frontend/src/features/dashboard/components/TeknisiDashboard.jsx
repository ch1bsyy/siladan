import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import { FiInbox, FiCheckCircle, FiTool } from "react-icons/fi";
import TicketListWidget from "./TicketListWidget";
import TicketChartWidget from "./TicketChartWidget";

import { useLoading } from "../../../context/LoadingContext";
import { getDashboardData } from "../services/dashboardService";
import toast from "react-hot-toast";

const TeknisiDashboard = () => {
  const { showLoading, hideLoading } = useLoading();

  const [stats, setStats] = useState({
    tugasBaru: 0,
    tiketSelesai: 0,
    sedangDikerjakan: 0,
  });

  const [ticketList, setTicketList] = useState([]);
  const [chartData, setChartData] = useState([]);

  const chartColors = ["#3B82F6", "#F59E0B", "#10B981"];

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

        setStats({
          tugasBaru: d.by_status?.assigned || 0,
          sedangDikerjakan: d.by_status?.in_progress || 0,
          tiketSelesai:
            (d.by_status?.resolved || 0) + (d.by_status?.closed || 0),
        });

        // Mapping ticket
        const activeTickets = (d.my_assigned_tickets || [])
          .filter(
            (t) =>
              t.status === "assigned" ||
              t.status === "open" ||
              t.status === "in_progress"
          )

          .sort((a, b) => {
            if (a.status === "assigned" && b.status !== "assigned") return -1;
            if (a.status !== "assigned" && b.status === "assigned") return 1;
            return 0;
          })
          .slice(0, 5);

        setTicketList(activeTickets);

        // Mapping Chart
        const composition = [
          { name: "Tugas Baru", value: d.by_status?.assigned || 0 },
          { name: "Sedang Dikerjakan", value: d.by_status?.in_progress || 0 },
          {
            name: "Selesai",
            value: (d.by_status?.resolved || 0) + (d.by_status?.closed || 0),
          },
        ].filter((item) => item.value > 0);

        setChartData(composition);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="space-y-8 dark:text-white">
      {/* Header Section */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-[#053F5C] dark:text-[#9FE7F5]">
          <FiTool size={20} /> <span>Area Pengerjaan Tiket</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Tugas Baru"
          value={stats.tugasBaru}
          icon={FiInbox}
          colorClass="bg-blue-500"
          desc="Tiket menunggu respon"
        />
        <StatCard
          title="Sedang Dikerjakan"
          value={stats.sedangDikerjakan}
          icon={FiTool}
          colorClass="bg-yellow-500" // Ubah jadi kuning/orange biar beda
          desc="Tiket dalam proses perbaikan"
        />
        <StatCard
          title="Tiket Diselesaikan"
          value={stats.tiketSelesai}
          icon={FiCheckCircle}
          colorClass="bg-green-500"
          desc="Total tiket selesai bulan ini" // Asumsi dashboard per periode
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2">
          <TicketListWidget
            title="Tugas Menunggu Tindakan"
            tickets={ticketList}
            ticketsLink="assigned-tickets"
            detailTicketLink="detail-assigned-ticket"
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <TicketChartWidget
            title="Komposisi Tugas Saya"
            height="250px"
            data={chartData}
            colors={chartColors}
          />
        </div>
      </div>
    </div>
  );
};

export default TeknisiDashboard;
