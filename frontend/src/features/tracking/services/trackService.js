import { API_BASE_URL } from "../../../config";
import axios from "axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMyIncidents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/incidents`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      params: { limit: 100 },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal memuat daftar tiket pengaduan."
    );
  }
};

export const getMyRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      params: { limit: 100 },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Gagal memuat daftar tiket permintaan."
    );
  }
};

export const getIncidentDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/incidents/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal memuat detail tiket pengaduan."
    );
  }
};

export const getRequestDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal memuat detail tiket permintaan."
    );
  }
};

export const getTicketStatusByNumber = async (ticketNumber) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/public/tickets/${ticketNumber}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Tiket tidak ditemukan atau terjadi kesalahan."
    );
  }
};
