// src/api/stats.js
import { api } from "./client";

export async function getSummary() {
  const res = await api.get("/stats/summary");
  return res.data;
}

export async function getAttempts(limit = 20) {
  const res = await api.get("/stats/attempts", { params: { limit } });
  // 백엔드 응답 모양에 맞춰 안전히 배열만 리턴
  const d = res.data;
  const list =
    Array.isArray(d)        ? d :
    Array.isArray(d?.data)  ? d.data :
    Array.isArray(d?.items) ? d.items :
    [];
  return list;
}
