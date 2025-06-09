import api from "./Api.js";

const apiServerUrl = "/api/paymentItem/";

export const getList = async () => {
    const response = await api.get(apiServerUrl + 'list')

    return response;
};