import axios from "axios";
import { API_BASE_URL } from "../../config";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET Catalog Hierarchy
export const getCatalog = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/catalog`, {
      headers: getAuthHeader(),
      params: params,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal memuat katalog");
  }
  
};

// POST Create Item (Level 2 or Level 3)
export const createCatalogItem = async (payload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/catalog/items`,
      payload,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal membuat item");
  }
};

// PUT Update Item
export const updateCatalogItem = async (id, payload) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/admin/catalog/items/${id}`,
      payload,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengupdate item");
  }
};

// Delete Item
export const deleteCatalogItem = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/catalog/items/${id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Gagal menghapus item");
  }
};
