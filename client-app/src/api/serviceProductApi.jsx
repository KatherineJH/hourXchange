import api from "../state/Api.js";

export const readGet = async (id) => {
    const response = await api.get("/api/serviceProduct/" + id);
    return response.data;
}