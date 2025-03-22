import axios from "axios";

const API_URL = "http://localhost:4000/api";

// User APIs
export const registerUser = async (data) => {
  return axios.post(`${API_URL}/users/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/users/login`, data);
};

// Product APIs
export const getProducts = async (token) => {
  return axios.get(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProductById = async (id, token) => {
  return axios.get(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProductsByCategory = async (category, token) => {
  return axios.get(`${API_URL}/products/${category}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createProduct = async (data, token) => {
  return axios.post(`${API_URL}/products`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProduct = async (id, data, token) => {
  return axios.put(`${API_URL}/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteProduct = async (id, token) => {
  return axios.delete(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// New Transaction-based APIs (replacing stock-in/stock-out)
export const productIn = async (id, data, token) => {
  return axios.post(`${API_URL}/products/${id}/product-in`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const productOut = async (id, data, token) => {
  return axios.post(`${API_URL}/products/${id}/product-out`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Category APIs
export const getAllCategories = async (token) => {
  return axios.get(`${API_URL}/category`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createCategory = async (data, token) => {
  return axios.post(`${API_URL}/category`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};