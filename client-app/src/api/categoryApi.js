import api from "../state/Api.js";

const apiServerUrl = "/api/category/";

export const getRead = async (id) => {
  const response = await api.get(apiServerUrl + id);
  return response;
};

export const getList = async () => {
  const response = await api.get(apiServerUrl + "list");
  return response;
};
