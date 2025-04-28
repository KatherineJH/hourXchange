// src/api/boardApi.js
import api from "../state/Api";

// 전체 게시글 불러오기 (페이지네이션 포함)
export const getAllBoards = async (page = 0, size = 10) => {
  const response = await api.get("/api/board/all", {
    params: { page, size },
  });
  return response.data;
};

// 📌 게시판 검색 (keyword, page, size로 검색)
export const searchBoards = async (keyword, page = 0, size = 10) => {
  const response = await api.get("/api/search/boards", {
    params: { keyword, page, size },
  });
  return response.data;
};

// 📌 게시판 상세 조회 (id로 조회)
export const getBoardDetail = async (id) => {
  const response = await api.get(`/api/board/${id}`);
  return response.data;
};

// 추천 검색어 불러오기
export const getAutocompleteSuggestions = async (keyword) => {
  const response = await api.get("/api/search/autocomplete", {
    params: { keyword },
  });
  return response.data;
};
