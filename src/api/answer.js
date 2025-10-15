import { api } from "./client";

export async function submitAnswer({ quiz_id, choice_id, attempt_no = 0 }) {
  const res = await api.post("/answers/", {
    quiz_id: Number(quiz_id),
    choice_id: Number(choice_id),
    attempt_no: Number(attempt_no),
  });
  return res.data;
}
