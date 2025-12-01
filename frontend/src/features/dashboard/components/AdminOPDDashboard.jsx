import React from "react";
import {
  FiInbox,
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";

import StatCard from "./StatCard";
import TicketListWidget from "./TicketListWidget";
import TicketChartWidget from "./TicketChartWidget";
import QuickActionsWidgetOPD from "./QuickActionsWidgetOPD";
import TechnicianStatusWidget from "./TechnicianStatusWidget";

// --- MOCK DATA ---
const urgentTickets = [
  {
    id: "TK-0010",
    title: "Server Ruang Rapat Mati",
    type: "Pengaduan",
    status: "Overdue",
    priority: "Critical",
  },
  {
    id: "TK-0112",
    title: "Jaringan Lambat Lt 2",
    type: "Pengaduan",
    status: "Menunggu", // need reassign
    priority: "High",
  },
  {
    id: "REQ-0057",
    title: "Laptop Baru Staff Keuangan",
    type: "Permintaan",
    status: "Menunggu Approval",
  },
  {
    id: "TK-0045",
    title: "Printer Macet (Eskalasi)",
    type: "Pengaduan",
    status: "Diproses",
    priority: "Medium",
  },
  {
    id: "TK-0049",
    title: "Printer Macet (Eskalasi)",
    type: "Pengaduan",
    status: "Diproses",
    priority: "Medium",
  },
];

const ticketCategoryData = [
  { name: "Hardware", value: 45 },
  { name: "Software", value: 30 },
  { name: "Jaringan", value: 15 },
  { name: "Akun", value: 10 },
];

const categoryColors = ["#818CF8", "#F7AD19", "#429EBD", "#FF8042"];

const AdminOPDDashboard = () => {
  return (
    <div className="space-y-6 dark:text-white animate-fade-in pb-10">
      {/* SECTION 1: KPI CARDS */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-[#053F5C] dark:text-[#9FE7F5] mb-4">
          <FiBarChart2 size={24} /> <span>Overview Operasional</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tiket Masuk"
            value="185"
            icon={FiInbox}
            colorClass="bg-blue-500"
          />
          <StatCard
            title="Perlu Tindakan"
            value="12"
            icon={FiAlertTriangle}
            colorClass="bg-red-600"
          />
          <StatCard
            title="Artikel Pending Review"
            value="5"
            icon={FiFileText}
            colorClass="bg-orange-500"
          />
          <StatCard
            title="SLA Compliance"
            value="95%"
            icon={FiCheckCircle}
            colorClass="bg-green-500"
          />
        </div>
      </div>

      {/* SECTION 2: MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TicketListWidget
            title="Tiket Prioritas & Overdue"
            tickets={urgentTickets}
            ticketsLink="manage-tickets"
            detailTicketLink="detail-manage-ticket"
          />
        </div>
        <div className="lg:col-span-1">
          <QuickActionsWidgetOPD />
        </div>

        <div className="lg:col-span-1">
          <TicketChartWidget
            title="Sebaran Kategori Masalah"
            height="300px"
            data={ticketCategoryData}
            colors={categoryColors}
          />
        </div>
        <div className="lg:col-span-1">
          <TechnicianStatusWidget />
        </div>
      </div>
    </div>
  );
};

export default AdminOPDDashboard;
