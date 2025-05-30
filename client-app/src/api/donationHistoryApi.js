import api from "./Api.js";

const apiServerUrl = "/api/donationHistory/";

export const postDonationHistory = async (data) => {
  const response = await api.post(apiServerUrl, data);

  return response;
};

export const getMyDonationHistory = async () => {
  const response = await api.get(apiServerUrl + "my");

  return response;
};

export const getDonationHistory = async (page, size) => {
    const response = await api.get(apiServerUrl + 'list', {params: {page, size}});

  return response;
};

export const getTopDonators = async (period) => {
  const response = await api.get(apiServerUrl + `topDonator?period=${period}`);
  return response;
};

// 특정 기간 내 날짜별 기부 횟수 조회
export const getDonationPayByRange = async (from, to) => {
  const response = await api.get(apiServerUrl + "range", {
    params: { from, to },
  });
  // console.log("기간 내 기부 횟수 조회:", response.data);
  return response;
};
// 특정 기간 내 날짜별 기부 금액 조회
export const getDonationAmountByRange = async (from, to) => {
  const response = await api.get(apiServerUrl + "range/amount", {
    params: { from, to },
  });
  // console.log("기간 내 기부 금액 조회:", response.data);
  return response;
};


