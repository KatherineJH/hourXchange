import api from "./Api.js";

const apiServerUrl = "/api/transaction/";
const reviewApiUrl = "/api/reviews";

export const getList = async () => {
  const response = await api.get(apiServerUrl + "list");
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


// 리뷰
export const postReview = async (reviewData) => {
  const response = await api.post(reviewApiUrl, reviewData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};