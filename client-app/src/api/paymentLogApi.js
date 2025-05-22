import api from "./Api.js";

const apiServerUrl = "/api/payments/";

// 결제 건수 조회
export const getDaily = async () => {
  const response = await api.get(apiServerUrl + "daily");
  return response;
};

export const getWeekly = async () => {
  const response = await api.get(apiServerUrl + "weekly");
  return response;
};

export const getMonthly = async () => {
  const response = await api.get(apiServerUrl + "monthly");
  return response;
};

export const getYearly = async () => {
  const response = await api.get(apiServerUrl + "yearly");
  return response;
};

// — 금액 합계 조회 —
export const getDailyAmount = async () => {
  const response = await api.get(apiServerUrl + "daily/amount");
  return response;
};

export const getWeeklyAmount = async () => {
  const response = await api.get(apiServerUrl + "weekly/amount");
  return response;
};

export const getMonthlyAmount = async () => {
  const response = await api.get(apiServerUrl + "monthly/amount");
  return response;
};

export const getYearlyAmount = async () => {
  const response = await api.get(apiServerUrl + "yearly/amount");
  return response;
};

// — 아이템별 비율 조회 —
export const getItemRatio = async () => {
  const response = await api.get(apiServerUrl + "items/ratio");
  return response;
};

// 특정 기간 내 결제 건수 조회
export const getPaymentCountByRange = async (from, to) => {
  const response = await api.get(apiServerUrl + "range", {
    params: { from, to },
  });
  // console.log("특정 기간 내 결제 건수 조회:", response.data);
  return response;
};
