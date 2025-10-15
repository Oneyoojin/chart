import { api } from "./client";

const SELECTED_CATEGORY_KEY = "selected_category_id";

export function setSelectedCategoryId(categoryId) {
  localStorage.setItem(SELECTED_CATEGORY_KEY, String(categoryId));
}
export function getSelectedCategoryId() {
  const v = localStorage.getItem(SELECTED_CATEGORY_KEY);
  return v ? Number(v) : null;
}

export async function getRandomQuiz() {
  const cid = getSelectedCategoryId();
  const res = await api.get("/quizzes/random/", {
    params: cid ? { category_id: cid } : undefined,
  });
  return res.data;
}
