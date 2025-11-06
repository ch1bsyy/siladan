import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import FormSelect from "../../../components/FormSelect";
import { FiSearch } from "react-icons/fi";

const TicketFilters = ({ onFilterChange }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");

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
          <option value="Pending">Pending</option>
          <option value="Diproses">Diproses</option>
          <option value="Selesai">Selesai</option>
          <option value="Ditolak">Ditolak</option>
        </FormSelect>
      </div>
    </div>
  );
};

export default TicketFilters;
