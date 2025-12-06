import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import FormSelect from "../../../components/FormSelect";
import { FiSearch } from "react-icons/fi";

const STATUS_CONFIG = {
  helpdesk: {
    common: [
      "Baru Masuk",
      "Ditugaskan",
      "Sedang Dikerjakan",
      "Selesai",
      "Ditolak",
    ],
    pengaduan: [
      "Baru Masuk",
      "Ditugaskan",
      "Sedang Dikerjakan",
      "Selesai",
      "Ditolak",
    ],
    permintaan: [
      "Baru Masuk",
      "Ditugaskan", // Assigned (Verification)
      "Perlu Analisa", // In Progress (Analysis)
      "Menunggu Aprv. Seksi", // Pending Approval (Seksi)
      "Menunggu Aprv. Bidang", // Pending Approval (Bidang)
      "Disetujui", // In Progress (Ready to Execute)
      "Revisi / Ditolak Atasan", // Assigned (Revision)
      "Sedang Dikerjakan", // In Progress (Execution)
      "Selesai",
      "Ditolak",
    ],
  },
  teknisi: {
    common: ["Ditugaskan", "Sedang Dikerjakan", "Selesai"],
    pengaduan: ["Ditugaskan", "Sedang Dikerjakan", "Selesai"],
    permintaan: [
      "Ditugaskan",
      "Perlu Analisa",
      // "Menunggu Approval Seksi",
      // "Menunggu Approval Bidang",
      "Menunggu Approval", // General waiting
      "Disetujui",
      "Sedang Dikerjakan",
      "Selesai",
    ],
  },
};

const TicketFilters = ({
  onFilterChange,
  type = "common",
  role = "helpdesk",
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");

  useEffect(() => {
    setStatus("Semua");
  }, [type]);

  const roleConfig = STATUS_CONFIG[role] || STATUS_CONFIG.helpdesk;
  const currentStatusOptions = roleConfig[type] || roleConfig.common;

  // Send update filter when state changed
  useEffect(() => {
    onFilterChange({ search, status });
  }, [search, status, onFilterChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
      {/* Search Bar */}
      <div className="flex-1">
        <Input
          id="search-ticket"
          placeholder="Cari tiket berdasarkan judul atau nomor tiket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          rightIcon={<FiSearch className="text-slate-400" />}
        />
      </div>

      {/* Filter Status */}
      <div className="w-full md:w-56 md:mt-1">
        <FormSelect
          id="status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Semua">Semua Status</option>
          {currentStatusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </FormSelect>
      </div>
    </div>
  );
};

export default TicketFilters;
