import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import UserAccessModal from "../features/settings/components/UserAccessModal";

// MOCK DATA USERS
const initialUsers = [
  {
    id: 2,
    name: "Ani Teknisi",
    email: "teknisi@siladan.go.id",
    role: { name: "teknisi", label: "Teknisi" },
    isActive: true,
    permissions: [
      { action: "read", subject: "dashboard" },
      { action: "process", subject: "ticket" },
      { action: "create", subject: "article" },
    ],
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi@siladan.go.id",
    role: { name: "teknisi", label: "Teknisi" },
    isActive: true,
    permissions: [
      { action: "read", subject: "dashboard" },
      { action: "process", subject: "ticket" },
      { action: "create", subject: "article" },
      { action: "manage", subject: "ticket" }, // Extra
      { action: "assign", subject: "ticket" }, // Extra
    ],
  },
  {
    id: 4,
    name: "Chichi Helpdesk",
    email: "helpdesk@siladan.go.id",
    role: { name: "helpdesk", label: "Helpdesk" },
    isActive: false, // Cuti
    permissions: [
      { action: "read", subject: "dashboard" },
      { action: "create", subject: "ticket" },
      { action: "manage", subject: "ticket" },
      { action: "assign", subject: "ticket" },
      { action: "handle", subject: "chat" },
    ],
  },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. Filter by Search
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      // 2. Filter by Role
      const matchRole = roleFilter === "all" || u.role.name === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (updatedUser) => {
    // Logic Update ke API/Backend
    const newUsers = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(newUsers);
    setIsModalOpen(false);
    toast.success(`Hak akses ${updatedUser.name} berhasil diperbarui.`);
  };

  // Helper untuk for view extra permissions on table
  const getExtraPermissionsLabel = (user) => {
    const defaultPermsCount = user.role.name === "teknisi" ? 3 : 5;
    const currentCount = user.permissions.length;
    const diff = currentCount - defaultPermsCount;

    if (diff > 0) {
      return (
        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
          +{diff} Akses Tambahan
        </span>
      );
    }
    return (
      <span className="text-xs text-slate-500 dark:text-slate-400">-</span>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Manajemen Pengguna (RBAC)
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Kelola hak akses dan peran staf IT di OPD Anda.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama atau email staf..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#053F5C] outline-none dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48 relative">
          <FiFilter
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />
          <select
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#053F5C] outline-none dark:text-white appearance-none cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Semua Role</option>
            <option value="teknisi">Teknisi</option>
            <option value="helpdesk">Helpdesk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Nama User
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Role Utama
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Hak Akses Tambahan
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-base text-slate-800 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs md:text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold border flex items-center gap-2 w-fit ${
                        user.role.name === "teknisi"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}
                    >
                      <FiBriefcase size={15} /> {user.role.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getExtraPermissionsLabel(user)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded border border-green-200">
                        <FiCheckCircle size={16} /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs md:text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded border border-red-200">
                        <FiXCircle size={16} /> Non-Aktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center flex items-center justify-center">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-sm md:text-base min-h-11 min-w-11 font-medium text-[#053F5C] hover:text-[#916610] dark:text-blue-400 dark:hover:text-yellow-400 underline decoration-dotted underline-offset-4 transition-colors cursor-pointer"
                    >
                      Edit Akses
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic"
                  >
                    Tidak ada pengguna yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <UserAccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagementPage;
