/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import TicketFilters from "../features/tickets/components/TicketFilters";
import TicketTable from "../features/tickets/components/TicketTable";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
// import { useLoading } from "../context/LoadingContext";
import {
  getIncidents,
  getRequests,
} from "../features/tickets/services/ticketService";
import toast from "react-hot-toast";

const TicketManagementPage = () => {
  const { user } = useAuth();
  // const { showLoading, hideLoading } = useLoading();

  const [activeTab, setActiveTab] = useState("pengaduan");
  const [tickets, setTickets] = useState([]);

  const [filters, setFilters] = useState({ search: "", status: "Semua" });
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: 0,
    totalPages: 1,
    itemsPerPage: 10,
  });

  // // Filter by state logic
  // const filteredTickets = useMemo(() => {
  //   return mockAllTickets
  //     .filter((ticket) => {
  //       // Filter by tab
  //       return ticket.type.toLowerCase() === activeTab;
  //     })
  //     .filter((ticket) => {
  //       // Filter by status
  //       return filters.status === "Semua" || ticket.status === filters.status;
  //     })
  //     .filter((ticket) => {
  //       const searchLower = filters.search.toLowerCase();
  //       return (
  //         ticket.title.toLowerCase().includes(searchLower) ||
  //         ticket.id.toLowerCase().includes(searchLower)
  //       );
  //     });
  // }, [activeTab, filters, mockAllTickets]);

  // Mapping Status
  const mapStatusToApi = (uiStatus) => {
    if (uiStatus === "Semua") return "";

    const statusMap = {
      "Baru Masuk": "open",
      Ditugaskan: "assigned",
      "Revisi / Ditolak Atasan": "assigned",

      "Sedang Dikerjakan": "in_progress",
      "Perlu Analisa": "in_progress",
      Disetujui: "in_progress",
      "Menunggu Aprv. Seksi": "pending_approval",
      "Menunggu Aprv. Bidang": "pending_approval",

      Selesai: "resolved",
      Ditolak: "rejected",
    };

    return statusMap[uiStatus] || "";
  };

  // const paginatedTickets = filteredTickets.slice(
  //   (currentPage - 1) * ticketsPerPage,
  //   currentPage * ticketsPerPage
  // );

  // --- FETCH DATA ---
  const fetchTickets = async () => {
    // if (!user?.opd_id) return;

    // showLoading("Memuat data tiket...");
    try {
      const apiParams = {
        page: currentPage,
        limit: paginationInfo.itemsPerPage,
        search: filters.search,
        opd_id: user?.opd?.id || user?.opd_id,
        status: mapStatusToApi(filters.status),
      };

      let response;
      if (activeTab === "pengaduan") {
        response = await getIncidents(apiParams);
      } else {
        response = await getRequests(apiParams);
      }

      const { data, pagination } = response;
      console.log("response", response);

      // Transformation data API into format Table
      const mappedTickets = data.map((item) => ({
        id: item.ticket_number,
        dbId: item.id,
        title: item.title,
        status: item.status,
        stage: item.stage,
        date: item.created_at ? item.created_at.split("T")[0] : "-",
        type: activeTab === "pengaduan" ? "Pengaduan" : "Permintaan",
      }));

      setTickets(mappedTickets);

      // Update Pagination State
      if (pagination) {
        setPaginationInfo((prev) => ({
          ...prev,
          totalItems: pagination.total_items || 0,
          totalPages: pagination.total_pages || 1,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Gagal memuat tiket");
      setTickets([]);
    }
    // finally {
    //   // hideLoading();
    // }
  };

  // Trigger Fetch when dependencies change
  useEffect(() => {
    fetchTickets();
  }, [activeTab, filters, currentPage, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab]);

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
      <TicketFilters
        onFilterChange={setFilters}
        type={activeTab}
        role={user?.role?.name || "helpdesk"}
      />

      {/* Table Tickets */}
      <TicketTable tickets={tickets} />

      {/* Pagination */}
      <div className="max-w-5xl">
        <Pagination
          currentPage={currentPage}
          totalItems={paginationInfo.totalItems}
          itemsPerPage={paginationInfo.itemsPerPage}
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
