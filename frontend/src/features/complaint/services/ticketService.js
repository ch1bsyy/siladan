import { API_BASE_URL } from "../../../config";
import axios from "axios";

// Helper for get token
// const getAuthHeader = () => {
//   const token = localStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

export const createTicket = async (ticketData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tickets`,
      ticketData
      // {
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...getAuthHeader(),
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Terjadi kesalahan pada server";
  }
};
