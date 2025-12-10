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

// ... import dan fungsi cleanParams, getIncidents, getRequests yang sudah ada ...

/**
 * GET Incident Detail
 * Documentation: GET /incidents/{id}
 */
export const getIncidentDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/incidents/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail insiden."
    );
  }
};

/**
 * GET Request Detail
 * Documentation: GET /requests/{id}
 */
export const getRequestDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail permintaan."
    );
  }
};

/**
 * GET Technicians by OPD
 */
export const getTechniciansByOpd = async (opdId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/opd/${opdId}/technicians`,
      {
        headers: { ...getAuthHeader() },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
};

/**
 * PUT Classify Ticket (Set Urgency & Impact)
 */
export const classifyTicket = async (id, type, data) => {
  const endpoint = type === "Pengaduan" ? "incidents" : "requests";
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${endpoint}/${id}/classify`,
      data,
      { headers: { ...getAuthHeader(), "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengklasifikasikan tiket"
    );
  }
};

/**
 * PUT Update Ticket (Assign Technician & Change Status)
 */
export const updateTicket = async (id, type, data) => {
  const endpoint = type === "Pengaduan" ? "incidents" : "requests";
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${endpoint}/${id}`,
      data,
      { headers: { ...getAuthHeader(), "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    // LOG ERROR LENGKAP KE CONSOLE AGAR BISA DIBACA
    console.error("Update Ticket Error Response:", error.response?.data);
    console.error("Update Ticket Error Status:", error.response?.status);

    // Ambil pesan error spesifik dari backend jika ada
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal mengupdate tiket (Cek Console untuk detail)";

    throw new Error(errorMessage);
  }
};
