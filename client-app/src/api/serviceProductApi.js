import api from "../state/Api.js";

const apiServerUrl = '/api/serviceProduct/';

export const getRead = async (id) => {
    const response = await api.get(apiServerUrl + id);
    return response;
}

export const getList = async () => {
    const response = await api.get(apiServerUrl + 'list');
    return response;
}

export const postSave = async (saveData) => {
    const response = await api.post(apiServerUrl, saveData, {headers: {'Content-Type': 'application/json'}});
    return response;
}

export const putUpdate = async (id, updateData) => {
    const response = await api.put(apiServerUrl + id, updateData, {headers: {'Content-Type': 'application/json'}});
    return response;
}