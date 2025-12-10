import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkModeToggler from "../components/DarkModeToggler";
import { FiMenu, FiX, FiLogIn, FiSettings, FiLogOut } from "react-icons/fi";
import Logo from "../assets/images/logo-siladan.png";
import NotificationDropdown from "../components/NotificationDropdown";
import ProfileDropdown from "../components/ProfileDropdown";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const roleName = user?.role?.name || user?.role;
  const isPegawai = isAuthenticated && roleName === "pegawai_opd";

  const baseNavLinks = [
    { name: "Beranda", path: "/" },
    // { name: "Tentang Kami", path: "/about" },
    { name: "Pengaduan", path: "/complaint" },
    { name: "Lacak Tiket", path: "/track-ticket" },
    { name: "Pusat Informasi", path: "/help" },
  ];

  if (isPegawai) {
    baseNavLinks.splice(2, 0, { name: "Permintaan", path: "/request" });
  }

  const handleLogout = () => {
    logout();
  };

  const renderNavLinks = () =>
    baseNavLinks.map((link) => (
      <NavLink
        key={link.name}
        to={link.path}
        className={({ isActive }) =>
          `block min-w-[44px] min-h-[44px] md:inline-block px-3 py-2 rounded-md transition-colors ${
            isActive
              ? "font-semibold text-[#429EBD] dark:text-[#9FE7F5]"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        {link.name}
      </NavLink>
    ));

  return (
    <header className="bg-white dark:bg-[#053F5C]/80 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-2 py-4">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-[#429EBD]">
              <div className="flex items-center">
                <img
                  src={Logo}
                  alt="Siladan Logo"
                  className="w-22 h-22 object-contain drop-shadow-2xl filter brightness-70 dark:filter-none"
                />
                <span className="hidden md:block">SILADAN</span>
              </div>
            </Link>
          </div>

          {/* Nav (Desktop) */}
          <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:space-x-3">
            {renderNavLinks()}
          </div>

          {/* Dark Mode & Action Button */}
          <div className="flex items-center space-x-3 md:space-x-5">
            <DarkModeToggler />
            {isAuthenticated && <NotificationDropdown />}

            {/* Login button or user menu */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <button
                  className="flex items-center min-h-[44px] gap-2 bg-[#429EBD] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#053F5C] dark:hover:bg-[#327b93] transition-colors cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  <FiLogIn size={20} />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Hamburger Menu (Mobile) */}
            <div className="flex lg:hidden items-center">
              <button
                aria-label="Toggle Menu"
                className="flex items-center justify-center p-2 rounded-md min-h-[44px] min-w-[44px] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Nav (Mobile) */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-1">
            {renderNavLinks()}

            {/* Login or Logout Mobile */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="w-full min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer"
                  >
                    <FiSettings />
                    <span>Pengaturan Profil</span>
                  </Link>
                  <button
                    className="w-full min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  className="w-full min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 bg-[#429EBD] hover:bg-[#327c95] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  <FiLogIn size={20} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default PublicNavbar;
