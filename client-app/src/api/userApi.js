import api from "./Api.js";

const apiServerUrl = "/api/user/";

// 전체 사용자 정보 가져오기
export const getAllUsers = async () => {
  const response = await api.get(apiServerUrl + "all");
  return response.data;
};

// 사용자 ID로 정보 가져오기
export const getUserById = async (id) => {
  const response = await api.get(apiServerUrl + id);
  return response.data;
};
