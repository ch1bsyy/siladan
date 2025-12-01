import React, { useState } from "react";
import {
  FiChevronRight,
  FiChevronDown,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSettings,
  FiLayers,
  FiMonitor,
  FiCpu,
  FiArrowRight,
  FiUser,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Input from "../components/Input";
import FormSelect from "../components/FormSelect";
import FormTextArea from "../components/FormTextArea";

// Mock Initial Data (Hierarky 3 Level)
const initialCatalog = [
  {
    id: "CAT-001",
    name: "Perangkat Keras (Hardware)",
    icon: "hardware",
    isReadOnly: true, // Level 1 Read Only
    children: [
      {
        id: "ACT-001",
        name: "Instalasi & Pemasangan",
        needAsset: true, // Need Choose Aset
        workflow: "internal",
        children: [
          {
            id: "SRV-001",
            name: "Printer Baru",
            desc: "Pemasangan printer desktop standar.",
          },
          {
            id: "SRV-002",
            name: "Scanner Unit",
            desc: "Instalasi driver dan unit scanner.",
          },
        ],
      },
      {
        id: "ACT-002",
        name: "Perbaikan Fisik",
        needAsset: true,
        workflow: "internal",
        children: [
          {
            id: "SRV-003",
            name: "Ganti Keyboard Laptop",
            desc: "Penggantian komponen keyboard rusak.",
          },
        ],
      },
    ],
  },
  {
    id: "CAT-002",
    name: "Perangkat Lunak (Software)",
    icon: "software",
    isReadOnly: true,
    children: [
      {
        id: "ACT-003",
        name: "Instalasi Aplikasi",
        needAsset: true,
        workflow: "internal",
        children: [
          {
            id: "SRV-004",
            name: "Microsoft Office 2021",
            desc: "Lisensi Volume Dinas.",
          },
          {
            id: "SRV-005",
            name: "Antivirus Corporate",
            desc: "Symantec Endpoint Protection.",
          },
        ],
      },
    ],
  },
  {
    id: "CAT-003",
    name: "Layanan Akun (User Account)",
    icon: "account",
    isReadOnly: true,
    children: [
      {
        id: "ACT-004",
        name: "Akses & Password",
        needAsset: false, // No need Asset
        workflow: "internal",
        children: [
          {
            id: "SRV-006",
            name: "Reset Password Email",
            desc: "Reset password email @opd.go.id",
          },
        ],
      },
    ],
  },
];

const ServiceCatalogPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [catalog, setCatalog] = useState(initialCatalog);
  // State for expand/collapse accordion
  const [expanded, setExpanded] = useState({});
  // State Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'add-level-2', 'edit-level-2', 'add-level-3', etc.
  const [currentParentId, setCurrentParentId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // --- HANDLERS ---
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenModal = (type, parentId = null, item = null) => {
    setModalType(type);
    setCurrentParentId(parentId);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = (formData) => {
    // Logic Update State (Backend)
    // Di real app this would POST/PUT into API
    console.log("Saving Data:", formData);
    toast.success("Data berhasil disimpan!");
    setModalOpen(false);
  };

  // --- ICONS MAPPING ---
  const getIcon = (type) => {
    switch (type) {
      case "hardware":
        return <FiMonitor size={20} className="text-blue-500" />;
      case "software":
        return <FiCpu size={20} className="text-purple-500" />;
      case "account":
        return <FiUser size={20} className="text-orange-500" />;
      default:
        return <FiLayers size={20} />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Manajemen Katalog Layanan
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Atur struktur layanan yang tersedia untuk pegawai. Kategori Level 1
            disinkronisasi dari Master Aset.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT (ACCORDION LIST) */}
      <div className="space-y-4">
        {catalog.map((level1) => (
          <div
            key={level1.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto shadow-sm"
          >
            {/* LEVEL 1 HEADER (READ ONLY) */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex flex-col md:flex-row items-center md:justify-between gap-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                {getIcon(level1.icon)}
                <h3 className="text-lg text-center font-bold text-slate-800 dark:text-white">
                  {level1.name}
                </h3>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">
                  Level 1 (Master)
                </span>
              </div>
              <button
                onClick={() => handleOpenModal("add-level-2", level1.id)}
                className="flex min-h-11 min-w-11 items-center justify-center gap-2 text-sm md:text-base font-bold text-[#053F5C] dark:text-white dark:hover:bg-[#053F5C] hover:bg-blue-200 px-3 py-1.5 rounded transition-colors cursor-pointer"
              >
                <FiPlus size={18} /> Tambah Tipe Tindakan
              </button>
            </div>

            {/* LEVEL 2 LIST */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {level1.children.length === 0 && (
                <div className="p-8 text-center text-slate-400 italic text-sm">
                  Belum ada tipe tindakan. Silakan tambah baru.
                </div>
              )}

              {level1.children.map((level2) => (
                <div key={level2.id} className="group">
                  {/* LEVEL 2 ROW */}
                  <div className="p-4 pl-6 flex flex-col md:flex-row items-center gap-3 md:gap-0 md:justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => toggleExpand(level2.id)}
                    >
                      <button className="text-slate-400 hover:text-[#053F5C] dark:hover:text-white">
                        {expanded[level2.id] ? (
                          <FiChevronDown size={20} />
                        ) : (
                          <FiChevronRight size={20} />
                        )}
                      </button>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          {level2.name}
                          {level2.workflow !== "internal" && (
                            <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                              Mitra {level2.workflow}
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1 md:mt-0 text-center">
                          {level2.needAsset ? (
                            <span className="flex items-center text-orange-700 bg-orange-50 px-1.5 py-1 rounded">
                              Butuh Aset
                            </span>
                          ) : (
                            <span className="text-green-600 bg-green-100 px-1.5 py-1 rounded">
                              Non-Aset
                            </span>
                          )}
                          <span className="mx-1">•</span>
                          Level 2
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          handleOpenModal("add-level-3", level2.id)
                        }
                        className="p-1.5 flex items-center justify-center min-h-11 min-w-11 cursor-pointer text-blue-600 dark:text-blue-400 dark:hover:text-blue-600 hover:bg-blue-100 rounded"
                        title="Tambah Detail Layanan"
                      >
                        <FiPlus size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleOpenModal("edit-level-2", null, level2)
                        }
                        className="p-1.5 flex items-center justify-center min-h-11 min-w-11 cursor-pointer text-slate-600 dark:text-slate-400 dark:hover:text-slate-600 hover:bg-slate-200 rounded"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button className="p-1.5 flex items-center justify-center min-h-11 min-w-11 cursor-pointer text-red-600 hover:bg-red-100 rounded">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* LEVEL 3 LIST (NESTED) */}
                  {expanded[level2.id] && (
                    <div className="bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 pl-14 pr-4 py-2">
                      {level2.children.length === 0 && (
                        <div className="py-3 text-xs text-slate-400 italic">
                          Belum ada detail layanan.
                        </div>
                      )}
                      {level2.children.map((level3) => (
                        <div
                          key={level3.id}
                          className="flex flex-col md:flex-row gap-1 md:gap-0 items-center justify-start md:justify-between py-3 border-b border-dashed border-slate-200 dark:border-slate-700 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hidden md:block"></div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {level3.name}
                              </p>
                              <p className="text-xs md:text-[13px] text-slate-500 dark:text-slate-400">
                                {level3.desc}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleOpenModal("edit-level-3", null, level3)
                              }
                              className="text-sm md:text-[15px] min-h-11 min-w-11 flex items-center justify-center cursor-pointer text-blue-600 dark:text-blue-300 hover:underline"
                            >
                              Edit
                            </button>
                            <button className="text-sm md:text-[15px] min-h-11 min-w-11 flex items-center justify-center cursor-pointer text-red-500 dark:text-red-400 hover:underline">
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* UNIVERSAL MODAL FORM */}
      {modalOpen && (
        <CatalogModal
          type={modalType}
          parentId={currentParentId}
          data={editingItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

/* COMPONENT: CATALOG MODAL */
// eslint-disable-next-line no-unused-vars
const CatalogModal = ({ type, parentId, data, onClose, onSave }) => {
  const isLevel2 = type.includes("level-2");
  const isEdit = type.includes("edit");

  const [formData, setFormData] = useState({
    name: data?.name || "",
    desc: data?.desc || "",
    needAsset: data?.needAsset ?? true,
    workflow: data?.workflow || "internal",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-bounce-in">
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white">
            {isEdit ? "Edit" : "Tambah"}{" "}
            {isLevel2 ? "Tipe Tindakan (Level 2)" : "Detail Layanan (Level 3)"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center min-w-11 min-h-11"
          >
            <FiArrowRight size={20} className="rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label={isLevel2 ? "Nama Tipe Tindakan" : "Nama Layanan Spesifik"}
            placeholder={
              isLevel2
                ? "Contoh: Instalasi, Perbaikan"
                : "Contoh: MS Office 2021"
            }
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          {/* LEVEL 2: CONFIG */}
          {isLevel2 && (
            <div className="space-y-4 mb-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-3 flex items-center gap-2">
                  <FiSettings size={14} /> Konfigurasi Dasar
                </h4>
                <ToggleSwitch
                  label="Butuh Pemilihan Aset?"
                  checked={formData.needAsset}
                  onChange={(e) =>
                    setFormData({ ...formData, needAsset: e.target.checked })
                  }
                />
                <p className="text-xs md:text-[13px] text-slate-500 dark:text-slate-400 mb-3 -mt-2">
                  Jika aktif, user wajib memilih aset mereka saat membuat tiket
                  ini.
                </p>

                <FormSelect
                  label="Integrasi Workflow"
                  value={formData.workflow}
                  onChange={(e) =>
                    setFormData({ ...formData, workflow: e.target.value })
                  }
                >
                  <option value="internal">
                    Internal OPD (Aplikasi SILADAN)
                  </option>
                  <option value="change">
                    Butuh Perubahan (Aplikasi SAKTI)
                  </option>
                </FormSelect>
              </div>
            </div>
          )}

          {/* LEVEL 3: DESCRIPTION */}
          {!isLevel2 && (
            <div>
              <div className="w-full mb-4">
                <FormTextArea
                  label="Template Deskripsi / Info"
                  placeholder="Info tambahan untuk user..."
                  rows={3}
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="override"
                  className="rounded text-[#053F5C] focus:ring-[#053F5C]"
                />
                <label
                  htmlFor="override"
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  Override workflow induk?
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 flex items-center justify-center min-h-11 min-w-11 cursor-pointer text-slate-600 hover:bg-slate-200 rounded-lg font-medium text-sm md:text-base transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 flex items-center justify-center min-h-11 min-w-11 cursor-pointer bg-[#053F5C] text-white rounded-lg font-bold text-sm md:text-base hover:bg-[#075075] transition-colors shadow-md"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Toogle Components
const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#053F5C]"></div>
    </label>
  </div>
);

export default ServiceCatalogPage;
