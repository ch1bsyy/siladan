import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

// Mock Data Holidays
const initialHolidays = [
  {
    id: 1,
    name: "Tahun Baru Masehi",
    start: "2025-01-01",
    end: "2025-01-01",
    type: "Full Day",
    recurring: true,
  },
  {
    id: 2,
    name: "Idul Fitri 1446 H",
    start: "2025-03-31",
    end: "2025-04-01",
    type: "Full Day",
    recurring: false,
  },
  {
    id: 3,
    name: "Rapat Kerja Tahunan",
    start: "2025-06-15",
    end: "2025-06-15",
    type: "Partial (08:00-12:00)",
    recurring: false,
  },
];

const HolidaysTab = () => {
  const [holidays, setHolidays] = useState(initialHolidays);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Form
  const [newHoliday, setNewHoliday] = useState({
    name: "",
    start: "",
    end: "",
    type: "Full Day",
    recurring: false,
  });

  const handleDelete = (id) => {
    if (window.confirm("Hapus hari libur ini?")) {
      setHolidays(holidays.filter((h) => h.id !== id));
    }
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      ...newHoliday,
      end: newHoliday.end || newHoliday.start, // If end Empty, Match With Start
    };
    setHolidays([...holidays, newItem]);
    setIsModalOpen(false);
    setNewHoliday({
      name: "",
      start: "",
      end: "",
      type: "Full Day",
      recurring: false,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Daftar Pengecualian & Libur
          </h3>
          <p className="text-sm md:text-base text-slate-500">
            Tanggal di bawah ini akan dianggap Non-Working Day (SLA Pause).
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex min-h-11 min-w-11 items-center gap-2 px-4 py-2 bg-[#F7AD19] text-[#053F5C] font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-sm cursor-pointer"
        >
          <FiPlus size={18} /> Tambah Libur
        </button>
      </div>

      {/* Table List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto scrollbar-thin">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium text-sm md:text-base    ">
            <tr>
              <th className="px-6 py-4">Nama Kegiatan</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4 text-center">Berulang?</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm text-slate-700 dark:text-slate-300">
            {holidays.map((h) => (
              <tr
                key={h.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
              >
                <td className="px-6 py-4 font-medium">{h.name}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <SlCalender
                    size={14}
                    className="text-slate-500 dark:text-slate-400"
                  />
                  {h.start === h.end
                    ? format(new Date(h.start), "dd MMM yyyy", {
                        locale: localeId,
                      })
                    : `${format(new Date(h.start), "dd MMM")} - ${format(
                        new Date(h.end),
                        "dd MMM yyyy",
                        { locale: localeId }
                      )}`}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs md:text-sm font-bold ${
                      h.type === "Full Day"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/20"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900/20"
                    }`}
                  >
                    {h.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {h.recurring ? (
                    <span className="text-green-600 font-bold text-xs md:text-sm">
                      Ya
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs md:text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="flex items-center justify-center text-slate-400 min-h-11 min-w-11 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {holidays.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-400 italic"
                >
                  Belum ada data libur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add Holiday */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md animate-bounce-in">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Tambah Hari Libur
            </h3>
            <form onSubmit={handleAddHoliday} className="space-y-4">
              <div>
                <label className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Kegiatan / Libur
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-[#053F5C] outline-none"
                  placeholder="Contoh: Cuti Bersama"
                  value={newHoliday.name}
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tgl Mulai
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white"
                    value={newHoliday.start}
                    onChange={(e) =>
                      setNewHoliday({ ...newHoliday, start: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm  md:text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tgl Selesai
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 dark:text-white"
                    value={newHoliday.end}
                    onChange={(e) =>
                      setNewHoliday({ ...newHoliday, end: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newHoliday.recurring}
                  onChange={(e) =>
                    setNewHoliday({
                      ...newHoliday,
                      recurring: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="recurring"
                  className="text-sm text-slate-700 dark:text-slate-300"
                >
                  Ulangi setiap tahun?
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 min-w-11 min-h-11 text-slate-700 hover:bg-slate-200 rounded cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 min-w-11 min-h-11 bg-[#053F5C] text-white rounded font-medium hover:bg-[#075075] cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidaysTab;
