/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-useless-catch */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../features/auth/services/mockAuthService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const { token: apiToken, user: userData } = await authService.login(
        username,
        password
      );

      localStorage.setItem("token", apiToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(apiToken);
      setIsAuthenticated(true);

      const dashboardRoles = [
        "admin_kota",
        "admin_opd",
        "bidang",
        "seksi",
        "helpdesk",
        "teknisi",
      ];
      if (dashboardRoles.includes(userData.role?.name)) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      return userData;
    } catch (error) {
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
    if (!user || !user.permissions) return false;

    const [action, subject] = permission;

    // Admin with permission 'manage:all' can do anything
    // if (
    // user.permissions.some((p) => p.action === "manage" && p.subject === "all")
    // ) {
    //   return true;
    // }

    // check permission
    return user.permissions.some(
      (p) => p.action === action && p.subject === subject
    );
  };

  const value = { user, isAuthenticated, token, login, logout, hasPermission };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
