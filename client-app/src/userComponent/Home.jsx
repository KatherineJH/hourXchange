// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function Home() {
//     const [user, setUser] = useState(null);  // 로그인된 사용자 정보를 저장할 state

//     useEffect(() => {
//         // 컴포넌트가 마운트되면 백엔드에 사용자 정보를 요청
//         axios
//             .get("http://localhost:8282/api/auth/me", { withCredentials: true })  // 로그인된 사용자 정보 요청
//             .then((res) => {
//                 // 성공적으로 사용자 정보를 받으면 state에 저장
//                 setUser(res.data);
//             })
//             .catch((error) => {
//                 // API 요청이 실패하면 오류 메시지 출력
//                 console.error("API 요청 오류:", error);
//                 alert("로그인된 사용자 정보를 가져오지 못했습니다.");
//             });
//     }, []);  // 컴포넌트가 처음 렌더링될 때 한 번만 실행됨

//     return (
//         <div>
//             <h1>Home Page</h1>

//             {/* 로그인된 사용자 정보가 있을 경우 표시 */}
//             {user ? (
//                 <div>
//                     <h2>안녕하세요, {user.name}님!</h2>
//                     <p>아이디: {user.username}</p>
//                     <p>역할: {user.role}</p>
//                 </div>
//             ) : (
//                 <p>사용자 정보를 불러오는 중...</p>
//             )}

//             {/* 로그인 페이지로 리다이렉트 되는 버튼 */}
//             <button onClick={() => window.location.href = "/login"}>Go to Login</button>
//         </div>
//     );
// }

// export default Home;

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
