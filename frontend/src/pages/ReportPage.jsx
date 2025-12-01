import React, { useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiAward,
  FiSmile,
  FiDownload,
} from "react-icons/fi";
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
import StatCardTeknisi from "../features/performance/components/StatCardTeknisi";
import FormSelect from "../components/FormSelect";

// --- MOCK DATA ---
const kpiData = {
  totalResolved: 45,
  mttr: "3 Jam 15 Menit", // Mean Time to Resolution
  slaCompliance: "96%",
  csatScore: "4.8/5.0",
};

// Data Grafik
const trendData = [
  { name: "Minggu 1", selesai: 8, masuk: 10 },
  { name: "Minggu 2", selesai: 12, masuk: 15 },
  { name: "Minggu 3", selesai: 15, masuk: 12 },
  { name: "Minggu 4", selesai: 10, masuk: 8 },
];

// Data Pie Chart
const ticketComposition = [
  { name: "Pengaduan", value: 28 },
  { name: "Permintaan", value: 17 },
];

// Color Chart
const COLORS = ["#053F5C", "#F7AD19", "#429EBD", "#FF8042"];

const ReportPage = () => {
  const [period, setPeriod] = useState("Bulan Ini");

  return (
    <div className="space-y-6 pb-10 dark:text-white">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Laporan Kinerja
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Ringkasan performa pengerjaan tiket Anda periode ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-40">
            <FormSelect
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="Bulan Ini">Bulan Ini</option>
              <option value="Bulan Lalu">Bulan Lalu</option>
              <option value="Tahun Ini">Tahun Ini</option>
            </FormSelect>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer shadow-sm">
            <FiDownload />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardTeknisi
          title="Tiket Selesai"
          value={kpiData.totalResolved}
          icon={FiCheckCircle}
          color="blue"
          trend="up"
          trendValue="12%"
        />
        <StatCardTeknisi
          title="Rata-rata MTTR"
          value={kpiData.mttr}
          icon={FiClock}
          color="yellow"
          trend="down"
          trendValue="15m" // MTTR down means goods (more faster)
        />
        <StatCardTeknisi
          title="Kepatuhan SLA"
          value={kpiData.slaCompliance}
          icon={FiAward}
          color="purple"
          trend="up"
          trendValue="2%"
        />
        <StatCardTeknisi
          title="Kepuasan User (CSAT)"
          value={kpiData.csatScore}
          icon={FiSmile}
          color="green"
          trend="up"
          trendValue="0.2"
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart Area (Productivity) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            Tren Produktivitas Mingguan
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#053F5C" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#053F5C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7AD19" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F7AD19" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area
                  type="monotone"
                  dataKey="masuk"
                  name="Tiket Masuk"
                  stroke="#F7AD19"
                  fillOpacity={1}
                  fill="url(#colorMasuk)"
                />
                <Area
                  type="monotone"
                  dataKey="selesai"
                  name="Tiket Selesai"
                  stroke="#429EBD"
                  fillOpacity={1}
                  fill="url(#colorSelesai)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Chart (Composition) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            Komposisi Pekerjaan
          </h3>
          <p className="text-sm text-slate-500 mb-6">Berdasarkan tipe tiket</p>

          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketComposition}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ticketComposition.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-[-15px]">
              <span className="text-2xl font-bold text-slate-800 dark:text-white block">
                45
              </span>
              <span className="text-xs text-slate-500">Total Tiket</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-600 dark:text-slate-400">
                Pengaduan (Insiden)
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                62%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Permintaan Layanan
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                38%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: ADDITIONAL INFO (opsional sih ini) --- */}
      <div className="bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="bg-white dark:bg-slate-700 p-3 mx-auto rounded-full text-[#053F5C] dark:text-white shadow-sm">
            <FiAward size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#053F5C] dark:text-white">
              Kinerja Anda Sangat Baik!
            </h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Anda mempertahankan rasio kepatuhan SLA di atas 95% selama 3 bulan
              berturut-turut. Rata-rata MTTR Anda juga 15% lebih cepat
              dibandingkan rata-rata tim. Pertahankan!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
