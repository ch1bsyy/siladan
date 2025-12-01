import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiArrowRight, FiActivity } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { useWarRoom } from "../../../context/WarRoomContext";

const WarRoomStatusWidget = () => {
  const { activeIncident } = useWarRoom();
  const navigate = useNavigate();

  if (activeIncident) {
    return (
      <div className="bg-red-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden animate-pulse-slow">
        <div className="absolute -right-10 -top-10 bg-white/10 w-40 h-40 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full animate-bounce">
              <FiAlertTriangle size={32} className="text-white" />
            </div>
            <div className="flex">
              <h2 className="text-2xl font-black tracking-wider uppercase">
                Major Incident Active
              </h2>
              <p className="text-red-100 font-medium text-lg">
                {activeIncident.title}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm bg-red-800/50 w-fit px-3 py-1 rounded-lg">
                <FiActivity size={14} className="animate-spin-slow" />
                <span>Sedang Ditangani di War Room</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/dashboard/war-room/${activeIncident.id}`)}
            className="bg-white text-red-700 hover:bg-red-50 px-8 py-3 rounded-lg font-bold shadow-xl transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            MASUK WAR ROOM <FiArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="absolute -right-5 -bottom-10 bg-white/10 w-32 h-32 rounded-full blur-xl"></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <GoShieldCheck size={32} className="text-white" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold">Operasional Kota Normal</h2>
            <p className="text-green-100 text-sm">
              Tidak ada insiden kritis terdeteksi saat ini.
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-xs text-green-100 uppercase font-bold tracking-widest">
            System Status
          </p>
          <p className="text-2xl font-mono font-bold">100% UP</p>
        </div>
      </div>
    </div>
  );
};

export default WarRoomStatusWidget;
