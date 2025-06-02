import api from "./Api.js";

const apiServerUrl = "/api/user/";

// 전체 사용자 정보 가져오기
export const getAllUsers = async () => {
  const response = await api.get(apiServerUrl + "all");
  return response.data;
};

// 사용자 ID로 정보 가져오기(어드민)
export const getUserById = async (id) => {
  const response = await api.get(apiServerUrl + id);
  return response.data;
};

// 사용자 ID로 정보 가져오기(유저)
export const getMyInfo = async () => {
  const response = await api.get(apiServerUrl + "me");
  return response.data;
};

export const getUserList = async (page, size) => {
  const response = await api.get(apiServerUrl + 'list', {params: {page, size}});
  return response;
}

export const getSearch = async (page, size, params) => {
  const response = await api.get(apiServerUrl + "search/list", {
    params: {
      ...params,
      page,
      size
    }
  });
  return response;
};