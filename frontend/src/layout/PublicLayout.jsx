import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

const PublicLayout = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
