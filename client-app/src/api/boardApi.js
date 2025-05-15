// src/api/boardApi.js
import api from "./Api.js";

// 게시글 저장 (새로 추가할 API)
export const createBoard = async (boardData) => {
  console.log("📌 createBoard 호출됨:", boardData);
  const response = await api.post("/api/board/", boardData);
  console.log("✅ 게시글 작성 응답 데이터:", response.data);
  return response.data;
};

// 게시글 수정 (id로 수정)
export const updateBoard = async (id, boardData) => {
  console.log("📌 updateBoard 호출됨:", { id, boardData });
  const response = await api.put(`/api/board/${id}`, boardData);
  console.log("✅ 게시글 수정 응답 데이터:", response.data);
  return response.data;
};

// 전체 게시글 불러오기 (페이지네이션 포함)
export const getAllBoards = async (page = 0, size = 10) => {
  console.log("📌 getAllBoards 호출됨:", { page, size });
  const response = await api.get("/api/board/all", {
    params: { page, size },
  });
  console.log("✅ 응답 데이터:", response.data);
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
  console.log("📌 Board get by Id 호출됨:", { id });
  const response = await api.get(`/api/board/${id}`);
  console.log("✅ 응답 데이터:", response.data);
  return response.data;
};

// 추천 검색어 불러오기
export const getAutocompleteSuggestions = async (prefix) => {
  const response = await api.get("/api/search/autocomplete", {
    params: {
      prefix,
      index: "board_index",
    },
  });
  return response.data;
};

// 좋아요 토글 (게시글 좋아요)
export const updateBoardLike = async (id) => {
  const response = await api.put(`/api/board/${id}/thumbs-up`);
  return response.data;
};

export const getMyBoardList = async () => {
  const response = await api.get("/api/board/my-board");
  return response;
};
