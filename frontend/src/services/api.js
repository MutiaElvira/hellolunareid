import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://hellolunareid-production.up.railway.app";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {

    req.headers.Authorization = `Bearer ${token}`;

  }

  return req;

});

export default API;