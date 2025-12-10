import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FiSettings, FiLogOut, FiUser } from "react-icons/fi";
import { getCurrentUser } from "../features/auth/services/authService";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  const [profile, setProfile] = useState(user || {});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getCurrentUser();
        if (response?.user) {
          setProfile(response.user);
        }
      } catch (error) {
        console.error("Gagal memuat avatar profil:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Close Dropdown Logic
  useEffect(() => {
    const handleCLickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleCLickOutside);
    return () => document.removeEventListener("mousedown", handleCLickOutside);
  }, []);

  // Helper render avatar
  const renderAvatar = () => {
    const avatarSrc = profile.avatar_url || user.avatar;

    if (avatarSrc) {
      return (
        <img
          src={avatarSrc}
          alt="Foto Profil"
          className="w-11 h-11 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 flex-shrink-0"
        />
      );
    }

    return (
      <div className="w-11 h-11 rounded-full bg-[#053F5C] text-white flex items-center justify-center font-bold text-lg border-2 border-slate-300 dark:border-slate-600 flex-shrink-0">
        {profile.username ? (
          profile.username.charAt(0).toUpperCase()
        ) : (
          <FiUser />
        )}
      </div>
    );
  };

  const getRoleName = (roleData) => {
    if (!roleData) return "User";
    if (typeof roleData === "string") return roleData;
    return roleData.name || roleData.label || "User";
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profil */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        {renderAvatar()}

        <div className="text-left hidden md:block min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            {profile.username || user.username}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {getRoleName(profile.role || user.role)}
          </p>
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex min-w-[44px] min-h-[44px] items-center w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <FiSettings className="mr-3" />
              Pengaturan Profil
            </Link>

            <button
              onClick={logout}
              className="flex items-center min-w-[44px] min-h-[44px] w-full px-3 py-2 text-sm text-red-600 dark:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
