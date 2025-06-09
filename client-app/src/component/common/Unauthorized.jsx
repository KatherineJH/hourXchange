// src/components/common/Unauthorized.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div style={{ padding: 40, textAlign: "center", color: "#d32f2f" }}>
            <h1>403 - 접근 거부</h1>
            <p>이 페이지를 볼 수 있는 권한이 없습니다.</p>
            <div style={{ marginTop: 24 }}>
                <button onClick={handleGoHome} style={{ marginRight: 12, padding: "8px 16px" }}>
                    홈으로
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
