import React from "react";
import { FiLayout, FiAlertOctagon, FiServer, FiActivity } from "react-icons/fi";
import StatCard from "./StatCard";
import WarRoomStatusWidget from "./WarRoomStatusWidget";
import LiveTicketFeed from "./LiveTicketFeed";
import TopOPDWidget from "./TopOPDWidget";

const AdminKotaDashboard = () => {
  return (
    <div className="space-y-6 dark:text-white animate-fade-in pb-10">
      {/* --- SECTION 1: WAR ROOM STATUS (FULL WIDTH) --- */}
      <WarRoomStatusWidget />

      {/* --- SECTION 2: HEALTH CHECK KOTA (KPI) --- */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-[#053F5C] dark:text-[#9FE7F5] mb-4">
          <FiActivity size={24} /> Health Check Kota
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tiket Masuk"
            value="145"
            icon={FiLayout}
            colorClass="bg-blue-600"
          />
          <StatCard
            title="Insiden Critical Aktif"
            value="2"
            icon={FiAlertOctagon}
            colorClass="bg-red-600"
          />
          <StatCard
            title="OPD Melapor"
            value="24/50"
            icon={FiServer}
            colorClass="bg-orange-500"
          />
          {/* Average Response Time Global (opsi ganti -> MTTR) */}
          <StatCard
            title="Rata-rata Respon"
            value="15m"
            icon={FiActivity}
            colorClass="bg-green-600"
          />
        </div>
      </div>

      {/* --- SECTION 3: MONITORING GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[420px]">
        {/* LEFT COLUMN: LIVE FEED */}
        <div className="lg:col-span-1 h-full min-h-[300px]">
          <LiveTicketFeed />
        </div>

        {/* MIDDLE COLUMN: TOP OPD CHART */}
        <div className="lg:col-span-1 h-full min-h-[300px]">
          <TopOPDWidget />
        </div>

        {/* RIGHT COLUMN: INFRASTRUCTURE STATUS */}
        <div className="lg:col-span-1 h-full min-h-[300px]">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
            <h3 className="font-bold text-slate-800 text-base md:text-lg dark:text-white mb-6 flex items-center gap-2">
              <FiServer
                className="text-[#053F5C] dark:text-[#429EBD]"
                size={20}
              />
              Status Infrastruktur
            </h3>

            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-medium dark:text-slate-300">
                    Data Center Utama
                  </span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  ONLINE
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium dark:text-slate-300">
                    Jaringan FO Backbone
                  </span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  STABLE
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                  <span className="text-sm font-medium dark:text-slate-300">
                    Server Email (Zimbra)
                  </span>
                </div>
                <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                  HIGH LOAD
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium dark:text-slate-300">
                    Portal SSO
                  </span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  ONLINE
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs md:text-sm text-slate-600 dark:text-slate-400">
              Terakhir update: Baru saja
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminKotaDashboard;
