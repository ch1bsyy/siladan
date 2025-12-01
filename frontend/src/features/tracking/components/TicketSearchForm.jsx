import React, { useState } from "react";
import Input from "../../../components/Input";
import { FiSearch } from "react-icons/fi";
import TicketStatusCard from "./TicketStatusCard";
import { useLoading } from "../../../context/LoadingContext";
import { getTicketStatusByNumber } from "../services/trackService";

const TicketSearchForm = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [foundTicket, setFoundTicket] = useState(null);
  const [error, setError] = useState("");

  const { isLoading, showLoading, hideLoading } = useLoading();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!ticketNumber.trim()) {
      setError("Mohon masukkan nomor tiket.");
      return;
    }

    showLoading("Mencari tiket Anda. Harap tunggu...");
    setError("");
    setFoundTicket(null);

    try {
      const response = await getTicketStatusByNumber(ticketNumber);

      if (response.success && response.data) {
        const { ticket_info, timeline } = response.data;
        console.log("Response", response.data);

        const mappedTicket = {
          id: ticket_info.ticket_number,
          title: ticket_info.title,
          type: "Pengaduan",
          status: ticket_info.status,
          updatedAt: ticket_info.last_updated || ticket_info.created_at,
          timeline: timeline,
        };

        setFoundTicket(mappedTicket);
      } else {
        setError("Data tiket tidak valid.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Tiket tidak ditemukan. Periksa kembali nomor tiket Anda."
      );
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg space-y-4"
      >
        <Input
          id="ticketNumber"
          label="Nomor Ticket"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          placeholder="Contoh: INC-2025-1234"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#429EBD] hover:bg-[#053F5C] transition-colors shadow-lg disabled:opacity-50"
        >
          <FiSearch size={18} />
          <span>{isLoading ? "Mencari..." : "Lacak Tiket"}</span>
        </button>
      </form>

      <div className="mt-8">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center border border-red-200">
            {error}
          </div>
        )}

        {foundTicket && (
          <div>
            <h3 className="text-lg font-semibold text-center text-slate-800 dark:text-slate-200 mb-4">
              Hasil Pencarian:
            </h3>
            <TicketStatusCard ticket={foundTicket} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSearchForm;
