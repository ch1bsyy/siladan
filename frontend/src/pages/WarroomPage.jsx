import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWarRoom } from "../context/WarRoomContext";
import CommanderView from "../features/warroom/components/CommanderView";
import ParticipantView from "../features/warroom/components/ParticipantView";
import { FiClock, FiXCircle } from "react-icons/fi";

const WarRoomPage = () => {
  const { incidentId } = useParams();
  const { user } = useAuth();
  const { activeIncident, resolveIncident } = useWarRoom();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format Timer HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Role Check
  const isAdminKota = user?.role?.name === "admin_kota";

  // Guard: If not any major incident active, redirect (Safety)
  if (!activeIncident) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Tidak ada Insiden Aktif</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      {/* --- WAR ROOM HEADER --- */}
      <header className="bg-red-700 text-white px-6 py-4 shadow-xl z-50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="animate-pulse h-4 w-4 bg-red-400 rounded-full"></div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase">
                WAR ROOM: MAJOR INCIDENT
              </h1>
              <p className="text-red-200 text-sm font-mono">
                Ref: {incidentId} | {activeIncident.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-red-800/50 px-4 py-2 rounded-lg border border-red-500 flex items-center gap-3">
              <FiClock className="animate-spin-slow" />
              <span className="text-2xl font-mono font-bold">
                {formatTime(timer)}
              </span>
            </div>

            {isAdminKota && (
              <button
                onClick={resolveIncident}
                className="bg-white text-red-700 hover:bg-red-50 px-6 py-2 rounded-lg font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <FiXCircle /> Nyatakan Selesai
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        {isAdminKota ? <CommanderView /> : <ParticipantView />}
      </main>
    </div>
  );
};

export default WarRoomPage;
