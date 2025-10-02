// src/api/client.js
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE, // 예: http://localhost:8000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
