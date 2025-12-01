import React from "react";
import StatCard from "./StatCard";
import TicketListWidget from "./TicketListWidget";
import TicketChartWidget from "./TicketChartWidget";
import QuickActionsWidget from "./QuickActionsWidget";
import {
  FiInbox,
  FiAlertTriangle,
  FiCheckSquare,
  FiShield,
} from "react-icons/fi";

// Mock Data Tiket
const mockTickets = [
  {
    id: "SILADAN-124",
    title: "Printer tidak terdeteksi",
    type: "Pengaduan",
    status: "Pending",
  },
  {
    id: "REQ-003",
    title: "Permintaan Peminjaman Proyektor",
    type: "Permintaan",
    status: "Pending",
  },
  {
    id: "SILADAN-125",
    title: "WiFi Lambat di Aula",
    type: "Pengaduan",
    status: "Pending",
  },
  {
    id: "REQ-004",
    title: "Permintaan Instalasi Aplikasi X",
    type: "Permintaan",
    status: "Pending",
  },
  {
    id: "SILADAN-126",
    title: "Aplikasi A tidak bisa diakses",
    type: "Pengaduan",
    status: "Pending",
  },
];

// Mock data Pie Chart
const myTaskCompositionData = [
  { name: "Insiden", value: 8 },
  { name: "Permintaan", value: 4 },
];

const myTaskColors = ["#F7AD19", "#429EBD"];

const HelpdeskDashboard = () => {
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
          value="12"
          icon={FiInbox}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Total Tiket Insiden Terbaru"
          value="8"
          icon={FiAlertTriangle}
          colorClass="bg-[#F7AD19]"
        />
        <StatCard
          title="Total Tiket Request Terbaru"
          value="4"
          icon={FiCheckSquare}
          colorClass="bg-[#429EBD]"
        />
      </div>

      {/* Widget List & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TicketListWidget
            title="Tiket Terbaru (Perlu Verifikasi)"
            tickets={mockTickets}
            ticketsLink="/dashboard/manage-tickets"
            detailTicketLink="/dashboard/detail-manage-ticket"
          />
        </div>

        <div className="lg:col-span-1 flex flex-col justify-between gap-6">
          <QuickActionsWidget />
          <TicketChartWidget
            title="Komposisi Tiket Masuk"
            height="250px"
            data={myTaskCompositionData}
            colors={myTaskColors}
          />
        </div>
      </div>
    </div>
  );
};

export default HelpdeskDashboard;
