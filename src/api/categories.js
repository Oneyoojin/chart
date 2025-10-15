import { api } from "./client";

export async function fetchCategories() {
  const res = await api("/categories/");       // 또는 "/categories" (백엔드에 맞추기)
  console.log("[/categories] res =", res);     // 실제 구조 한 번 확인
  // 배열 그대로 내려오면 res가 배열, {data:[...]} 형태면 res.data가 배열
  const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
  return list;
}
