/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const WarRoomContext = createContext(null);

export const WarRoomProvider = ({ children }) => {
  // State Simulation Incident
  const [activeIncident, setActiveIncident] = useState(null); // If Null = Safe

  // Function trigger major incident (backend)
  const triggerMajorIncident = () => {
    const incidentData = {
      id: "INC-MASTER-001",
      title: "Gangguan Jaringan Backbone Area Selatan",
      startTime: new Date(),
      affectedOPDs: 5,
      commanderMessage:
        "Mohon jangan buat tiket baru. Teknisi sedang meluncur. ETA 2 Jam.",
    };
    setActiveIncident(incidentData);

    // Toast Notification {POP UP}
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-red-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white">
                  MAJOR INCIDENT DETECTED!
                </p>
                <p className="mt-1 text-sm text-red-100">
                  {incidentData.title}. Klik untuk bergabung ke War Room.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-red-500">
            <button
              onClick={() => {
                window.location.href = `/dashboard/war-room/${incidentData.id}`;
                toast.dismiss(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
            >
              JOIN
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const resolveIncident = () => {
    setActiveIncident(null);
    toast.success("Insiden dinyatakan selesai. War Room ditutup.");
    window.location.href = "/dashboard";
  };

  return (
    <WarRoomContext.Provider
      value={{ activeIncident, triggerMajorIncident, resolveIncident }}
    >
      {children}
    </WarRoomContext.Provider>
  );
};

export const useWarRoom = () => useContext(WarRoomContext);
