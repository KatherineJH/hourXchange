// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const EmailLoginForm = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         "http://localhost:8282/api/auth/login", // ✅ 올바른 엔드포인트
//         { username, password },
//         { withCredentials: true }
//       );

//       console.log("Response:", res); // 디버깅
//       alert("로그인 성공!");
//       navigate("/");
//     } catch (error) {
//       console.error("로그인 실패:", error);
//       alert("로그인에 실패했습니다. 다시 시도해 주세요.");
//     }
//   };

//   return (
//     <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
//       <h2>이메일 로그인</h2>
//       <form onSubmit={handleLogin}>
//         <div style={{ marginBottom: "1rem" }}>
//           <label>이메일 또는 아이디</label>
//           <br />
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="이메일 또는 아이디"
//             required
//             style={{ width: "100%", padding: "0.5rem" }}
//           />
//         </div>
//         <div style={{ marginBottom: "1rem" }}>
//           <label>비밀번호</label>
//           <br />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="비밀번호"
//             required
//             style={{ width: "100%", padding: "0.5rem" }}
//           />
//         </div>
//         <button
//           type="submit"
//           style={{
//             width: "100%",
//             padding: "0.75rem",
//             backgroundColor: "#1976d2",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//           }}
//         >
//           로그인
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EmailLoginForm;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../state/auth/Action";

const EmailLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email: username, password })).unwrap();
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>이메일 로그인</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label>이메일 또는 아이디</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이메일 또는 아이디"
            required
            style={{ width: "100%", padding: "0.5rem" }}
            disabled={isLoading}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>비밀번호</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
            style={{ width: "100%", padding: "0.5rem" }}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            opacity: isLoading ? 0.6 : 1,
          }}
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </div>
  );
};

export default EmailLoginForm;
