import axios from "axios";

// Change this if your backend runs on a different port/URL,
// ideally pull from an env variable once the group agrees on one.
const API_URL = "http://localhost:5000/api/auth";

const register = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getProfile = async (token) => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateProfile = async (userData, token) => {
  const res = await axios.put(`${API_URL}/profile`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.data) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getCurrentUser,
};
