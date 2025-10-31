import React from "react";
import { useAuth } from "../context/AuthContext";

// Contoh komponen yang hanya bisa dilihat oleh role tertentu
const TicketList = () => (
  <div className="p-4 bg-gray-100 rounded-md">Daftar Semua Tiket</div>
);
const AssignTicketButton = () => (
  <button className="px-4 py-2 bg-yellow-500 text-white rounded-md">
    Tugaskan Teknisi
  </button>
);
const GenerateReportButton = () => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
    Generate Laporan
  </button>
);

const DashboardPage = () => {
  const { user, hasPermission } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Selamat Datang di Dashboard, {user?.name}
      </h1>
      <p className="text-gray-600">
        Anda login sebagai:{" "}
        <span className="font-semibold">{user?.role?.name}</span>
      </p>
      <h1 className="text-2xl font-bold">
        Selamat Datang di Dashboard, {user?.name}
      </h1>
      <p className="text-gray-600">
        Anda login sebagai:{" "}
        <span className="font-semibold">{user?.role?.name}</span>
      </p>
      <h1 className="text-2xl font-bold">
        Selamat Datang di Dashboard, {user?.name}
      </h1>
      <p className="text-gray-600">
        Anda login sebagai:{" "}
        <span className="font-semibold">{user?.role?.name}</span>
      </p>
      <h1 className="text-2xl font-bold">
        Selamat Datang di Dashboard, {user?.name}
      </h1>
      <p className="text-gray-600">
        Anda login sebagai:{" "}
        <span className="font-semibold">{user?.role?.name}</span>
      </p>

      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Permissions Anda:</h2>
        <ul className="list-disc list-inside text-sm">
          {user?.permissions?.map((p, index) => (
            <li key={index}>
              <code>
                {p.action}:{p.subject}
              </code>
            </li>
          ))}
          {user?.permissions?.length === 0 && (
            <li>Tidak ada permission dashboard.</li>
          )}
        </ul>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="text-lg font-semibold mb-2">
          Komponen yang Dapat Anda Akses:
        </h2>

        {/* Teknisi & Seksi bisa melihat daftar tiket */}
        {hasPermission(["read", "ticket"]) && <TicketList />}

        <div className="flex gap-3">
          {/* Hanya Seksi yang bisa menugaskan tiket */}
          {hasPermission(["assign", "ticket"]) && <AssignTicketButton />}

          {/* Hanya Admin Kota yang bisa generate laporan (karena punya 'manage:all') */}
          {hasPermission(["generate", "report"]) && <GenerateReportButton />}
        </div>

        {/* Jika user tidak punya izin apa pun, tampilkan pesan */}
        {!hasPermission(["read", "ticket"]) &&
          !hasPermission(["assign", "ticket"]) &&
          !hasPermission(["generate", "report"]) && (
            <p className="text-gray-500">
              Tidak ada komponen khusus yang bisa Anda akses.
            </p>
          )}
      </div>
    </div>
  );
};

export default DashboardPage;
