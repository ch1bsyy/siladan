import React, { useState, useEffect, useCallback, useMemo } from "react";
import AssignedTicketTable from "../features/tickets/components/AssignedTicketTable";
import Pagination from "../components/Pagination";
import TicketFilters from "../features/tickets/components/TicketFilters";
import { useAuth } from "../context/AuthContext";
import {
  getIncidents,
  getRequests,
} from "../features/tickets/services/ticketService";
import { mapBackendStatusToUI } from "../features/tickets/utils/statusMapping";
import toast from "react-hot-toast";

const AssignedTicketPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("pengaduan");
  const [allMyTickets, setAllMyTickets] = useState([]);
  const [displayedTickets, setDisplayedTickets] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({ search: "", status: "Semua" });

  const fetchTickets = useCallback(async () => {
    try {
      const params = {
        page: 1,
        limit: 100,
        opd_id: user?.opd_id || user?.opd?.id,
      };

      let response;
      if (activeTab === "pengaduan") {
        response = await getIncidents(params);
        console.log("tickets", response);
      } else {
        response = await getRequests(params);
        console.log("tickets", response);
      }

      // Transform data
      if (response.success && Array.isArray(response.data)) {
        const myTasks = response.data.filter((item) => {
          const isNotOpen = item.status !== "open";
          const isAssignedToMe = item.technician?.id === user?.id;

          return isNotOpen && isAssignedToMe;
        });

        // Mapping ke format Table
        const formattedData = myTasks.map((item) => ({
          id: item.ticket_number,
          dbId: item.id,
          title: item.title,
          type: activeTab,

          status: item.status,
          stage: item.stage,
          uiStatus: mapBackendStatusToUI(item.status, item.stage),

          priority: item.priority ? capitalize(item.priority) : "-",
          sla: item.sla_due,
          date: new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));

        setAllMyTickets(formattedData);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Gagal memuat data tiket");
      setAllMyTickets([]);
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    let result = allMyTickets;

    if (filters.status !== "Semua") {
      result = result.filter((t) => t.uiStatus === filters.status);
    }

    if (filters.search) {
      const lowerSearch = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerSearch) ||
          t.id.toLowerCase().includes(lowerSearch)
      );
    }

    setDisplayedTickets(result);
    setCurrentPage(1);
  }, [filters, allMyTickets]);

  // 3. Pagination Logic
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayedTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [displayedTickets, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({ search: "", status: "Semua" });
    setAllMyTickets([]);
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => {
      if (
        prev.search === newFilters.search &&
        prev.status === newFilters.status
      ) {
        return prev;
      }
      return newFilters;
    });
  }, []);

  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

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
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Table Section */}
      <AssignedTicketTable tickets={paginatedTickets} />

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalItems={displayedTickets.length}
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
