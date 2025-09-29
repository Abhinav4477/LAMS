import axios from "axios";

// Use full backend URL in dev, relative in production
const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5001/api"
  : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ send cookies automatically
});

export const API_BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5001"
  : "";

export default api;
