import React, { useState } from "react";
import Input from "../../../components/Input";
import { FiSearch } from "react-icons/fi";
import TicketStatusCard from "./TicketStatusCard";
import { useLoading } from "../../../context/LoadingContext";

const TicketSearchForm = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [email, setEmail] = useState("");
  const [foundTicket, setFoundTicket] = useState(null);
  const [error, setError] = useState("");

  const { isLoading, showLoading, hideLoading } = useLoading();

  const handleSearch = (e) => {
    e.preventDefault();
    showLoading("Mencari tiket Anda. Harap tunggu...");
    setError("");
    setFoundTicket(null);

    // --- SEARCHING LOGIC (SIMULATION) ---
    // Call API:
    // z.B. api.get(`/tickets/search?number=${ticketNumber}&email=${email}`)
    setTimeout(() => {
      // Simulation success
      if (ticketNumber === "SILADAN-123" && email === "user@mail.com") {
        setFoundTicket({
          id: "SILADAN-123",
          title: "Printer di Ruang A Rusak",
          type: "Pengaduan",
          status: "Sedang Diproses",
          updatedAt: "2025-10-25T10:30:00Z",
          history: [
            { status: "Diajukan", date: "2025-10-24T09:00:00Z" },
            { status: "Diverifikasi Seksi", date: "2025-10-24T11:00:00Z" },
            { status: "Sedang Diproses", date: "2025-10-25T10:30:00Z" },
          ],
        });
      } else {
        // Simulation failed
        setError(
          "Tiket tidak ditemukan. Periksa kembali nomor tiket dan email Anda."
        );
      }
      hideLoading();
    }, 1500);
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
          placeholder="Contoh: SILADAN-123"
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email yang Anda gunakan saat melapor"
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
        {error && <p className="text-center text-red-500">{error}</p>}
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
