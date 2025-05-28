// src/layout/Sidebar.jsx
import React, { useState } from "react";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const menu = [
  { text: "결제횟수", to: "/admin/payment" },
  { text: "결제금액", to: "/admin/paymentAmount" },
  { text: "유저접속현황", to: "/admin/user" },
  { text: "기부모집리스트", to: "/admin/donation/list" },
  { text: "기부모집내역", to: "/admin/donationHistoryList" },
  { text: "광고리스트,", to: "/admin/advertisement/list" },
  { text: "== 분석 마케팅 ==" },
  { text: "회원 관리 페이지 ", to: "/admin/userAnalysis" },
  { text: "매출 분석 페이지 ", to: "/admin/salesAnalysis" },
  { text: "기부 분석 페이지 ", to: "/admin/donationAnalysis" },
];

const Sidebar = (onClickAny) => {
  return (
    <Box
      component="nav"
      sx={{ p: 2 }}
      onClick={typeof onClickAny === "function" ? onClickAny : undefined}
    >
      <List>
        {menu.map((item) => (
          <ListItemButton key={item.text} component={RouterLink} to={item.to}>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
