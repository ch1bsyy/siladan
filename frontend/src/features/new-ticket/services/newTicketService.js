import axios from "axios";
import { API_BASE_URL } from "../../../config";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1. GET OPD List (Public)
export const getOpdList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public/opd`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal memuat daftar OPD");
  }
};

// 2. GET Pegawai List per OPD
export const getEmployeesByOpd = async (opdId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/opd/${opdId}/pegawai`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal memuat daftar pegawai"
    );
  }
};

// 3. POST Create Incident
export const createIncident = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/incidents`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal membuat tiket pengaduan"
    );
  }
};

// 4. POST Create Request
export const createServiceRequest = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/requests`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal membuat tiket permintaan"
    );
  }
};
