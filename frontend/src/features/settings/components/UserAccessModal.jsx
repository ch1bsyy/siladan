import React, { useState, useEffect } from "react";
import { FiX, FiShield, FiSave, FiInfo } from "react-icons/fi";

// LIST PERMISSION
const PERMISSION_CATALOG = {
  helpdesk: [
    {
      id: "manage:ticket",
      label: "Verifikasi & Manajemen Tiket",
      desc: "Melihat, memverifikasi, dan menolak tiket masuk.",
    },
    {
      id: "assign:ticket",
      label: "Penugasan Tiket",
      desc: "Menentukan teknisi untuk tiket baru.",
    },
    {
      id: "handle:chat",
      label: "Layanan Chat",
      desc: "Mengakses menu percakapan dengan pelapor.",
    },
  ],
  teknisi: [
    {
      id: "process:ticket",
      label: "Proses & Kerjakan Tiket",
      desc: "Update status, worklog, dan penyelesaian tiket.",
      default: true,
    },
    {
      id: "create:article",
      label: "Buat Artikel Solusi",
      desc: "Menulis draft artikel knowledge base.",
      default: true,
    },
  ],
  admin: [
    {
      id: "approve:article",
      label: "Review & Publish Artikel",
      desc: "Menyetujui artikel teknis untuk publikasi.",
    },
    {
      id: "view:report",
      label: "Akses Laporan",
      desc: "Melihat statistik kinerja.",
    },
  ],
};

const UserAccessModal = ({ isOpen, onClose, user, onSave }) => {
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [isActive, setIsActive] = useState(true);

  // Load data when modal open
  useEffect(() => {
    if (user) {
      // Convert format permission from [{action, subject}] to string "action:subject"
      const userPermsString = user.permissions.map(
        (p) => `${p.action}:${p.subject}`
      );
      setSelectedPerms(userPermsString);
      setIsActive(user.isActive ?? true);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleCheckboxChange = (permId) => {
    if (selectedPerms.includes(permId)) {
      setSelectedPerms(selectedPerms.filter((id) => id !== permId));
    } else {
      setSelectedPerms([...selectedPerms, permId]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Back to format object same with backend structure
    const formattedPermissions = selectedPerms.map((p) => {
      const [action, subject] = p.split(":");
      return { action, subject };
    });

    onSave({
      ...user,
      isActive,
      permissions: formattedPermissions,
    });
  };

  // Helper render checkbox group
  const renderPermissionGroup = (title, items, roleContext) => (
    <div className="mb-4">
      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1">
        {title}
      </h4>
      <div className="space-y-3">
        {items.map((perm) => {
          const isDefault = user.role.name === roleContext && perm.default;
          return (
            <label
              key={perm.id}
              className={`flex items-start gap-3 p-2 rounded-lg border ${
                selectedPerms.includes(perm.id) || isDefault
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPerms.includes(perm.id) || isDefault}
                onChange={() => !isDefault && handleCheckboxChange(perm.id)}
                disabled={isDefault} // If default role can uncheck
                className="mt-1 w-4 h-4 text-[#053F5C] rounded focus:ring-[#053F5C]"
              />
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">
                    {perm.label}
                  </span>
                  {isDefault && (
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-1.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-400">
                  {perm.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FiShield className="text-[#F7AD19]" size={20} /> Kelola Akses
              Pengguna
            </h3>
            <p className="text-sm text-slate-500">
              Mengatur kewenangan untuk:{" "}
              <span className="font-bold text-[#053F5C] dark:text-blue-400">
                {user.name}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex justify-center items-center min-h-11 min-w-11 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {/* Status Switch */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl mb-6">
            <div>
              <span className="block text-sm md:text-base font-bold text-slate-800 dark:text-white">
                Status Akun
              </span>
              <span className="text-xs md:text-sm text-slate-500">
                Non-aktifkan akun jika staf cuti panjang atau keluar.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg flex gap-3 items-start mb-6 text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
            <FiInfo className="flex-shrink-0 mt-0.5" size={18} />
            <p>
              Anda dapat memberikan hak akses tambahan di luar role utama
              pengguna. Izin default role tidak dapat dihapus.
            </p>
          </div>

          {/* Permission Groups */}
          <form id="accessForm" onSubmit={handleSave}>
            {renderPermissionGroup(
              "🛡️ Kewenangan Helpdesk",
              PERMISSION_CATALOG.helpdesk,
              "helpdesk"
            )}
            {renderPermissionGroup(
              "🛠️ Kewenangan Teknisi",
              PERMISSION_CATALOG.teknisi,
              "teknisi"
            )}
            {renderPermissionGroup(
              "⚙️ Kewenangan Admin/Manajerial",
              PERMISSION_CATALOG.admin,
              "admin_opd"
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 flex items-center justify-center min-h-11 min-w-11 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 font-medium text-sm md:text-base transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            form="accessForm"
            type="submit"
            className="px-6 py-2 flex items-center justify-center min-h-11 min-w-11 rounded-lg bg-[#053F5C] text-white font-bold text-sm md:text-base hover:bg-[#075075] transition-transform active:scale-95 shadow-md gap-2 cursor-pointer"
          >
            <FiSave size={18} /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccessModal;
