import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import TicketListWidget from "./TicketListWidget";
import TicketChartWidget from "./TicketChartWidget";
import QuickActionsWidget from "./QuickActionsWidget";

import { useAuth } from "../../../context/AuthContext";
// import { useLoading } from "../../../context/LoadingContext";
import toast from "react-hot-toast";

import {
  getIncidents,
  getRequests,
} from "../../tickets/services/ticketService";
import {
  FiInbox,
  FiAlertTriangle,
  FiCheckSquare,
  FiShield,
} from "react-icons/fi";

const myTaskColors = ["#F7AD19", "#429EBD"];

const HelpdeskDashboard = () => {
  const { user } = useAuth();
  // const { showLoading, hideLoading } = useLoading();

  const [stats, setStats] = useState({
    total: 0,
    incident: 0,
    request: 0,
  });

  const [recentTickets, setRecentTickets] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.opd?.id && !user?.opd_id) return;
      const opdId = user?.opd?.id || user?.opd_id;

      setIsLoading(true);
      try {
        // Stat
        const incidentStatsPromise = getIncidents({
          opd_id: opdId,
          page: 1,
          limit: 1,
          status: "open",
        });

        const requestStatsPromise = getRequests({
          opd_id: opdId,
          page: 1,
          limit: 1,
          status: "open",
        });

        // List
        const incidentListPromise = getIncidents({
          opd_id: opdId,
          page: 1,
          limit: 5,
          status: "open",
        });

        const requestListPromise = getRequests({
          opd_id: opdId,
          page: 1,
          limit: 5,
          status: "open",
        });

        const [incStats, reqStats, incList, reqList] = await Promise.all([
          incidentStatsPromise,
          requestStatsPromise,
          incidentListPromise,
          requestListPromise,
        ]);

        // --- PROCESS STATS ---
        const totalIncident = incStats.pagination?.total || 0;
        const totalRequest = reqStats.pagination?.total || 0;

        setStats({
          total: totalIncident + totalRequest,
          incident: totalIncident,
          request: totalRequest,
        });

        // --- PROCESS CHART DATA ---
        setChartData([
          { name: "Insiden", value: totalIncident },
          { name: "Permintaan", value: totalRequest },
        ]);

        // --- PROSES RECENT TICKETS ---
        const rawIncidents = incList.data || [];
        const rawRequests = reqList.data || [];

        const formattedIncidents = rawIncidents.map((t) => ({
          id: t.ticket_number,
          dbId: t.id,
          title: t.title,
          type: "Pengaduan",
          status: t.status,
          date: new Date(t.created_at),
        }));

        const formattedRequests = rawRequests.map((t) => ({
          id: t.ticket_number,
          dbId: t.id,
          title: t.title,
          type: "Permintaan",
          status: t.status,
          date: new Date(t.created_at),
        }));

        const combined = [...formattedIncidents, ...formattedRequests];

        // Sort Descending
        combined.sort((a, b) => a.date - b.date);

        // Take Top Five
        setRecentTickets(combined.slice(0, 5));
      } catch (error) {
        console.error("Dashboard Error:", error);
        toast.error("Gagal memuat data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#053F5C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 dark:text-white">
      {/* Header Section */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-[#053F5C] dark:text-[#9FE7F5]">
          <FiShield size={20} /> <span>Area Manajemen & Verifikasi Tiket</span>
        </h2>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Tiket Terbaru"
          value={stats.total}
          icon={FiInbox}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Total Tiket Insiden Terbaru"
          value={stats.incident}
          icon={FiAlertTriangle}
          colorClass="bg-[#F7AD19]"
        />
        <StatCard
          title="Total Tiket Request Terbaru"
          value={stats.request}
          icon={FiCheckSquare}
          colorClass="bg-[#429EBD]"
        />
      </div>

      {/* Widget List & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TicketListWidget
            title="Tiket Terbaru (Perlu Verifikasi)"
            tickets={recentTickets}
            ticketsLink="/dashboard/manage-tickets"
            detailTicketLink="/dashboard/detail-manage-ticket"
          />
        </div>

        <div className="lg:col-span-1 flex flex-col justify-between gap-6">
          <QuickActionsWidget />
          <TicketChartWidget
            title="Komposisi Tiket Masuk"
            height="250px"
            data={chartData}
            colors={myTaskColors}
          />
        </div>
      </div>
    </div>
  );
};

export default HelpdeskDashboard;
