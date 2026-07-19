import axios from "axios";
import { API_BASE } from "./apiConfig";

function currentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function authHeader() {
  const stored = currentUser();
  return stored?.token ? { Authorization: `Bearer ${stored.token}` } : {};
}

export const getCart = async () => {
  const user = currentUser();
  if (!user?._id) return { success: false, cart: { items: [], totalAmount: 0 } };
  const res = await axios.get(`${API_BASE}/cart/${user._id}`, { headers: authHeader() });
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const user = currentUser();
  const res = await axios.post(
    `${API_BASE}/cart/add`,
    { userId: user?._id, productId, quantity },
    { headers: authHeader() }
  );
  return res.data;
};

export const updateCartItem = async (productId, quantity) => {
  const user = currentUser();
  const res = await axios.put(
    `${API_BASE}/cart/update`,
    { userId: user?._id, productId, quantity },
    { headers: authHeader() }
  );
  return res.data;
};

export const removeFromCart = async (productId) => {
  const user = currentUser();
  const res = await axios.delete(`${API_BASE}/cart/remove/${productId}`, {
    data: { userId: user?._id },
    headers: authHeader(),
  });
  return res.data;
};

export const clearCart = async () => {
  const user = currentUser();
  const res = await axios.delete(`${API_BASE}/cart/clear`, {
    data: { userId: user?._id },
    headers: authHeader(),
  });
  return res.data;
};
