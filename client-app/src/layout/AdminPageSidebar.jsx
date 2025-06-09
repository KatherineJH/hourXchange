// src/layout/Sidebar.jsx
import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const menuGroups = [
  {
    label: "현황 차트",
    children: [
      { text: "결제현황", to: "/admin/payment" },
      { text: "결제금액현황", to: "/admin/paymentAmount" },
      { text: "서버요청현황", to: "/admin/user" },
    ],
  },
  {
    label: "조회 및 수정",
    children: [
      { text: "기부모집조회", to: "/admin/donationList" },
      { text: "기부내역조회", to: "/admin/donationHistoryList" },
      { text: "유저조회", to: "/admin/userList" },
      { text: "거래기록조회", to: "/admin/transactionList" },
      { text: "주문내역조회", to: "/admin/orderList" },
      { text: "결제내역조회", to: "/admin/paymentList" },
      { text: "카테고리조회", to: "/admin/categoryList" },
      { text: "광고리스트", to: "/admin/advertisement/list" },
    ],
  },
  {
    label: "분석 마케팅",
    children: [
      { text: "회원 분석 페이지", to: "/admin/userAnalysis" },
      { text: "매출 예측 페이지", to: "/admin/salesAnalysis" },
      { text: "기부 예측 페이지", to: "/admin/donationAnalysis" },
    ],
  },
];

function Sidebar({ onClickAny }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <Box component="nav" sx={{ p: 2, pt: { xs: 10, md: 2 } }}>
      <List>
        {menuGroups.map((group) => (
          <React.Fragment key={group.label}>
            <ListItemButton onClick={() => toggleSection(group.label)}>
              <ListItemText
                primary={
                  <Typography fontWeight="bold">📂 {group.label}</Typography>
                }
              />
              {openSections[group.label] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse
              in={openSections[group.label]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding sx={{ pl: 2 }}>
                {group.children.map((item) => (
                  <ListItemButton
                    key={item.text}
                    component={RouterLink}
                    to={item.to}
                    onClick={onClickAny}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
