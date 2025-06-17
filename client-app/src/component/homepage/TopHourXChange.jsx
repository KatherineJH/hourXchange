import { Box, Button } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Typed from "typed.js";

function TopHourXChange() {
  const typedRef = useRef(null);
  const typedInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    typedInstance.current = new Typed(typedRef.current, {
      strings: ["당신의 시간,<br>가장 따뜻한 기부가 됩니다<br>HourXChange"],
      typeSpeed: 40,
      backSpeed: 20,
      loop: false,
      showCursor: false,
    });

    return () => {
      typedInstance.current?.destroy();
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "third.main", // MUI theme에서 정의한 색상
        height: 600,
        overflow: "hidden",
      }}
    >
      <img
        src="/hourFriends.png"
        alt="HourXChange 캐릭터들"
        style={{
          width: 250,
          height: 170,
          marginBottom: 16,
        }}
      />

      {/* 타이핑 텍스트 */}
      <div
        ref={typedRef}
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5em)",
          color: "#f07b5a",
          fontFamily: "Gamja Flower",
          textAlign: "center",
          lineHeight: 1.5,
          whiteSpace: "pre-line",
          minHeight: "5em",
        }}
      />

      {/* 홈으로 가기 */}
      <Button
        size="large"
        variant="contained"
        sx={{ mr: 2 }}
        onClick={() => navigate("/main")}
      >
        홈페이지 살펴보기
      </Button>
    </Box>
  );
}

export default TopHourXChange;
