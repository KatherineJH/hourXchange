import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../state/auth/Action";

function Home() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !isLoading && !error) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, isLoading, error]);

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
