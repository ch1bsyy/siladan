import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import { useWarRoom } from "../../../context/WarRoomContext";

const EmergencyBanner = () => {
  const { activeIncident } = useWarRoom();

  if (!activeIncident) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-3 shadow-md animate-pulse-slow flex items-center justify-between relative z-50">
      <div className="flex items-center gap-3 mx-auto container max-w-7xl">
        <FiAlertTriangle className="animate-bounce" size={24} />
        <span className="font-bold tracking-wide text-sm md:text-base">
          🔥 MODE WAR ROOM AKTIF: {activeIncident.title}
        </span>
        <Link
          to={`/dashboard/war-room/${activeIncident.id}`}
          className="ml-4 bg-white text-red-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-1"
        >
          Masuk Koordinasi <FiArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default EmergencyBanner;
