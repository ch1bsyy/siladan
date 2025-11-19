import { API_BASE_URL } from "../../../config";
import axios from "axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 1. GET: Get Request Catalog List
 * Documentation: GET /catalog
 */
export const getServiceCatalog = async (opdId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/catalog`, {
      headers: {
        ...getAuthHeader(),
      },
      params: {
        opd_id: opdId,
        is_active: "true",
      },
    });
    if (!response.data || !Array.isArray(response.data.catalogs)) {
      throw new Error("Format respon katalog tidak valid");
    }
    return response.data.catalogs;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil katalog layanan"
    );
  }
};

/**
 * 2. POST: Create New Ticket Request
 * Documentation: POST /requests
 */
export const createServiceRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/requests`, requestData, {
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
