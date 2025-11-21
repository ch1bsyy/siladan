import { API_BASE_URL } from "../../../config";
import axios from "axios";

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
