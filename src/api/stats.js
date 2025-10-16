// src/api/stats.js
import { api } from "./client";

// 총괄 요약, 최근 풀이는 그대로…
export async function getSummary() {
  const r = await api.get("/stats/summary");
  return r.data;
}
export async function getAttempts(limit = 20) {
  const r = await api.get("/stats/attempts", { params: { limit } });
  return r.data;
}

// ✅ 카테고리 분포(도넛)
export async function getDistribution(categoryId = null) {
  const params = {};
  if (categoryId) params.category_id = Number(categoryId); // 이름 꼭 일치!
  const r = await api.get("/stats/distribution", { params });
  return r.data; // {labels:[], data:[]}
}

// ✅ 일일 학습량(막대)
export async function getDaily(days = 7, categoryId = null) {
  const params = { days };
  if (categoryId) params.category_id = Number(categoryId); // 이름 꼭 일치!
  const r = await api.get("/stats/daily", { params });
  return r.data; // {labels:["2025-10-12",…], data:[…]}
}
