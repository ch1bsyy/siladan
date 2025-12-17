import axios from "axios";
import { API_BASE_URL } from "../../../config";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET All Notifications by User ID
export const getUserNotifications = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/notifications/users/${userId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil notifikasi."
    );
  }
};

// GET Single Notification (Mark as Read Logic usually implies GET detail or PUT status)
export const getNotificationDetail = async (notifId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/notifications/${notifId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail notifikasi."
    );
  }
};

// DELETE Notification
export const deleteNotification = async (notifId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/notifications/${notifId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal menghapus notifikasi."
    );
  }
};
