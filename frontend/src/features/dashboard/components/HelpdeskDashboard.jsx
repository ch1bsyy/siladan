import React from "react";
import StatCard from "./StatCard";
import TicketListWidget from "./TicketListWidget";
import TicketChartWidget from "./TicketChartWidget";
import QuickActionsWidget from "./QuickActionsWidget";
import { FiInbox, FiAlertTriangle, FiCheckSquare } from "react-icons/fi";

const HelpdeskDashboard = () => {
  return (
    <div className="space-y-8 dark:text-white">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Tiket Terbaru"
          value="12"
          icon={FiInbox}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Total Tiket Insiden Terbaru"
          value="8"
          icon={FiAlertTriangle}
          colorClass="bg-[#F7AD19]"
        />
        <StatCard
          title="Total Tiket Request Terbaru"
          value="4"
          icon={FiCheckSquare}
          colorClass="bg-[#429EBD]"
        />
      </div>

      {/* Widget List & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TicketListWidget />
        </div>

        <div className="lg:col-span-1 flex flex-col justify-between gap-6">
          <QuickActionsWidget />
          <TicketChartWidget />
        </div>
      </div>
    </div>
  );
};

export default HelpdeskDashboard;
