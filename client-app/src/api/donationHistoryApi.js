import api from "./Api.js";

const apiServerUrl = "/api/donationHistory/";

export const postDonationHistory = async (data) => {
    const response  = await api.post(apiServerUrl, data);

    return response
}

export const getMyDonationHistory = async () => {
    const response  = await api.get(apiServerUrl + 'my');

    return response
}

export const getDonationHistory = async () => {
    const response  = await api.get(apiServerUrl);

    return response
}


export const getTopDonators = async (period) => {
    const response = await api.get(apiServerUrl + `topDonator?period=${period}`);
    return response
}