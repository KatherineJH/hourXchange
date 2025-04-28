// src/cponent/chat/Chat.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchChatRooms } from "../../api/chatApi";

function Chat() {
  const { user } = useSelector((state) => state.auth);
  const [chatRooms, setChatRooms] = useState([]);
  const [chatError, setChatError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchChatRooms(user.id)
        .then((rooms) => setChatRooms(rooms))
        .catch((err) => setChatError(err.message));
    }
  }, [user]);

  return (
    <>
      <h3>📋 참여 중인 채팅방</h3>
      {chatError && <p style={{ color: "red" }}>{chatError}</p>}
      {chatRooms.length === 0 ? (
        <p>입장 가능한 채팅방이 없습니다.</p>
      ) : (
        chatRooms.map((room) => (
          <button
            key={room.id}
            style={{ display: "block", margin: "10px 0", padding: "10px" }}
            onClick={() => navigate(`/chat-room/${room.id}`)}
          >
            🗨️ {room.name} (서비스 ID: {room.serviceProductId}) 입장
          </button>
        ))
      )}
    </>
  );
}

export default Chat;
