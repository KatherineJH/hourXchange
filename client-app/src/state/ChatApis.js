// ChatApis.js
import api from "./Api";

export async function fetchChatRooms() {
    const res = await api.get("/api/chat/rooms"); // ❌ userId 안 넣어도 됨
    return res.data;
  }
