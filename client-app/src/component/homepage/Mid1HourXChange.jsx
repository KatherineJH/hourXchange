import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Mid1HourXChange() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        px: 4,
        py: 10,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* 왼쪽 텍스트 영역 */}
      <Box sx={{ maxWidth: 480 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            mb: 1,
            fontSize: "1.1rem",
          }}
        >
          따뜻한 시간 교류의 시작!
        </Typography>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          소중한 우리의 공간!
          <br className="d-md-none d-block" />
          HourXChange
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#666", lineHeight: 1.7, mb: 4 }}
        >
          HourXChange는 시간 나눔 기반의 새로운 교류 플랫폼으로,
          <br />
          봉사와 기부, 시간 거래를 통해
          <br />
          모두가 함께 성장할 수 있는 따뜻한 공간입니다.
        </Typography>

        <Button
          variant="outlined"
          onClick={() => navigate("/main")}
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            fontWeight: 600,
            borderRadius: "30px",
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "primary.main",
              color: "#fff",
            },
          }}
        >
          HourXChange란? → (홈페이지 바로가기)
        </Button>
      </Box>

      {/* motion 적용: 스크롤 등장 시 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }} // 한 번만 실행, 40% 보이면 발동
        transition={{ duration: 1 }}
        style={{
          position: "relative",
          width: 360,
          height: 360,
        }}
      >
        {/* 블롭 */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "120%",
            height: "120%",
            zIndex: 0,
          }}
        >
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%" }}
          >
            <path
              fill="#FE976D"
              d="M34,-41.6C46.8,-37.5,61.9,-31.2,70.2,-19.6C78.4,-7.9,79.8,9.3,76,25.8C72.2,42.4,63.2,58.5,49.6,66.1C36.1,73.7,18,72.9,0.7,71.9C-16.6,70.9,-33.2,69.7,-47.8,62.4C-62.4,55.1,-75.1,41.8,-72.7,28.5C-70.4,15.1,-53,1.8,-43,-9.3C-33,-20.5,-30.4,-29.3,-24.4,-35.7C-18.5,-42,-9.2,-45.9,0.7,-46.8C10.6,-47.7,21.2,-45.7,34,-41.6Z"
              transform="translate(100 100)"
            />
          </svg>
        </Box>

        {/* 캐릭터 이미지 */}
        <Box
          component="img"
          src="/hour2friends.png"
          alt="HourXChange 캐릭터"
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            zIndex: 1,
          }}
        />
      </motion.div>
    </Box>
  );
}

export default Mid1HourXChange;
