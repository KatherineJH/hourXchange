import api from "./Api.js";

const apiServerUrl = "/api/payments/";

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