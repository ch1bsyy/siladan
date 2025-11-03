import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

// Mock Data
const mockTickets = [
  {
    id: "SILADAN-124",
    title: "Printer tidak terdeteksi",
    type: "Pengaduan",
    status: "Pending",
  },
  {
    id: "REQ-003",
    title: "Permintaan Peminjaman Proyektor",
    type: "Permintaan",
    status: "Pending",
  },
  {
    id: "SILADAN-125",
    title: "WiFi Lambat di Aula",
    type: "Pengaduan",
    status: "Pending",
  },
  {
    id: "REQ-004",
    title: "Permintaan Instalasi Aplikasi X",
    type: "Permintaan",
    status: "Pending",
  },
  {
    id: "SILADAN-126",
    title: "Aplikasi A tidak bisa diakses",
    type: "Pengaduan",
    status: "Pending",
  },
];

const TicketListWidget = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Tiket Terbaru (Perlu Verifikasi)
        </h3>
        <Link
          to="/dashboard/tickets"
          className="text-sm flex items-center font-medium text-[#429EBD] hover:text-[#053F5C] dark:hover:text-[#9FE7F5] hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <ul className="space-y-3">
        {mockTickets.map((ticket) => (
          <li key={ticket.id}>
            <Link
              to={`/dashboard/track-ticket/${ticket.id}`}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  {ticket.title}
                </p>
                <span
                  className={`text-xs font-medium ${
                    ticket.type === "Pengaduan"
                      ? "text-[#F7AD19]"
                      : "text-[#429EBD]"
                  }`}
                >
                  {ticket.id} ({ticket.type})
                </span>
              </div>
              <FiArrowRight className="text-slate-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketListWidget;
