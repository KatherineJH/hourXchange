import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../state/auth/Action";

import { useNavigate } from "react-router-dom";
import { fetchChatRooms } from "../state/ChatApis";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [chatRooms, setChatRooms] = useState([]);
  const [chatError, setChatError] = useState(null);

  useEffect(() => {
    if (!user && !isLoading && !error) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, isLoading, error]);

  useEffect(() => {
    if (user) {
      fetchChatRooms(user.id)
        .then((rooms) => {
          console.log("📦 chatRooms 응답:", rooms);
          setChatRooms(rooms);
        })
        .catch((err) => setChatError(err.message));
    }
  }, [user]);

  return (
    <div>
      <h1>Home Page</h1>

      {isLoading ? (
        <p>사용자 정보를 불러오는 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>
          로그인된 사용자 정보를 가져오지 못했습니다: {error}
        </p>
      ) : user ? (
        <div>
          <h2>안녕하세요, {user.name}님!</h2>
          <p>아이디: {user.username}</p>
          <p>역할: {user.role}</p>

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
        </div>
      ) : (
        <p>로그인되지 않았습니다.</p>
      )}

      <button onClick={() => (window.location.href = "/login")}>
        Go to Login
      </button>
    </div>
  );
}

export default Home;
