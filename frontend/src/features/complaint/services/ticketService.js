import { API_BASE_URL } from "../../../config";
import axios from "axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 1. FOR PEGAWAI (Internal, need token)
 * Documentation: POST /incidents
 */
export const createIncident = async (incidentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/incidents`,
      incidentData,
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
      error.response?.data?.message || "Gagal membuat insiden internal"
    );
  }
};

/**
 * 1. FOR Residents (Public, no token)
 * Documentation: POST /public/incidents
 */
export const createGuestIncident = async (incidentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/public/incidents`,
      incidentData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal membuat insiden publik"
    );
  }
};
