import React, { useState, useMemo, useEffect } from "react";
import TicketStatusCard from "./TicketStatusCard";
import FormSelect from "../../../components/FormSelect";
import { getMyIncidents, getMyRequests } from "../services/trackService";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

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

  const [searchQuery, setSearchQuery] = useState("");

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
    setSearchQuery("");
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
    return tickets.filter((ticket) => {
      // 1. Filter by Status
      const matchStatus =
        selectedStatus === "Semua" ||
        ticket.status?.toLowerCase() === selectedStatus.toLowerCase();

      // 2. Filter by Ticket Number Or Title
      const query = searchQuery.toLowerCase();

      const ticketNum = ticket.ticketNumber
        ? ticket.ticketNumber.toLowerCase()
        : "";

      const ticketTitle = ticket.title ? ticket.title.toLowerCase() : "";

      const matchSearch =
        ticketNum.includes(query) || ticketTitle.includes(query);

      return matchStatus && matchSearch;
    });
  }, [tickets, selectedStatus, searchQuery]);

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

      {/* Filter, Search, and Refresh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Input Search */}
          <div className="w-full md:max-w-sm relative">
            <label
              htmlFor="search"
              className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Cari Tiket
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" />
              </div>
              <input
                id="search"
                type="text"
                placeholder="Masukkan judul atau nomor tiket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-11 min-w-11 pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053F5C] dark:focus:ring-[#9FE7F5] text-slate-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          {/* Dropdown Status */}
          <div className="w-full md:max-w-40">
            <FormSelect
              id="status-filter"
              name="status-filter"
              label="Filter Status"
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
        </div>

        {/* Tombol Refresh */}
        <button
          onClick={fetchTickets}
          className="flex-shrink-0 flex items-center justify-center min-h-[42px] min-w-[42px] mb-[1px] text-slate-600 hover:text-[#053F5C] dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors bg-slate-100 dark:bg-slate-700 rounded-lg md:bg-transparent md:dark:bg-transparent"
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
