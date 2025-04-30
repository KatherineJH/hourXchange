import api from "../state/Api.js";

const apiServerUrl = "/api/transaction/";
const reviewApiUrl = "/api/reviews";

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

// 리뷰
export const postReview = async (reviewData) => {
    const response = await api.post(reviewApiUrl, reviewData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
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