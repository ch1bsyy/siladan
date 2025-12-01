import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { LuBuilding2 } from "react-icons/lu";

const data = [
  { name: "Dinkes", tiket: 24 },
  { name: "Dispenduk", tiket: 18 },
  { name: "Dindik", tiket: 12 },
  { name: "Bappeda", tiket: 8 },
  { name: "Satpol PP", tiket: 5 },
];

const TopOPDWidget = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 h-full">
      <h3 className="font-bold text-slate-800 text-base md:text-lg dark:text-white mb-1 flex items-center gap-2">
        <LuBuilding2 className="text-[#916610] dark:text-[#F7AD19]" size={20} />{" "}
        Top 5 OPD Melapor
      </h3>
      <p className="text-xs md:text-sm text-slate-500 mb-6">
        Berdasarkan jumlah tiket hari ini
      </p>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={80}
              tick={{ fontSize: 14, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="tiket" barSize={16} radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#ef4444" : "#053F5C"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopOPDWidget;
