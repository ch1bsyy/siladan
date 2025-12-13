import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import {
  FiInbox,
  FiUserCheck,
  FiShield,
  FiPlayCircle,
  FiTool,
} from "react-icons/fi";
import TicketListWidget from "./TicketListWidget";
import TicketChartWidget from "./TicketChartWidget";

import { useLoading } from "../../../context/LoadingContext";
import { getDashboardData } from "../services/dashboardService";
import toast from "react-hot-toast";

const TeknisiDashboard = () => {
  const { showLoading, hideLoading } = useLoading();

  const [stats, setStats] = useState({
    tugasBaru: 0,
    approvalSeksi: 0,
    approvalBidang: 0,
    siapDikerjakan: 0,
    sedangDikerjakan: 0,
  });

  const [ticketList, setTicketList] = useState([]);
  const [chartData, setChartData] = useState([]);

  const chartColors = ["#F7AD19", "#429EBD", "#82ca9d", "#ffc658", "#ff8042"];

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboard = async () => {
    try {
      showLoading("Memuat data dashboard...");
      const response = await getDashboardData();
      console.log("response", response);

      if (response.success && response.dashboard) {
        const d = response.dashboard;

        setStats({
          tugasBaru: d.by_status?.assigned || 0,

          approvalSeksi: d.by_stage?.approval_seksi || 0,
          approvalBidang: d.by_stage?.approval_bidang || 0,

          siapDikerjakan: d.by_stage?.ready_to_execute || 0,

          sedangDikerjakan: d.by_status?.in_progress || 0,
        });

        // Mapping ticket
        const activeTickets = (d.my_assigned_tickets || [])
          .filter(
            (t) =>
              t.status !== "closed" &&
              t.status !== "resolved" &&
              t.stage === "verification"
          )
          .slice(0, 5);

        setTicketList(activeTickets);

        // Mapping Chart
        const statusComposition = Object.keys(d.by_status || {})
          .map((key) => ({
            name: formatStatusName(key),
            value: d.by_status[key],
          }))
          .filter((item) => item.value > 0);

        setChartData(statusComposition);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      hideLoading();
    }
  };

  // Helper for chart name
  const formatStatusName = (key) => {
    const names = {
      open: "Open",
      assigned: "Tugas Baru",
      in_progress: "Sedang Dikerjakan",
      pending_approval: "Menunggu Approval",
      resolved: "Selesai",
      closed: "Ditutup",
    };
    return names[key] || key;
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
        />
        <StatCard
          title="Menunggu Approval Seksi"
          value={stats.approvalSeksi}
          icon={FiUserCheck}
          colorClass="bg-yellow-500"
        />
        <StatCard
          title="Menunggu Approval Bidang"
          value={stats.approvalBidang}
          icon={FiShield}
          colorClass="bg-orange-500"
        />
        <StatCard
          title="Siap Untuk Dikerjakan"
          value={stats.siapDikerjakan}
          icon={FiPlayCircle}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Sedang Dikerjakan"
          value={stats.sedangDikerjakan}
          icon={FiTool}
          colorClass="bg-[#429EBD]"
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
