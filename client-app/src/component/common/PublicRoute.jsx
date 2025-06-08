// src/routes/PublicRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function PublicRoute({ children }) {
    const { user, loading } = useSelector((state) => state.auth);

    // 사용자 정보 로딩 중일 때
    if (loading) {
        return <LoadingSpinner />;
    }

    // 이미 로그인된 상태라면, 홈(“/”)으로 리다이렉트
    if (user && user.email) {
        return <Navigate to="/" replace />;
    }

    // 로그인 상태가 아니면 자식 컴포넌트(로그인·회원가입 페이지) 렌더링
    return children;
}
