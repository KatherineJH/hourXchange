// src/components/common/LoadingSpinner.jsx

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "로딩 중입니다..." }) => {
    return (
        <Box
            sx={{
                position: "fixed",      // 화면 전체를 덮도록
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)", // 반투명 배경
                zIndex: 9999,           // 최상단 노출
                flexDirection: "column"
            }}
        >
            <CircularProgress />
            <Typography
                variant="body1"
                sx={{ marginTop: 2, color: "text.primary" }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default LoadingSpinner;
