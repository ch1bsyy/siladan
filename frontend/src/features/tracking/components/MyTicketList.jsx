import React, { useState, useMemo, useEffect } from "react";
import TicketStatusCard from "./TicketStatusCard";
import FormSelect from "../../../components/FormSelect";
import { getMyIncidents, getMyRequests } from "../services/trackService";
import { FiRefreshCw } from "react-icons/fi";

// Set Filters
const complaintStatuses = [
  "Semua",
  "Open",
  "Pending",
  "Verified",
  "In Progress",
  "Resolved",
  "Closed",
  "Rejected",
];

const requestStatuses = [
  "Semua",
  "Open",
  "Pending",
  "Approved",
  "In Progress",
  "Completed",
  "Rejected",
];

const MyTicketList = () => {
  const [activeTab, setActiveTab] = useState("pengaduan");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const [tickets, setTickets] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions =
    activeTab === "pengaduan" ? complaintStatuses : requestStatuses;

  const fetchTickets = async () => {
    setIsFetching(true);
    setError(null);
    setTickets([]);

    try {
      let response;
      let rawData = [];

      if (activeTab === "pengaduan") {
        response = await getMyIncidents();
        rawData = response.data || response;
      } else {
        response = await getMyRequests();
        rawData = response.data || response;
      }

      const mappedTicket = Array.isArray(rawData)
        ? rawData.map((item) => ({
            id: item.id,
            ticketNumber: item.ticket_number,
            title: item.title,
            type: activeTab === "pengaduan" ? "Pengaduan" : "Permintaan",
            status: item.status,
            updatedAt:
              item.updated_at || item.created_at || new Date().toISOString(),
          }))
        : [];

      setTickets(mappedTicket);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Gagal memuat data tiket. Silakan coba lagi.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setSelectedStatus("Semua");
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  // Filter Logic
  const displayedTickets = useMemo(() => {
    // Filter By Status Only
    if (selectedStatus === "Semua") {
      return tickets;
    }
    // Case insensitive comparison for status
    return tickets.filter(
      (ticket) => ticket.status?.toLowerCase() === selectedStatus.toLowerCase()
    );
  }, [tickets, selectedStatus]);

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

      {/* Filter & Refresh */}
      <div className="flex justify-between items-end gap-2 md:gap-0 mb-6">
        <div className="w-full max-w-xs">
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
        <button
          onClick={fetchTickets}
          className="flex items-center justify-center min-h-11 min-w-11 text-slate-600 hover:text-[#053F5C] dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
          title="Refresh Data"
        >
          <FiRefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Ticket List Content */}
      <div className="space-y-6 min-h-[300px]">
        {isFetching ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <button
              onClick={fetchTickets}
              className="text-sm md:text-base font-bold underline text-red-700 dark:text-red-300"
            >
              Coba Lagi
            </button>
          </div>
        ) : displayedTickets.length > 0 ? (
          // Data Found
          displayedTickets.map((ticket) => (
            <TicketStatusCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          // Empty State
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-400 dark:border-slate-600">
            <p className="text-slate-600 dark:text-slate-400">
              Tidak ada tiket {activeTab} dengan status "{selectedStatus}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketList;
