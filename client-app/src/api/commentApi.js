// src/api/commentApi.js
import api from "./Api.js";

// 📌 댓글 작성
export const createComment = async (commentData) => {
  console.log("📌 createComment 호출됨:", commentData);
  const response = await api.post("/api/comment/", commentData);
  console.log("✅ 응답 데이터:", response.data);
  return response.data;
};

// 📌 특정 댓글 조회 (id로 조회)
export const getCommentById = async (id) => {
  console.log("📌 getCommentById 호출됨:", id);
  const response = await api.get(`/api/comment/${id}`);
  console.log("✅ 응답 데이터:", response.data);
  return response.data;
};

// 📌 게시글에 달린 모든 댓글 조회 (boardId로 조회)
export const getCommentsByBoardId = async (boardId) => {
  console.log("📌 getCommentsByBoardId 호출됨:", boardId);
  const response = await api.get(`/api/comment/board/${boardId}`);
  console.log("게시글에 달린 모든 댓글:", response.data);
  return response.data;
};

// 📌 댓글 수정
export const updateComment = async (id, commentData) => {
  console.log("📌 updateComment 호출됨:", { id, commentData });
  const response = await api.put(`/api/comment/${id}`, commentData);
  console.log("✅ 댓글 수정 응답 데이터:", response.data);
  return response.data;
};
