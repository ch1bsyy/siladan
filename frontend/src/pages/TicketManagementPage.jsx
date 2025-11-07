/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import TicketFilters from "../features/tickets/components/TicketFilters";
import TicketTable from "../features/tickets/components/TicketTable";
import Pagination from "../components/Pagination";

const mockAllTickets = [
  {
    id: "TK-0010",
    title: "Jaringan Server Down di Ruang Rapat",
    type: "Pengaduan",
    status: "Diproses",
    date: "2025-10-15",
  },
  {
    id: "TK-0015",
    title: "Instalasi Lambat di Microsoft Office",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-13",
  },
  {
    id: "TK-0018",
    title: "Jaringan Lambat",
    type: "Pengaduan",
    status: "Menunggu",
    date: "2025-10-25",
  },
  {
    id: "TK-0019",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "TK-0020",
    title: "Mouse Rusak",
    type: "Pengaduan",
    status: "Menunggu",
    date: "2025-10-26",
  },
  {
    id: "TK-0110",
    title: "Jaringan Server Down di Ruang Rapat",
    type: "Pengaduan",
    status: "Diproses",
    date: "2025-10-15",
  },
  {
    id: "TK-0115",
    title: "Instalasi Lambat di Microsoft Office",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-13",
  },
  {
    id: "TK-0118",
    title: "Jaringan Lambat",
    type: "Pengaduan",
    status: "Menunggu",
    date: "2025-10-25",
  },
  {
    id: "TK-0119",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "TK-0120",
    title: "Mouse Rusak",
    type: "Pengaduan",
    status: "Menunggu",
    date: "2025-10-26",
  },
  {
    id: "TK-1110",
    title: "Jaringan Server Down di Ruang Rapat",
    type: "Pengaduan",
    status: "Diproses",
    date: "2025-10-15",
  },
  {
    id: "TK-1115",
    title: "Instalasi Lambat di Microsoft Office",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-13",
  },
  {
    id: "TK-1118",
    title: "Jaringan Lambat",
    type: "Pengaduan",
    status: "Menunggu",
    date: "2025-10-25",
  },
  {
    id: "TK-1119",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "TK-1120",
    title: "Mouse Rusak",
    type: "Pengaduan",
    status: "Menunggu",
    date: "2025-10-26",
  },
  {
    id: "TK-1114",
    title: "Jaringan Lambat",
    type: "Pengaduan",
    status: "Menunggu",
    date: "2025-10-25",
  },
  {
    id: "TK-1112",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "TK-1121",
    title: "Mouse Rusak",
    type: "Pengaduan",
    status: "Menunggu",
    date: "2025-10-26",
  },
  {
    id: "TK-002",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "TK-003",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "TK-004",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "TK-0005",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "TK-1002",
    title: "Permintaan Aset Baru",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
  },
  {
    id: "REQ-001",
    title: "Permintaan Instalasi Microsoft Office",
    type: "Permintaan",
    status: "Selesai",
    date: "2025-10-14",
    createdAt: "2025-10-19T09:00:00Z",
    updatedAt: "2025-10-20T14:00:00Z",
    pelapor: { name: "Pegawai A", email: "pegawai.a@opd.go.id" },
    deskripsi: "Butuh instalasi Office 365 di komputer baru ruang arsip.",
    history: [
      { status: "Diajukan", date: "2025-10-19T09:00:00Z", by: "Pegawai A" },
      { status: "Disetujui", date: "2025-10-19T11:00:00Z", by: "Seksi" },
      { status: "Selesai", date: "2025-10-20T14:00:00Z", by: "Teknisi Budi" },
    ],
  },
];

const TicketManagementPage = () => {
  const [activeTab, setActiveTab] = useState("pengaduan");
  const [filters, setFilters] = useState({ search: "", status: "Semua" });
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  // Filter by state logic
  const filteredTickets = useMemo(() => {
    return mockAllTickets
      .filter((ticket) => {
        // Filter by tab
        return ticket.type.toLowerCase() === activeTab;
      })
      .filter((ticket) => {
        // Filter by status
        return filters.status === "Semua" || ticket.status === filters.status;
      })
      .filter((ticket) => {
        const searchLower = filters.search.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.id.toLowerCase().includes(searchLower)
        );
      });
  }, [activeTab, filters, mockAllTickets]);

  // Pagination Logic
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  return (
    <div className="space-y-6 dark:text-white">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white ">
          Manajemen Tiket
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Kelola seluruh pengaduan dan permintaan pengguna dalam satu halaman.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <TabButton
          label="Pengaduan"
          isActive={activeTab === "pengaduan"}
          onClick={() => setActiveTab("pengaduan")}
        />
        <TabButton
          label="Permintaan"
          isActive={activeTab === "permintaan"}
          onClick={() => setActiveTab("permintaan")}
        />
      </div>

      {/* Filter */}
      <TicketFilters onFilterChange={setFilters} />

      {/* Table Tickets */}
      <TicketTable tickets={paginatedTickets} />

      {/* Pagination */}
      <div className="max-w-5xl">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredTickets.length}
          itemsPerPage={ticketsPerPage}
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

export default TicketManagementPage;
