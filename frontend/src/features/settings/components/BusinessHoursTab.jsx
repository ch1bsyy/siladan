import React, { useState } from "react";
import { FiClock, FiSave, FiInfo } from "react-icons/fi";

const DAYS = [
  { id: "mon", label: "Senin", isWorkDay: true },
  { id: "tue", label: "Selasa", isWorkDay: true },
  { id: "wed", label: "Rabu", isWorkDay: true },
  { id: "thu", label: "Kamis", isWorkDay: true },
  { id: "fri", label: "Jumat", isWorkDay: true },
  { id: "sat", label: "Sabtu", isWorkDay: false },
  { id: "sun", label: "Minggu", isWorkDay: false },
];

const BusinessHoursTab = () => {
  // State for Demo
  const [schedule, setSchedule] = useState(
    DAYS.map((d) => ({
      ...d,
      start: "08:00",
      end: d.id === "fri" ? "17:30" : "17:00", // Example Friday pulang lama
    }))
  );

  const [breakTime, setBreakTime] = useState({
    enabled: true,
    start: "12:00",
    end: "13:00",
  });

  const handleToggleDay = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].isWorkDay = !newSchedule[index].isWorkDay;
    setSchedule(newSchedule);
  };

  const handleChangeTime = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex gap-3 items-start">
        <FiInfo className="text-blue-600 dark:text-blue-400 mt-0.5" size={28} />
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm md:text-base">
            Aturan SLA Standar
          </h4>
          <p className="text-xs md:text-sm text-blue-700 dark:text-blue-400 mt-1">
            SLA (Service Level Agreement) hanya akan berjalan (ticking) pada
            rentang jam yang Anda atur di bawah ini. Tiket yang masuk di luar
            jam kerja akan mulai dihitung pada jam kerja berikutnya.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto scrollbar-thin">
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-2 md:flex-row justify-center md:justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FiClock size={20} className="text-[#F7AD19]" /> Jadwal Mingguan
          </h3>
          <span className="text-xs font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-200">
            Zona Waktu: Asia/Jakarta (WIB)
          </span>
        </div>

        <div className="p-6 space-y-4">
          {schedule.map((day, idx) => (
            <div
              key={day.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0"
            >
              {/* Toggle & Label */}
              <div className="flex items-center gap-4 w-40">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={day.isWorkDay}
                    onChange={() => handleToggleDay(idx)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#053F5C]"></div>
                </label>
                <span
                  className={`font-medium ${
                    day.isWorkDay
                      ? "text-slate-800 dark:text-white"
                      : "text-slate-400"
                  }`}
                >
                  {day.label}
                </span>
              </div>

              {/* Time Inputs */}
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  disabled={!day.isWorkDay}
                  value={day.start}
                  onChange={(e) =>
                    handleChangeTime(idx, "start", e.target.value)
                  }
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
                <span className="text-slate-500 dark:text-slate-400">-</span>
                <input
                  type="time"
                  disabled={!day.isWorkDay}
                  value={day.end}
                  onChange={(e) => handleChangeTime(idx, "end", e.target.value)}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                />
              </div>

              {/* Status Badge */}
              <div className="w-24 text-right">
                {day.isWorkDay ? (
                  <span className="text-xs sm:text-base font-bold text-green-600 bg-green-100 dark:bg-green-900/20 px-3 py-1.5 rounded">
                    BUKA
                  </span>
                ) : (
                  <span className="text-xs sm:text-base font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded">
                    TUTUP
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Break Time Section */}
        <div className="bg-slate-50 dark:bg-slate-900/30 p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="breakTime"
              checked={breakTime.enabled}
              onChange={(e) =>
                setBreakTime({ ...breakTime, enabled: e.target.checked })
              }
              className="w-4 h-4 text-[#053F5C] rounded border-gray-300 focus:ring-[#053F5C]"
            />
            <label
              htmlFor="breakTime"
              className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 select-none"
            >
              Pause SLA saat Jam Istirahat?
            </label>
          </div>
          {breakTime.enabled && (
            <div className="flex items-center gap-3 ml-7 animate-fade-in-down">
              <input
                type="time"
                value={breakTime.start}
                onChange={(e) =>
                  setBreakTime({ ...breakTime, start: e.target.value })
                }
                className="p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white"
              />
              <span className="text-slate-400">-</span>
              <input
                type="time"
                value={breakTime.end}
                onChange={(e) =>
                  setBreakTime({ ...breakTime, end: e.target.value })
                }
                className="p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-white"
              />
              <span className="text-xs md:text-sm text-slate-500 ml-2">
                (SLA akan dibekukan di jam ini)
              </span>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button className="flex items-center min-h-11 min-w-11 gap-2 px-6 py-2 bg-[#053F5C] text-white font-bold rounded-lg hover:bg-[#075075] transition-colors shadow-md cursor-pointer">
            <FiSave className="hidden md:block" size={18} /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessHoursTab;
