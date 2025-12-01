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
  Legend,
} from "recharts";
import {
  FiActivity,
  FiCheckCircle,
  FiAlertTriangle,
  FiUsers,
} from "react-icons/fi";
import KPICard from "./KPICard";

const ExecutiveSummarySection = () => {
  // MOCK DATA KPI
  const kpiData = {
    totalTickets: 1250,
    slaRate: "88%",
    userSatisfaction: "4.6/5.0",
    majorIncidents: 3,
  };

  // MOCK DATA TREN (Insiden vs Request)
  const trendData = [
    { name: "Minggu 1", insiden: 40, request: 65 },
    { name: "Minggu 2", insiden: 55, request: 70 },
    { name: "Minggu 3", insiden: 30, request: 60 },
    { name: "Minggu 4", insiden: 80, request: 55 },
  ];

  // MOCK DATA PROBLEM DISTRIBUTION
  const categoryData = [
    { name: "Jaringan (Network)", value: 450 },
    { name: "Hardware", value: 300 },
    { name: "Aplikasi Pemda", value: 350 },
    { name: "Keamanan (Security)", value: 150 },
  ];

  const COLORS = ["#053F5C", "#F7AD19", "#429EBD", "#FF8042"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Tiket Kota"
          value={kpiData.totalTickets}
          subtext="+5% dari bulan lalu"
          icon={FiActivity}
          color="blue"
        />
        <KPICard
          title="Kepatuhan SLA Kota"
          value={kpiData.slaRate}
          subtext="Target: 90% (Perlu Atensi)"
          icon={FiCheckCircle}
          color="yellow"
        />
        <KPICard
          title="Kepuasan (IKM)"
          value={kpiData.userSatisfaction}
          subtext="1,200 Responden"
          icon={FiUsers}
          color="green"
        />
        <KPICard
          title="Major Incidents"
          value={kpiData.majorIncidents}
          subtext="Insiden War Room"
          icon={FiAlertTriangle}
          color="red"
        />
      </div>

      {/* 2. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LINE CHART: TREN LAYANAN */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            Tren Stabilitas Layanan
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorInsiden" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
                <Legend verticalAlign="top" height={36} />
                <Area
                  type="monotone"
                  dataKey="insiden"
                  name="Insiden / Gangguan"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorInsiden)"
                />
                <Area
                  type="monotone"
                  dataKey="request"
                  name="Permintaan Layanan"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorReq)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART: DISTRIBUSI */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            Distribusi Masalah
          </h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6">
            Berdasarkan kategori global
          </p>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummarySection;
