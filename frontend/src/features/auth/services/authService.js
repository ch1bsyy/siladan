import axios from "axios";
import { API_BASE_URL } from "../../../config";

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
