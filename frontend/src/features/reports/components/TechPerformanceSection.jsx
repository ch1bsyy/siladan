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
import { FiStar, FiTrendingUp } from "react-icons/fi";

const TechPerformanceSection = () => {
  // MOCK DATA TEKNISI
  const techData = [
    { name: "Budi S.", resolved: 45, sla: 98, rating: 4.9 },
    { name: "Andi R.", resolved: 38, sla: 92, rating: 4.7 },
    { name: "Siti A.", resolved: 42, sla: 95, rating: 4.8 },
    { name: "Doni K.", resolved: 25, sla: 88, rating: 4.5 },
    { name: "Rina M.", resolved: 30, sla: 94, rating: 4.8 },
  ];

  // Ranking Leaderbord Logic
  const leaderboard = [...techData].sort((a, b) => b.resolved - a.resolved);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEADERBOARD TABLE */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row  gap-2 items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FiTrendingUp className="text-[#F7AD19]" /> Leaderboard Teknisi
          </h3>
          <span className="text-xs md:text-sm bg-yellow-100 text-yellow-800 px-3 py-2 rounded">
            Top Performer: {leaderboard[0].name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm md:text-base text-slate-500 border-b border-slate-100 dark:border-slate-700">
                <th className="py-3 font-semibold">Nama Teknisi</th>
                <th className="py-3 font-semibold text-center">
                  Tiket Selesai
                </th>
                <th className="py-3 font-semibold text-center">SLA (%)</th>
                <th className="py-3 font-semibold text-center">Rating User</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 dark:text-slate-300">
              {leaderboard.map((tech, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className="py-3 font-medium flex items-center gap-2">
                    {idx === 0 && (
                      <FiStar
                        className="text-yellow-500 fill-yellow-500"
                        size={16}
                      />
                    )}
                    {tech.name}
                  </td>
                  <td className="py-3 text-center font-bold text-[#053F5C] dark:text-[#429EBD]">
                    {tech.resolved}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium ${
                        tech.sla >= 90
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tech.sla}%
                    </span>
                  </td>
                  <td className="py-3 text-center flex justify-center items-center gap-2">
                    <FiStar
                      className="text-yellow-400 fill-yellow-400"
                      size={14}
                    />{" "}
                    {tech.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WORKLOAD CHART */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
          Distribusi Beban Kerja
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={techData} layout="vertical" margin={{ left: 0 }}>
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
                width={60}
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="resolved"
                name="Tiket Ditangani"
                radius={[0, 4, 4, 0]}
                barSize={20}
              >
                {techData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#F7AD19" : "#053F5C"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-4 text-center">
          * Grafik menunjukkan jumlah tiket yang diselesaikan per teknisi.
        </p>
      </div>
    </div>
  );
};

export default TechPerformanceSection;
