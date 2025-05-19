// src/api/chatApi.js
import api from "./Api.js";

export async function sendMessage(message, sessionId) {
    const response = await api.post('/api/dialogflow/query', { message, sessionId });
    return response.data; // { fulfillmentText, sessionId }
}
