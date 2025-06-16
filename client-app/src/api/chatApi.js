// chatApi.js
import api from "./Api.js";

export async function fetchChatRooms() {
  const res = await api.get("/api/chat/rooms"); // userId 안 넣어도 됨
  return res.data;
}

// 채팅방 생성 (상품 상세에서 "채팅하기" 눌렀을 때)
export async function initiateChat(postId, requesterId) {
  const res = await api.post(
    `/api/chat/initiate/${postId}?requesterId=${requesterId}`
  );
  return res.data; // { id, name } 형태의 ChatRoomDTO 반환
}

// 채팅방 안에서 거래성사(?) 버튼 눌렀을 때
export async function matchTransaction(chatRoomId) {
  const res = await api.patch(`/api/chat/match/${chatRoomId}`);
  return res.data;
}

// 요청 버튼 클릭 시 호출
export async function requestTransaction(chatRoomId) {
  const res = await api.patch(`/api/chat/request/${chatRoomId}`);
  return res.data;
}

// 수락 버튼 클릭 시 호출
export async function acceptTransaction(chatRoomId) {
  const res = await api.patch(`/api/chat/accept/${chatRoomId}`);
  return res.data;
}

// 채팅방 정보 가져오기 (거래 상태, 오너 ID)
export async function fetchChatRoomInfo(chatRoomId) {
  const res = await api.get(`/api/chat/room-info/${chatRoomId}`);
  console.log("채팅방 상세정보:", res.data); // 로깅 추가
  return res.data; // { chatRoomId, ownerId, transactionStatus } 형태
}

// 채팅방의 이전 메시지 불러오기
export async function fetchChatMessages(chatRoomId) {
  const res = await api.get(`/api/chat/messages/${chatRoomId}`);
  return res.data; // ChatMessageResponse[] 형태
}