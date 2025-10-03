import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      {/* <PublicNavbar /> */}
      <header>Ini adalah Navigasi Publik</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
