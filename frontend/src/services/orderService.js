import axios from "axios";
import { API_BASE } from "./apiConfig";

function currentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function authHeader() {
  const stored = currentUser();
  return stored?.token ? { Authorization: `Bearer ${stored.token}` } : {};
}

export const placeOrder = async (shippingAddress, paymentMethod) => {
  const user = currentUser();
  const res = await axios.post(
    `${API_BASE}/orders/place`,
    { userId: user?._id, shippingAddress, paymentMethod },
    { headers: authHeader() }
  );
  return res.data;
};

export const getMyOrders = async () => {
  const user = currentUser();
  const res = await axios.get(`${API_BASE}/orders/user/${user?._id}`, { headers: authHeader() });
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await axios.get(`${API_BASE}/orders/${orderId}`, { headers: authHeader() });
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await axios.put(`${API_BASE}/orders/cancel/${orderId}`, {}, { headers: authHeader() });
  return res.data;
};

// ---- Admin ----
export const adminGetAllOrders = async () => {
  const res = await axios.get(`${API_BASE}/admin/orders`, { headers: authHeader() });
  return res.data;
};

export const adminUpdateOrderStatus = async (orderId, orderStatus) => {
  const res = await axios.put(
    `${API_BASE}/admin/orders/${orderId}/status`,
    { orderStatus },
    { headers: authHeader() }
  );
  return res.data;
};
