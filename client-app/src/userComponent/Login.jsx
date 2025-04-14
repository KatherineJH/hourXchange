// import React from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const onNaverLogin = () => {
//     window.location.href = "http://localhost:8282/oauth2/authorization/naver";
//   };

//   const onGoogleLogin = () => {
//     window.location.href = "http://localhost:8282/oauth2/authorization/google";
//   };

//   const onEmailLogin = () => {
//     navigate("/email-login"); // ✅ EmailLoginForm 페이지로 이동
//   };

//   return (
//     <>
//       <h1>Login</h1>
//       <button onClick={onNaverLogin}>Naver Login</button>
//       <button onClick={onGoogleLogin}>Google Login</button>
//       <button onClick={onEmailLogin}>Email Login</button>
//     </>
//   );
// }

// export default Login;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
      {isAuthenticated && user ? (
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
