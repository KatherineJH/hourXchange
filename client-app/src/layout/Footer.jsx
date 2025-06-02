// src/layout/Footer.jsx
import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "primary.main",
        backgroundImage: `
      linear-gradient(45deg, #F5F5DC 25%, transparent 25%),
      linear-gradient(-45deg,  #F5F5DC 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #fff3e0 75%),
      linear-gradient(-45deg, transparent 75%, #fff3e0 75%)
    `,
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        py: 4, // 여유 있는 상하 여백
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          width: "90%",
        }}
      >
        <Card
          sx={{
            flex: "1 1 300px",
            maxWidth: "48%",
            minWidth: "250px",
            backgroundColor: "third.main",
            boxShadow: 1,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="body2">개인정보처리방침</Typography>
            <Typography variant="body2">이메일주소무단수집거부</Typography>
            <Typography variant="body2">이용약관</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: "1 1 300px",
            maxWidth: "48%",
            minWidth: "250px",
            backgroundColor: "third.main",
            boxShadow: 1,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="body2">
              서울특별시 서초구 서초대로74길 33
            </Typography>
            <Typography variant="body2">TEL : 02-3472-6924</Typography>
            <Typography variant="body2">
              © 2025 HourXchange. All rights reserved.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Footer;
