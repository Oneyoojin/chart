// src/api/auth.js
import { api } from "./client";

export async function register({ email, password, nickname }) {
  const { data } = await api.post("/auth/register", { email, password, nickname });
  return data; // user
}

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("me", JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("me");
}

export function getMe() {
  try { return JSON.parse(localStorage.getItem("me") || "null"); } catch { return null; }
}
