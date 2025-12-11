import React, { useState, useEffect } from "react";
import { FiEdit2, FiInfo, FiLock } from "react-icons/fi";
import EditSLAModal from "../features/settings/components/EditSLAModal";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import * as slaService from "../features/settings/services/slaService";

const SLAManagementPage = () => {
  const [slaList, setSlaList] = useState([]);
  const [selectedSLA, setSelectedSLA] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchSLAData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSLAData = async () => {
    try {
      showLoading("Memuat data SLA...");
      const opdId = user?.opd_id || user?.opd?.id;

      const response = await slaService.getSLAConfig(opdId);

      if (response.success && Array.isArray(response.data)) {
        const mappedData = response.data.map((item) => ({
          id: item.id,
          priority: item.priority,
          mttr: item.resolution_time,
          description: item.description || "",
          is_active: item.is_active,
        }));

        const priorityOrder = ["major", "high", "medium", "low"];
        mappedData.sort(
          (a, b) =>
            priorityOrder.indexOf(a.priority.toLowerCase()) -
            priorityOrder.indexOf(b.priority.toLowerCase())
        );

        setSlaList(mappedData);
      }
    } catch (error) {
      console.error("Gagal mengambil data SLA:", error);
      toast.error("Gagal memuat konfigurasi SLA.");
    } finally {
      hideLoading();
    }
  };

  const handleEditClick = (sla) => {
    if (sla.priority.toLowerCase() === "major") {
      toast.error("Prioritas Major tidak dapat diubah.");
      return;
    }
    setSelectedSLA(sla);
    setIsModalOpen(true);
  };

  const handleSaveSLA = async (updatedSLA) => {
    const newList = slaList.map((item) =>
      item.id === updatedSLA.id ? updatedSLA : item
    );
    setSlaList(newList);
    setIsModalOpen(false);

    const opdId = user?.opd_id || user?.opd?.id || 1;

    const configsPayload = newList.map((item) => ({
      id: item.id,
      priority: item.priority,
      resolution_time: parseInt(item.mttr) || 0,
      description: item.description,
    }));

    const payload = {
      opd_id: opdId,
      configs: configsPayload,
    };

    try {
      showLoading("Menyimpan perubahan...");
      await slaService.upsertSLAConfig(payload);
      toast.success("Konfigurasi SLA berhasil disimpan");

      // Opsional
      fetchSLAData();
    } catch (error) {
      console.error("Gagal simpan SLA:", error);

      const errMsg =
        error.response?.data?.error || "Gagal menyimpan ke server.";
      toast.error(errMsg);
      fetchSLAData();
    } finally {
      hideLoading();
    }
  };

  // Helper formatter
  const formatDuration = (hours) => {
    const days = hours / 8;
    return days < 1
      ? `${hours} Jam Kerja`
      : `${days} Hari Kerja (${hours} Jam)`;
  };

  // Color Badge Priority
  const getPriorityBadge = (prio) => {
    const p = prio.toLowerCase();
    const classes = {
      major:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
      high: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
      medium:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
      low: "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300",
    };

    const label = prio.charAt(0).toUpperCase() + prio.slice(1);

    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold border ${
          classes[p] || classes["low"]
        }`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Pengaturan Target Penyelesaian (SLA)
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Atur target waktu (MTTR) untuk setiap prioritas tiket. <br />
          <span className="text-sm text-purple-600 dark:text-purple-400 italic">
            *Prioritas 'Major' bersifat global dan berlaku saat terjadi insiden
            massal.
          </span>
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
              {slaList.length > 0 ? (
                slaList.map((sla) => {
                  const isMajor = sla.priority.toLowerCase() === "major";

                  return (
                    <tr
                      key={sla.id}
                      className={`transition-colors group ${
                        isMajor
                          ? "bg-red-50/50 dark:bg-red-900/10"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                      }`}
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
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed italic">
                          {sla.description || "Belum ada deskripsi"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center align-top pt-6">
                        {isMajor ? (
                          <div
                            className="flex flex-col items-center justify-center text-slate-400 gap-1"
                            title="Locked by System"
                          >
                            <FiLock size={18} />
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                              Locked
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditClick(sla)}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-600 hover:bg-[#F7AD19] hover:text-[#053F5C] hover:border-[#F7AD19] text-slate-600 dark:text-slate-300 rounded-lg transition-all font-medium text-sm shadow-sm cursor-pointer"
                          >
                            <FiEdit2 size={16} /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Tidak ada data SLA ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
