import api from "./Api.js";

// 단일 유저 등급 조회
export const getUserGrade = async (userId) => {
  console.log("getUserGrade 호출됨:", userId);
  const response = await api.get(`/api/user-grade/user/${userId}`);
  console.log("유저 등급 응답:", response.data);
  return response.data;
};

// 전체 유저 등급 조회
export const getAllUserGrades = async () => {
  console.log("getAllUserGrades 호출됨");
  const response = await api.get("/api/user-grade/all");
  console.log("전체 유저 등급 응답:", response.data);
  return response.data;
};

// 등급 예측 요청
export const predictUserGrade = async (userId) => {
  console.log("predictUserGrade 호출됨:", userId);
  const response = await api.post("/api/user-grade", {
    userId,
  });
  console.log("예측 응답:", response.data);
  return response.data;
};

// TimeSeries 예측
export const getForecast = async (historyData, periods = 7) => {
  // console.log("getForecast 호출됨:", historyData, `periods=${periods}`);
  const response = await api.post("/api/forecast", {
    history: historyData,
    periods, // Include prediction length
  });
  // console.log("시계열 예측 결과:", response.data);
  return response.data;
};

// 유저 특성 기반 기부 예측
export const predictDonation = async (features) => {
  const response = await api.post("/api/forecast/donation", features);
  return response.data;
};
export const simulateDonation = async (features, varName, valueRange) => {
  const response = await api.post("/api/forecast/donation", {
    simulate: true,
    user_input: features,
    var_name: varName,
    value_range: valueRange,
  });
  return response.data;
};
