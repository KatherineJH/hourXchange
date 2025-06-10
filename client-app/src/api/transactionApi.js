import api from "./Api.js";

const apiServerUrl = "/api/transaction/";
const reviewApiUrl = "/api/reviews";

export const getList = async (page, size) => {
  const response = await api.get(apiServerUrl + "list", {
    params: {
      page,
      size,
    },
  });
  return response;
};

export const getSearch = async (page, size, params) => {
  const response = await api.get(apiServerUrl + "search/list", {
    params: {
      ...params,
      page,
      size,
    },
  });
  return response;
};

export const postSave = async (data) => {
  const response = await api.post(apiServerUrl, data, {
    headers: { "Content-Type": "application/json" },
  });

  return response;
};

export const getMyTransactionList = async () => {
  const response = await api.get(apiServerUrl + "my");
  return response;
};

export const getReviewById = async (reviewId) => {
  const response = await api.get(`${reviewApiUrl}/${reviewId}`);
  return response.data;
};

export const getAllReviews = async (page = 0, size = 10) => {
  console.log("getAllReviews 호출됨:", { page, size });
  const response = await api.get("/api/reviews/list", {
    params: { page, size },
  });
  console.log("응답 데이터:", response.data);
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`${reviewApiUrl}/${reviewId}`, reviewData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// 거래 상태 완료 처리
export const patchCompleteTransaction = async (transactionId) => {
  const response = await api.patch(`${apiServerUrl}complete/${transactionId}`);
  return response.data;
};

// ====================== 리뷰 관련 API ======================
export const postReview = async (reviewData) => {
  const response = await api.post(reviewApiUrl, reviewData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// 특정 유저가 받은 리뷰들의 태그 조회
export const getReviewTagsByReceiverId = async (userId) => {
  const response = await api.get(`${reviewApiUrl}/receiver/${userId}/tags`);
  return response.data;
};
export const getReviewListByReceiverId = async (userId) => {
  const response = await api.get(`${reviewApiUrl}/receiver/${userId}`);
  return response.data;
};
