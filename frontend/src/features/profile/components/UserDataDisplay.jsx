import React from "react";
import { useAuth } from "../../../context/AuthContext";

// helper for data display
const DataRow = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400">
      {label}
    </dt>
    <dd className="mt-1 text-sm lg:text-base text-slate-900 dark:text-white sm:mt-0 sm:col-span-2">
      {value || "-"}
    </dd>
  </div>
);

const UserDataDisplay = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8.5">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
        Data Pengguna
      </h3>
      <dl className="divide-y divide-slate-200 dark:divide-slate-700">
        <DataRow label="Email" value={user.email} />
        <DataRow label="No. Telepon" value={user.phone} />
        <DataRow label="NIK" value={user.nik || user.nip} />
        <DataRow label="Alamat" value={user.address} />
      </dl>
    </div>
  );
};

export default UserDataDisplay;
