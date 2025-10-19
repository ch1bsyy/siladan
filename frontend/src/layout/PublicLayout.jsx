import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

const PublicLayout = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <PublicNavbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
