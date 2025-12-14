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

export const getFAQs = async () => {
  const response = await axios.get(`${API_BASE_URL}/faq/opd`, getConfig());
  return response.data;
};

export const createFAQ = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/faq`, data, getConfig());
  return response.data;
};

export const updateFAQ = async (id, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/faq/${id}`,
    data,
    getConfig()
  );
  return response.data;
};

export const deleteFAQ = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/faq/${id}`, getConfig());
  return response.data;
};

// GET Public FAQ (Tanpa Token)
export const getPublicFAQs = async () => {
  const response = await axios.get(`${API_BASE_URL}/public/faq`);
  return response.data;
};
