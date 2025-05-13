import api from "./Api.js";

const apiServerUrl = "/api/pay/";

export const postTransaction = async (data) => {
    console.log(data);
    const response = await api.post(apiServerUrl + 'iamport/transaction', data)

    return response;
};