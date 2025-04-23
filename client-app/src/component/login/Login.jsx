import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );

  const onNaverLogin = () => {
    window.location.href = "http://localhost:8282/oauth2/authorization/naver";
  };

  const onGoogleLogin = () => {
    window.location.href = "http://localhost:8282/oauth2/authorization/google";
  };

  const onEmailLogin = () => {
    navigate("/email-login");
  };

  return (
    <div>
      <h1>Login</h1>
      {isLoading ? (
        <p>로그인 상태 확인 중...</p>
      ) : isAuthenticated && user?.name ? (
        <p>이미 로그인된 사용자: {user.name}</p>
      ) : (
        <>
          <button onClick={onNaverLogin}>Naver Login</button>
          <button onClick={onGoogleLogin}>Google Login</button>
          <button onClick={onEmailLogin}>Email Login</button>
        </>
      )}
    </div>
  );
}

export default Login;
