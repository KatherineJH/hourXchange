// src/components/ErrorPage.jsx

import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    console.error("Route Error:", error);
    return (
        <div style={{ padding: 24, textAlign: "center", color: "#a00" }}>
            <h2>앗! 페이지를 로드하는 중에 오류가 발생했습니다.</h2>
            <p>{error?.message || "알 수 없는 오류"}</p>
        </div>
    );
};

export default ErrorPage;
