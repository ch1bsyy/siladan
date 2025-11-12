import React from "react";
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

// Mock data
const myAssignedTickets = [
  {
    id: "TK-0010",
    title: "Jaringan Server Down",
    type: "Pengaduan",
    status: "Tugas Baru",
  },
  {
    id: "REQ-004",
    title: "Permintaan Instalasi",
    type: "Permintaan",
    status: "Siap Dikerjakan",
  },
  {
    id: "TK-0018",
    title: "Jaringan Lambat",
    type: "Pengaduan",
    status: "Tugas Baru",
  },
];

const tickesforAction = myAssignedTickets
  .filter((t) => t.status === "Tugas Baru" || t.status === "Siap Dikerjakan")
  .slice(0, 5);

const myTaskCompositionData = [
  { name: "Tugas Baru", value: 3 },
  { name: "Sedang Dikerjakan", value: 5 },
  { name: "Menunggu Approval", value: 2 },
];

const myTaskColors = ["#F7AD19", "#429EBD", "#82ca9d"];

const TeknisiDashboard = () => {
  return (
    <div className="space-y-8 dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Tugas Baru"
          value="3"
          icon={FiInbox}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Menunggu Approval User"
          value="1"
          icon={FiUserCheck}
          colorClass="bg-yellow-500"
        />
        <StatCard
          title="Menunggu Approval Atasan"
          value="1"
          icon={FiShield}
          colorClass="bg-orange-500"
        />
        <StatCard
          title="Siap Untuk Dikerjakan"
          value="2"
          icon={FiPlayCircle}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Sedang Dikerjakan"
          value="5"
          icon={FiTool}
          colorClass="bg-[#429EBD]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2">
          <TicketListWidget
            title="Tugas Menunggu Tindakan"
            tickets={tickesforAction}
            ticketsLink="assigned-tickets"
            detailTicketLink="detail-assigned-ticket"
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <TicketChartWidget
            title="Komposisi Tugas Saya"
            data={myTaskCompositionData}
            colors={myTaskColors}
          />
        </div>
      </div>
    </div>
  );
};

export default TeknisiDashboard;
