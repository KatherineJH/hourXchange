import api from "./Api.js";

// 단일 유저 등급 조회
export const getUserGrade = async (userId) => {
  console.log("📌 getUserGrade 호출됨:", userId);
  const response = await api.get(`/api/user-grade/user/${userId}`);
  console.log("✅ 유저 등급 응답:", response.data);
  return response.data;
};

// 전체 유저 등급 조회
export const getAllUserGrades = async () => {
  console.log("📌 getAllUserGrades 호출됨");
  const response = await api.get("/api/user-grade/all");
  console.log("✅ 전체 유저 등급 응답:", response.data);
  return response.data;
};

// 등급 예측 요청
export const predictUserGrade = async (userId) => {
  console.log("📌 predictUserGrade 호출됨:", userId);
  const response = await api.post("/api/user-grade", {
    userId,
  });
  console.log("✅ 예측 응답:", response.data);
  return response.data;
};
