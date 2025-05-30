import api from "./Api.js";

const apiServerUrl = "/api/category/";

export const getRead = async (id) => {
  const response = await api.get(apiServerUrl + id);
  return response;
};

export const getList = async (page, size) => {
  const response = await api.get(apiServerUrl + "list", {
    params: {
      page,
      size,
    }
  });
  return response;
};
