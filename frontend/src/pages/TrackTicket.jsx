import React from "react";
import { useAuth } from "../context/AuthContext";
import TicketSearchForm from "../features/tracking/components/TicketSearchForm";
import MyTicketList from "../features/tracking/components/MyTicketList";

const TrackTicket = () => {
  const { isAuthenticated, user } = useAuth();
  const isPegawai = isAuthenticated && user?.role?.name === "pegawai_opd";

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 dark:text-white">
        {/* Title Section */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#053F5C] dark:text-white">
            Lacak Tiket Anda
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {isPegawai
              ? "Lihat riwayat pengaduan dan permintaan layanan Anda di bawah ini."
              : "Masukkan nomor tiket dan email Anda untuk melihat status tiket terbaru."}
          </p>
        </div>

        {/* Content */}
        {isPegawai ? <MyTicketList /> : <TicketSearchForm />}
      </div>
    </div>
  );
};

export default TrackTicket;
