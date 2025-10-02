// src/api/stats.js
import { api } from "./client";

export async function getSummary() {
  const { data } = await api.get("/stats/summary");
  return data; // { totalAnswered, correctCount, accuracy }
}

export async function getAttempts(limit = 20) {
  const { data } = await api.get("/stats/attempts", { params: { limit } });
  return data; // [{ id, quiz_id, quiz_title, selected, correct, answered_at }, ...]
}
