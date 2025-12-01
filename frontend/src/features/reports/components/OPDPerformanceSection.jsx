import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { LuBuilding2 } from "react-icons/lu";
import { FiTrendingUp } from "react-icons/fi";

const OPDPerformanceSection = () => {
  // MOCK DATA OPD
  const opdData = [
    { name: "Dinas Kominfo", volume: 350, sla: 98, rating: 4.9 },
    { name: "Dispendukcapil", volume: 280, sla: 92, rating: 4.5 },
    { name: "Dinas Kesehatan", volume: 210, sla: 88, rating: 4.2 },
    { name: "Bappeda", volume: 150, sla: 95, rating: 4.8 },
    { name: "Dinas Pendidikan", volume: 120, sla: 90, rating: 4.6 },
    { name: "Satpol PP", volume: 80, sla: 85, rating: 4.0 },
  ];

  // Sort by Performance (SLA)
  const leaderboard = [...opdData].sort((a, b) => b.sla - a.sla);
  // Sort by Volume for Chart
  const workloadData = [...opdData]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  const getPerformanceBadge = (sla) => {
    if (sla >= 95)
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
          Excellent
        </span>
      );
    if (sla >= 90)
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
          Good
        </span>
      );
    return (
      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
        Needs Improvement
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* TABEL LEADERBOARD */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FiTrendingUp className="text-[#F7AD19]" /> Rapor Kinerja Dinas
            (OPD)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-slate-500 border-b border-slate-100 dark:border-slate-700">
                <th className="py-3 font-semibold">Nama Instansi</th>
                <th className="py-3 font-semibold text-center">Volume Tiket</th>
                <th className="py-3 font-semibold text-center">
                  Kepatuhan SLA
                </th>
                <th className="py-3 font-semibold text-center">Rating User</th>
                <th className="py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 dark:text-slate-300">
              {leaderboard.map((opd, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className="py-3 font-medium flex items-center gap-2">
                    <LuBuilding2 size={16} className="text-slate-400" />
                    {opd.name}
                  </td>
                  <td className="py-3 text-center font-mono">{opd.volume}</td>
                  <td className="py-3 text-center font-bold text-[#053F5C] dark:text-blue-400">
                    {opd.sla}%
                  </td>
                  <td className="py-3 text-center">⭐ {opd.rating}</td>
                  <td className="py-3 text-center">
                    {getPerformanceBadge(opd.sla)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHART BEBAN KERJA (TOP 5) */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          Top 5 Volume Tiket
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          OPD dengan beban IT tertinggi
        </p>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={workloadData}
              layout="vertical"
              margin={{ left: 0, right: 30 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="volume"
                name="Jumlah Tiket"
                radius={[0, 4, 4, 0]}
                barSize={24}
              >
                {workloadData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#EF4444" : "#053F5C"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OPDPerformanceSection;
