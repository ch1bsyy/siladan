import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layouts
import PublicLayout from "../layout/PublicLayout";
import DashboardLayout from "../layout/DashboardLayout";

// Pages
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import AboutPage from "../pages/AboutPage";

// Guard Component for protect route
const DashboardGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const dashboardRoles = [
    "teknisi",
    "seksi",
    "bidang",
    "admin_opd",
    "admin_kota",
  ];

  if (!isAuthenticated && !dashboardRoles.includes(user?.role?.name)) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />}></Route>
      </Route>

      <Route
        path="/dashboard"
        element={
          <DashboardGuard>
            <DashboardLayout />
          </DashboardGuard>
        }
      >
        <Route index element={<DashboardPage />} />
        {/* example: <Route path="users" element={<UserPage />} /> */}
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<h1>Halaman Tidak Ditemukan</h1>} />
    </Routes>
  );
};

export default AppRoutes;
