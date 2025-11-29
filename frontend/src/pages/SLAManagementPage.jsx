import React, { useState } from "react";
import { FiEdit2, FiInfo } from "react-icons/fi";
import { TfiTimer } from "react-icons/tfi";
import EditSLAModal from "../features/settings/components/EditSLAModal";
import toast from "react-hot-toast";

// Mock Initial Data
const initialSLA = [
  {
    id: 1,
    priority: "Critical",
    mttr: 4,
    description: "Sistem mati total, dampak masif ke seluruh OPD.",
  },
  {
    id: 2,
    priority: "High",
    mttr: 8,
    description: "Fitur utama tidak berfungsi, dampak ke satu unit kerja.",
  },
  {
    id: 3,
    priority: "Medium",
    mttr: 24,
    description: "Gangguan pada perangkat individu atau error minor.",
  },
  {
    id: 4,
    priority: "Low",
    mttr: 40,
    description: "Permintaan informasi atau kosmetik aplikasi.",
  },
];

const SLAManagementPage = () => {
  const [slaList, setSlaList] = useState(initialSLA);
  const [selectedSLA, setSelectedSLA] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper for conversion hours to Day Works (8 Hours)
  const formatDuration = (hours) => {
    const days = hours / 8;
    return days < 1
      ? `${hours} Jam Kerja`
      : `${days} Hari Kerja (${hours} Jam)`;
  };

  const handleEditClick = (sla) => {
    setSelectedSLA(sla);
    setIsModalOpen(true);
  };

  const handleSaveSLA = (updatedSLA) => {
    // Logic API Update to Database here
    const newList = slaList.map((item) =>
      item.id === updatedSLA.id ? updatedSLA : item
    );
    setSlaList(newList);
    setIsModalOpen(false);
    toast.success(`SLA Prioritas ${updatedSLA.priority} berhasil diperbarui`);
  };

  // Color Badge Priority
  const getPriorityBadge = (prio) => {
    const classes = {
      Critical:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
      High: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
      Medium:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
      Low: "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300",
    };
    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold border ${classes[prio]}`}
      >
        {prio}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <TfiTimer className="text-[#053F5C] dark:text-[#429EBD]" size={32} />
          Pengaturan Target Penyelesaian (SLA)
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Durasi SLA dihitung berdasarkan{" "}
          <strong>Jam Kerja Operasional OPD</strong> (Senin-Jumat, 08:00-16:00).
          Penghitungan waktu akan otomatis <strong>dijeda (paused)</strong> saat
          hari libur atau di luar jam kerja.
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Level Prioritas
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Target Waktu (MTTR)
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Keterangan Estimasi
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {slaList.map((sla) => (
                <tr
                  key={sla.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                >
                  <td className="px-6 py-4 align-top">
                    {getPriorityBadge(sla.priority)}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-baseline gap-2 font-mono font-bold text-[#053F5C] dark:text-white text-lg">
                      {sla.mttr}{" "}
                      <span className="text-xs md:text-[13px] font-sans font-normal text-slate-500 mt-1">
                        Jam Kerja
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">
                      {formatDuration(sla.mttr)}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {sla.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center align-top pt-6">
                    <button
                      onClick={() => handleEditClick(sla)}
                      className="inline-flex min-h-11 min-w-11 items-center gap-2 px-5 py-2 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-600 hover:bg-[#F7AD19] hover:text-[#053F5C] hover:border-[#F7AD19] text-slate-600 dark:text-slate-300 rounded-lg transition-all font-medium text-sm md:text-base shadow-sm active:scale-95 cursor-pointer"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400">
          <FiInfo size={18} className="flex-shrink-0" />
          <span>
            Catatan: Perubahan SLA hanya akan berlaku untuk{" "}
            <strong>tiket baru</strong> yang dibuat setelah penyimpanan. Tiket
            lama tetap menggunakan aturan SLA sebelumnya.
          </span>
        </div>
      </div>

      {/* MODAL EDIT */}
      <EditSLAModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slaData={selectedSLA}
        onSave={handleSaveSLA}
      />
    </div>
  );
};

export default SLAManagementPage;
