import React from "react";
import { SlCalender } from "react-icons/sl";
import { FiMapPin } from "react-icons/fi";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const upcomingHolidays = [
  {
    id: 1,
    name: "Cuti Bersama Idul Fitri",
    date: "2025-04-01",
    type: "Full Day",
    status: "Nasional",
  },
  {
    id: 2,
    name: "Rapat Kerja Dinas",
    date: "2025-06-15",
    type: "Partial (08:00-12:00)",
    status: "Internal OPD",
  },
  {
    id: 3,
    name: "HUT Kemerdekaan RI",
    date: "2025-08-17",
    type: "Full Day",
    status: "Nasional",
  },
];

const UpcomingHolidaysTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingHolidays.map((h) => (
          <div
            key={h.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col"
          >
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-3 gap-2 md:gap-0">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                <SlCalender size={22} />
              </div>
              <span
                className={`text-xs md:text-sm uppercase font-bold px-2 py-1 rounded ${
                  h.type === "Full Day"
                    ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {h.type}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-1 text-base md:text-lg">
              {h.name}
            </h4>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              {format(new Date(h.date), "EEEE, dd MMMM yyyy", {
                locale: localeId,
              })}
            </p>
            <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-400">
              <FiMapPin size={16} /> {h.status}
            </div>
          </div>
        ))}
      </div>

      {upcomingHolidays.length === 0 && (
        <div className="text-center py-12 text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <p>Tidak ada jadwal libur dalam waktu dekat.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingHolidaysTab;
