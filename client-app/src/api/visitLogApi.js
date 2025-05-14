import api from "./Api.js";

const apiServerUrl = "/api/visits/";

// 요청 횟수 집계
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

// 고유 사용자 수(UV) 집계
export const getDailyUnique = async () => {
    const response = await api.get(apiServerUrl + "daily/unique");
    return response;
};

export const getWeeklyUnique = async () => {
    const response = await api.get(apiServerUrl + "weekly/unique");
    return response;
};

export const getMonthlyUnique = async () => {
    const response = await api.get(apiServerUrl + "monthly/unique");
    return response;
};

export const getYearlyUnique = async () => {
    const response = await api.get(apiServerUrl + "yearly/unique");
    return response;
};
