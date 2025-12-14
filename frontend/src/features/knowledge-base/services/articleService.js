// src/features/knowledge-base/services/articleService.js
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

// GET Articles (List)
// Params: category, status, search, page, limit
export const getArticles = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/articles`, {
    ...getConfig(),
    params,
  });
  return response.data;
};

// GET Single Article
export const getArticleDetail = async (id) => {
  const response = await axios.get(
    `${API_BASE_URL}/articles/${id}`,
    getConfig()
  );
  return response.data;
};

// POST Create Article
export const createArticle = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/articles`,
    data,
    getConfig()
  );
  return response.data;
};

// PUT Update Article
export const updateArticle = async (id, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/articles/${id}`,
    data,
    getConfig()
  );
  return response.data;
};

// PATCH Update Status (Publish/Reject)
export const updateArticleStatus = async (id, status, notes) => {
  const payload = { status, notes };
  const response = await axios.patch(
    `${API_BASE_URL}/articles/${id}/status`,
    payload,
    getConfig()
  );
  return response.data;
};

// GET Public Articles (Tanpa Token)
export const getPublicArticles = async () => {
  const response = await axios.get(`${API_BASE_URL}/public/articles`); // Asumsi ada endpoint ini
  // Jika tidak ada endpoint khusus public, gunakan getArticles tapi handle 401 di backend
  return response.data;
};

// DELETE Article
export const deleteArticle = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/articles/${id}`,
    getConfig()
  );
  return response.data;
};
