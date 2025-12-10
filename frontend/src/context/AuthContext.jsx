/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../features/auth/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const navigate = useNavigate();

  // Check localStorage for token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);

      // refreshProfile();
    }
  }, []);

  const refreshProfile = async () => {
    try {
      const response = await authService.getCurrentUser();

      const freshUser = response.user || response.data?.user || response;

      if (freshUser) {
        setUser((prevUser) => {
          const mergedUser = {
            ...prevUser,
            ...freshUser,
          };

          if (!freshUser.permissions && prevUser?.permissions) {
            mergedUser.permissions = prevUser.permissions;
          }

          localStorage.setItem("user", JSON.stringify(mergedUser));
          return mergedUser;
        });

        return freshUser;
      }
    } catch (error) {
      console.error("Gagal refresh profil:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  const login = async (username, password) => {
    try {
      const { token: apiToken, user: loginData } = await authService.login(
        username,
        password
      );

      localStorage.setItem("token", apiToken);
      setToken(apiToken);
      setIsAuthenticated(true);

      let profileData = {};
      try {
        const response = await authService.getCurrentUser();
        profileData = response.user || response;
      } catch (error) {
        console.warn(
          "Gagal ambil avatar saat login, menggunakan data login saja",
          error
        );
      }

      const finalUser = {
        ...loginData,
        ...profileData,
        permissions: loginData.permissions,
        role: loginData.role,
      };

      setUser(finalUser);
      localStorage.setItem("user", JSON.stringify(finalUser));

      const dashboardRoles = [
        "admin_kota",
        "admin_opd",
        "bidang",
        "seksi",
        "helpdesk",
        "teknisi",
      ];

      const roleName = finalUser.role?.name || finalUser.role;

      if (dashboardRoles.includes(roleName)) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      return finalUser;
    } catch (error) {
      setToken(null);
      localStorage.removeItem("token");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  //RBAC
  const hasPermission = (permission) => {
    if (!user || !user.permissions || !Array.isArray(user.permissions))
      return false;

    const [action, subject] = permission;

    // check permission
    return user.permissions.some(
      (p) => p.action === action && p.subject === subject
    );
  };

  const value = {
    user,
    isAuthenticated,
    token,
    login,
    logout,
    hasPermission,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
