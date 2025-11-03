import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data
const data = [
  { name: "Insiden", value: 8 },
  { name: "Permintaan", value: 4 },
];

const COLORS = ["#F7AD19", "#429EBD"];

const TicketChartWidget = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 md:p-6 h-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Komposisi Tiket Masuk
      </h3>
      <div className="w-full h-[250px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={(entry) => entry.value}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TicketChartWidget;
