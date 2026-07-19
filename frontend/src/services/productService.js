import axios from "axios";
import { API_BASE } from "./apiConfig";

export const fetchProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  const mapped = res.data.map((p) => ({ ...p, id: p._id }));
  console.log(`fetchProducts: loaded ${mapped.length} products`);
  return mapped;
};
