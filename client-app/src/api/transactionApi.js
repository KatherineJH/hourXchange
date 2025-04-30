import api from "../state/Api.js";

const apiServerUrl = '/api/transaction/';

export const postSave = async (data) => {
    const response = await api.post(apiServerUrl, data, {headers: {'Content-Type': 'application/json'}});

    return response;
}

export const getMyTransactionList = async () => {
    const response = await api.get(apiServerUrl + 'my');
    return response;
};