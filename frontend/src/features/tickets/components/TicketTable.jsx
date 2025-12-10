import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const TicketTable = ({ tickets }) => {
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-lg shadow-lg bg-white dark:bg-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          {/* Header */}
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-600 dark:text-slate-300">
                No.Tiket
              </th>
              <th className="px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-600 dark:text-slate-300">
                Judul Tiket
              </th>
              <th className="px-4 py-3 text-center text-sm md:text-base font-semibold text-slate-600 dark:text-slate-300">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-600 dark:text-slate-300">
                Tanggal Tiket
              </th>
              <th className="px-4 py-3 text-left text-sm md:text-base font-semibold text-slate-600 dark:text-slate-300">
                Aksi
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono text-slate-700 dark:text-slate-300">
                    {ticket.id}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white truncate max-w-[300px]">
                    {ticket.title}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={ticket.status}
                      stage={ticket.stage}
                      isFullWidth
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {ticket.date}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/dashboard/detail-manage-ticket/${
                        ticket.dbId || ticket.id
                      }`}
                      state={{ ticketType: ticket.type }}
                      className="px-5 py-3 text-sm font-semibold text-[#053F5C] bg-[#F7AD19] rounded-md hover:bg-yellow-400 cursor-pointer"
                    >
                      Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-slate-500 dark:text-slate-400"
                >
                  Tidak ada tiket yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
