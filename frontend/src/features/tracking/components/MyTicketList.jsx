import React, { useState, useMemo } from "react";
import TicketStatusCard from "./TicketStatusCard";
import FormSelect from "../../../components/FormSelect";

// Mock Ticket Data
const mockMyTickets = [
  {
    id: "REQ-001",
    title: "Permintaan Instalasi Microsoft Office",
    type: "Permintaan",
    status: "Selesai",
    updatedAt: "2025-10-20T14:00:00Z",
  },
  {
    id: "SILADAN-101",
    title: "Jaringan Internet Lambat di Ruang Rapat",
    type: "Pengaduan",
    status: "Dikerjakan Teknisi",
    updatedAt: "2025-10-25T11:00:00Z",
  },
  {
    id: "SILADAN-102",
    title: "AC di Aula Utama Mati",
    type: "Pengaduan",
    status: "Pending",
    updatedAt: "2025-10-24T08:00:00Z",
  },
  {
    id: "REQ-002",
    title: "Permintaan Penambahan RAM Laptop",
    type: "Permintaan",
    status: "Disetujui",
    updatedAt: "2025-10-23T15:00:00Z",
  },
  {
    id: "SILADAN-103",
    title: "Mouse Rusak",
    type: "Pengaduan",
    status: "Selesai",
    updatedAt: "2025-10-22T10:00:00Z",
  },
];

// Set Filters
const complaintStatuses = [
  "Semua",
  "Pending",
  "Diverifikasi",
  "Dikerjakan Teknisi",
  "Selesai",
  "Ditolak",
];

const requestStatuses = ["Semua", "Pending", "Disetujui", "Selesai", "Ditolak"];

const MyTicketList = () => {
  const [activeTab, setActiveTab] = useState("pengaduan");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  // hook fetch data
  const allTickets = mockMyTickets;

  const statusOptions =
    activeTab === "pengaduan" ? complaintStatuses : requestStatuses;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedStatus("Semua");
  };

  // Filter Logic with UseMemo
  const displayedTickets = useMemo(() => {
    // Filter By Type (Active Tab)
    const ticketsByType = allTickets.filter(
      (ticket) => ticket.type.toLowerCase() === activeTab
    );

    // Filter By Status (Active Filter)
    if (selectedStatus === "Semua") {
      return ticketsByType;
    }

    return ticketsByType.filter((ticket) => ticket.status === selectedStatus);
  }, [allTickets, activeTab, selectedStatus]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => handleTabChange("pengaduan")}
          className={`px-6 py-3 font-semibold ${
            activeTab === "pengaduan"
              ? "border-b-2 border-[#053F5C] text-[#053F5C] dark:border-[#9FE7F5] dark:text-[#9FE7F5]"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          }`}
        >
          Pengaduan
        </button>
        <button
          onClick={() => handleTabChange("permintaan")}
          className={`px-6 py-3 font-semibold ${
            activeTab === "permintaan"
              ? "border-b-2 border-[#053F5C] text-[#053F5C] dark:border-[#9FE7F5] dark:text-[#9FE7F5]"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          }`}
        >
          Permintaan
        </button>
      </div>

      <div className="mb-6 max-w-xs">
        <FormSelect
          id="status-filter"
          name="status-filter"
          label="Filter Berdasarkan Status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FormSelect>
      </div>

      <div className="space-y-6">
        {displayedTickets.length > 0 ? (
          displayedTickets.map((ticket) => (
            <TicketStatusCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-10 ">
            Tidak ada tiket dengan status "{selectedStatus}" di tab {activeTab}.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyTicketList;
