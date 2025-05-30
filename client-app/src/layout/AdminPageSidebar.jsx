// src/layout/Sidebar.jsx
import React from "react";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const menu = [
  { text: "== 현황 ==" },
  { text: "결제현황", to: "/admin/payment" },
  { text: "결제금액현황", to: "/admin/paymentAmount" },
  { text: "서버요청현황", to: "/admin/user" },
  { text: "== 조회 ==" },
  { text: "기부모집조회", to: "/admin/donationList" },
  { text: "기부내역조회", to: "/admin/donationHistoryList" },
  { text: "유저조회", to: "/admin/userList" },
  { text: "카테고리조회", to: "/admin/categoryList" },
  { text: "거래기록조회", to: "/admin/transactionList" },
  { text: "주문내역조회", to: "/admin/orderList" },
  { text: "결제기록", to: "/admin/paymentList" },
  { text: "== 분석 마케팅 ==" },
  { text: "회원 관리 페이지 ", to: "/admin/userAnalysis" },
  { text: "매출 관리 페이지 ", to: "/admin/salesAnalysis" },
  { text: "기부 관리 페이지 ", to: "/admin/donationAnalysis" },
];

const Sidebar = () => {
  return (
    <Box component="nav" sx={{ p: 2 }}>
      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.text}
            component={RouterLink} // React Router <Link> 로 동작
            to={item.to} // 이동할 경로
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
