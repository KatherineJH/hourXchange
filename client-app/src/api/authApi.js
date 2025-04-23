import api from "../state/Api.js";

const apiServerUrl = '/api/auth/';

export const postSave = async (data) => {
    const response = await api.post(apiServerUrl + "signup", data, {headers: {'Content-Type': 'application/json'}});
    return response;
}