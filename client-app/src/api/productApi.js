import api from "./Api.js";

const apiServerUrl = "/api/product/";

export const getRead = async (id) => {
  const response = await api.get(apiServerUrl + id);
  return response;
};

// 전체 리스트
export const getList = async (page, size) => {
  const response = await api.get(apiServerUrl + "list/all", {
    params: { page, size },
  });
  return response;
};

// 필터링된 리스트: SELLER, BUYER
export const getFilteredList = (page, size, providerType) => {
  return api.get(apiServerUrl + "list", {
    params: { page, size, providerType },
  });
};

export const getListWithBounds = async (position) => {
  console.log(position);
  const response = await api.get(apiServerUrl + "listMap", {
    params: {
      swLat: position.swLat,
      swLng: position.swLng,
      neLat: position.neLat,
      neLng: position.neLng,
    },
  });
  return response;
};

export const postSave = async (saveData) => {
  const response = await api.post(apiServerUrl, saveData, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

export const putUpdate = async (id, updateData) => {
  const response = await api.put(apiServerUrl + id, updateData, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

export const getFavoriteList = async () => {
  const response = await api.get(apiServerUrl + "favorite/list");
  return response;
};

export const postFavorite = async (productId) => {
  const response = await api.post(apiServerUrl + "favorite/" + productId);
  return response;
};

// 추천 검색어 불러오기
export const getAutocompleteSuggestions = async (prefix) => {
  const response = await api.get("/api/search/autocomplete", {
    params: {
      prefix,
      index: "product_index",
    },
  });
  return response;
};

// 게시판 검색 (keyword, page, size로 검색)
export const getListWithKeyword = async (keyword, page = 0, size = 10) => {
  const response = await api.get("/api/search/products", {
    params: { keyword, page, size },
  });
  return response;
};

// 나의 상품 목록 조회 (페이지네이션 포함)
export const getMyProductList = async (page = 0, size = 10) => {
  const response = await api.get("/api/product/my", {
    params: { page, size },
  });
  return response.data;
};

// 나의 키워드 불러오기
export const getUserTags = async (userId) => {
  const response = await api.get(apiServerUrl + `user/${userId}/tags`);
  return response.data;
};
// 상품 태그 불러오기
export const getProductTags = async (productId) => {
  const response = await api.get(apiServerUrl + `${productId}/tags`);
  return response.data;
};
