import axios from "axios";
import { API_BASE_URL } from "../../../config";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// POST Login
export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        username: username,
        password: password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data && response.data.token) {
      return response.data;
    } else {
      throw new Error("Respon API tidak valid");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Username atau password salah."
    );
  }
};

// GET Current User Profile
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal memuat profil");
  }
};

// PUT Update User Profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/auth/me`, userData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal update profil");
  }
};

// POST Change Password
export const changePassword = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/change-password`,
      {
        old_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_new_password: data.confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengubah password."
    );
  }
};
