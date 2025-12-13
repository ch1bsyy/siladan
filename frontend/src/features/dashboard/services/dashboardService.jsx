import axios from "axios";
import { API_BASE_URL } from "../../../config";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getDashboardData = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard`, getConfig());
  return response.data;
};