import { API_BASE_URL } from "../../../config";
import axios from "axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Helper to clean parameter object (key value null/undefined/empty string)
 */
const cleanParams = (params) => {
  const cleaned = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== null &&
      params[key] !== "" &&
      params[key] !== undefined
    ) {
      cleaned[key] = params[key];
    }
  });
  return cleaned;
};

/**
 * GET Incidents (Pengaduan)
 * Params: status, priority, opd_id, verification_status, search, page, limit
 */
export const getIncidents = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/incidents`, {
      headers: { ...getAuthHeader() },
      params: cleanParams(params),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data pengaduan."
    );
  }
};

/**
 * GET Requests (Permintaan)
 * Params: status, search, opd_id, page, limit
 */
export const getRequests = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`, {
      headers: { ...getAuthHeader() },
      params: cleanParams(params),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data permintaan."
    );
  }
};
