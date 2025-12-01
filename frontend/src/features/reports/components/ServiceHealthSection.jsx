import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiActivity, FiUsers, FiCheckCircle } from "react-icons/fi";
import KPICard from "./KPICard";

const ServiceHealthSection = () => {
  // MOCK DATA VOLUME
  const volumeData = [
    { name: "Minggu 1", masuk: 40, selesai: 35 },
    { name: "Minggu 2", masuk: 55, selesai: 48 },
    { name: "Minggu 3", masuk: 30, selesai: 30 },
    { name: "Minggu 4", masuk: 60, selesai: 50 },
  ];

  // MOCK DATA SLA GAUGE (95%)
  const slaData = [
    { name: "Achieved", value: 95 },
    { name: "Missed", value: 5 },
  ];
  const COLORS = ["#10B981", "#E5E7EB"];

  return (
    <div className="space-y-6">
      {/* KPI CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="SLA Compliance"
          value="95%"
          subtext="Target: 95% (On Track)"
          icon={FiCheckCircle}
          color="green"
        />
        <KPICard
          title="Total Tiket Masuk"
          value="185"
          subtext="+12% dari bulan lalu"
          icon={FiActivity}
          color="blue"
        />
        <KPICard
          title="Kepuasan User (CSAT)"
          value="4.8/5.0"
          subtext="Berdasarkan 120 ulasan"
          icon={FiUsers}
          color="yellow"
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VOLUME TREND */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            Tren Volume Tiket (Masuk vs Selesai)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#053F5C" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#053F5C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7AD19" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F7AD19" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="masuk"
                  stroke="#053F5C"
                  fillOpacity={1}
                  fill="url(#colorMasuk)"
                  name="Tiket Masuk"
                />
                <Area
                  type="monotone"
                  dataKey="selesai"
                  stroke="#F7AD19"
                  fillOpacity={1}
                  fill="url(#colorSelesai)"
                  name="Tiket Selesai"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA GAUGE (SEMI DONUT) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            Kesehatan SLA
          </h3>
          <div className="relative h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slaData}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {slaData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                95%
              </span>
              <p className="text-xs md:text-sm text-slate-500">Compliance</p>
            </div>
          </div>
          <p className="text-center text-sm md:text-base text-slate-600 dark:text-slate-400 mt-[-20px]">
            Sangat Baik. Pertahankan di atas 90%.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceHealthSection;
