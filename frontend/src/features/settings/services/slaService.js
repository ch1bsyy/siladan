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

// GET Data SLA by OPD ID
export const getSLAConfig = async (opdId) => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/sla?opd_id=${opdId}`,
    getConfig()
  );
  return response.data;
};

// POST/Upsert Data SLA
export const upsertSLAConfig = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/sla`,
    data,
    getConfig()
  );
  return response.data;
};
