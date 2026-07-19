// Central place for the backend URL. In local development, Vite falls back
// to localhost. In production (Vercel/Netlify), set VITE_API_URL in that
// platform's environment variables to your deployed backend's URL.
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
