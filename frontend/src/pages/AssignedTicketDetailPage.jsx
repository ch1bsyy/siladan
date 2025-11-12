import React from "react";

const AssignedTicketDetailPage = () => {
  return (
    <div className="space-y-6 dark:text-white">
      <Link
        to="/dashboard/my-tasks"
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
      >
        <FiArrowLeft />
        <span>Kembali ke Daftar Tugas</span>
      </Link>
      <h1 className="text-3xl font-bold">Detail Tiket Teknisi:</h1>
      <p>
        Form untuk teknisi (Update Status, Catatan Kerja, Eskalasi) akan tampil
        di sini.
      </p>
    </div>
  );
};

export default AssignedTicketDetailPage;
