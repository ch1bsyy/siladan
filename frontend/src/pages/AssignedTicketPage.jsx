import React, { useState, useMemo } from "react";
import AssignedTicketTable from "../features/tickets/components/AssignedTicketTable";
import Pagination from "../components/Pagination";
import TicketFilters from "../features/tickets/components/TicketFilters";

const mockMyTickets = [
  {
    id: "TK-0010",
    title: "Server Ruang Rapat Mati",
    type: "pengaduan",
    status: "Ditugaskan",
    priority: "Critical",
    sla: "2025-11-20T15:00:00",
    date: "2025-11-19",
  },
  {
    id: "TK-0012",
    title: "Printer Macet di Keuangan",
    type: "pengaduan",
    status: "Diproses",
    priority: "Medium",
    sla: "2025-11-22T17:00:00",
    date: "2025-11-19",
  },
  {
    id: "TK-0110",
    title: "Server Ruang Rapat Mati",
    type: "pengaduan",
    status: "Pending",
    priority: "Critical",
    sla: "2025-11-20T15:00:00",
    date: "2025-11-19",
  },
  {
    id: "TK-0112",
    title: "Printer Macet di Keuangan",
    type: "pengaduan",
    status: "Menunggu",
    priority: "Medium",
    sla: "2025-11-22T17:00:00",
    date: "2025-11-19",
  },
  {
    id: "TK-1110",
    title: "Server Ruang Rapat Mati",
    type: "pengaduan",
    status: "Diproses",
    priority: "Critical",
    sla: "2025-11-20T15:00:00",
    date: "2025-11-19",
  },
  {
    id: "TK-2112",
    title: "Printer Macet di Keuangan",
    type: "pengaduan",
    status: "Pending",
    priority: "Medium",
    sla: "2025-11-22T17:00:00",
    date: "2025-11-19",
  },
  {
    id: "REQ-0055",
    title: "Permintaan Akses VPN",
    type: "permintaan",
    status: "Analisa",
    priority: "High",
    sla: "2025-11-21T10:00:00",
    date: "2025-11-18",
  },
  {
    id: "REQ-0056",
    title: "Instalasi Microsoft Visio",
    type: "permintaan",
    status: "Menunggu Approval Atasan",
    priority: "Low",
    sla: "2025-11-25T12:00:00",
    date: "2025-11-15",
  },
];

const AssignedTicketPage = () => {
  const [activeTab, setActiveTab] = useState("pengaduan");
  const [filters, setFilters] = useState({ search: "", status: "Semua" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Data by Tab & Search & Status
  const filteredTickets = useMemo(() => {
    return mockMyTickets.filter((ticket) => {
      const matchTab = ticket.type === activeTab;

      const searchLower = filters.search.toLowerCase();
      const matchSearch =
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower);

      const matchStatus =
        filters.status === "Semua" || ticket.status === filters.status;

      return matchTab && matchSearch && matchStatus;
    });
  }, [activeTab, filters]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setFilters({ search: "", status: "Semua" });
  };

  return (
    <div className="space-y-6 dark:text-white">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white ">
          Pengerjaan Tiket
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Daftar tugas tiket yang harus Anda kerjakan. Prioritaskan berdasarkan
          SLA.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <TabButton
          label="Tiket Pengaduan"
          isActive={activeTab === "pengaduan"}
          onClick={() => handleTabChange("pengaduan")}
        />
        <TabButton
          label="Tiket Permintaan"
          isActive={activeTab === "permintaan"}
          onClick={() => handleTabChange("permintaan")}
        />
      </div>

      <div className="w-full">
        <TicketFilters
          role="teknisi"
          type={activeTab}
          onFilterChange={setFilters}
        />
      </div>

      {/* Table Section */}
      <AssignedTicketTable tickets={currentTickets} />

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredTickets.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

// Sub Component
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 min-h-[44px] min-w-[44px] font-semibold rounded-full transition-colors ${
      isActive
        ? "bg-[#053F5C] text-white dark:bg-[#429EBD]/40"
        : "text-slate-700 dark:text-slate-300 hover:bg-[#053F5C]/80 hover:text-white dark:hover:text-slate-300 dark:hover:bg-[#429EBD]/20 cursor-pointer"
    }`}
  >
    {label}
  </button>
);

export default AssignedTicketPage;
