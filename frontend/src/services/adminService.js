import axios from "axios";
import { API_BASE } from "./apiConfig";

function authHeader() {
  const stored = JSON.parse(localStorage.getItem("user"));
  return stored?.token ? { Authorization: `Bearer ${stored.token}` } : {};
}

// ---- Products ----
export const adminGetProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

export const adminCreateProduct = async (product) => {
  const res = await axios.post(`${API_BASE}/products`, product, { headers: authHeader() });
  return res.data;
};

export const adminUpdateProduct = async (id, product) => {
  const res = await axios.put(`${API_BASE}/products/${id}`, product, { headers: authHeader() });
  return res.data;
};

export const adminDeleteProduct = async (id) => {
  const res = await axios.delete(`${API_BASE}/products/${id}`, { headers: authHeader() });
  return res.data;
};

// ---- Users ----
export const adminGetUsers = async () => {
  const res = await axios.get(`${API_BASE}/admin/users`, { headers: authHeader() });
  return res.data;
};

export const adminUpdateUserRole = async (id, role) => {
  const res = await axios.put(`${API_BASE}/admin/users/${id}/role`, { role }, { headers: authHeader() });
  return res.data;
};

export const adminDeleteUser = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/users/${id}`, { headers: authHeader() });
  return res.data;
};
