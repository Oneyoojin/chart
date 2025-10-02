// src/api/quiz.js
import { api } from "./client";

export async function getRandomQuiz() {
  const { data } = await api.get("/quizzes/random");
  return data; // { quiz_id, quiz_title, quiz_text, image_url, choices:[...] }
}
