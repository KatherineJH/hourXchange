// page/Homepage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../state/auth/Action";
import { useNavigate } from "react-router-dom";
import Chat from "../chat/Chat";
import { fetchChatRooms } from "../../api/chatApi";

function Homepage() {
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
        .then((rooms) => setChatRooms(rooms))
        .catch((err) => setChatError(err.message));
    }
  }, [user]);

  return (
    <>
      <div>
        <h1>🏠 Home Page</h1>
        {isLoading ? (
          <p>사용자 정보를 불러오는 중...</p>
        ) : error ? (
          <p style={{ color: "red" }}>
            사용자 정보 조회 실패:{" "}
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        ) : user ? (
          <>
            <h2>안녕하세요, {user.name}{user.id}님!</h2>
            <p>아이디: {user.username}</p>
            <p>역할: {user.role}</p>

            {/* ✅ Chat 컴포넌트로 분리 */}
            <Chat
              chatRooms={chatRooms}
              chatError={chatError}
              navigate={navigate}
            />
          </>
        ) : (
          <p>로그인되지 않았습니다.</p>
        )}
      </div>
    </>
  );
}

export default Homepage;
