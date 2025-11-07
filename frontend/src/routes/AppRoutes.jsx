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
import ComplaintPage from "../pages/ComplaintPage";
import RequestPage from "../pages/RequestPage";
import TrackTicket from "../pages/TrackTicket";
import TicketDetailPage from "../pages/TicketDetailPage";
import ProfilePage from "../pages/ProfilePage";
import NewTicketPage from "../pages/NewTicketPage";
import TicketManagementPage from "../pages/TicketManagementPage";
import DashboardTicketDetailPage from "../pages/DashboardTicketDetailPage";

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

  if (!isAuthenticated || !dashboardRoles.includes(user?.role?.name)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RequestGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const isPegawai = isAuthenticated && user?.role?.name === "pegawai_opd";

  if (!isPegawai) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Guard for page need login
const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="/track-ticket" element={<TrackTicket />} />
        <Route path="/track-ticket/:ticketId" element={<TicketDetailPage />} />
        <Route
          path="/request"
          element={
            <RequestGuard>
              <RequestPage />
            </RequestGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          }
        />
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
        <Route path="new-ticket" element={<NewTicketPage />} />
        <Route path="tickets" element={<TicketManagementPage />} />
        <Route
          path="detail-ticket/:ticketId"
          element={<DashboardTicketDetailPage />}
        />
        <Route
          path="profile"
          element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          }
        />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<h1>Halaman Tidak Ditemukan</h1>} />
    </Routes>
  );
};

export default AppRoutes;
