// src/api/answer.js
import { api } from "./client";

export async function submitAnswer({ quiz_id, choice_id, attempt_no = 0 }) {
  const { data } = await api.post("/answers", { quiz_id, choice_id, attempt_no });
  return data; // { correct, correct_choice_id, explanation? }
}
