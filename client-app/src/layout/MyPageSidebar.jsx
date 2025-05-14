// src/layout/MyPageSidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Collapse,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const menu = [
  { text: "내가 등록한 상품", to: "/myPage/myProducts" },
  { text: "나의 트랜잭션", to: "/myPage/my" },
  { text: "나의 게시글", to: "/myPage/myBoards" },
  { text: "찜 리스트", to: "/myPage/favorites" },
  { text: "나의 채팅 목록", to: "/myPage/chat" },
  { text: "내 지갑", to: "/myPage/wallet" },
];

const MyPageSidebar = () => {
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

export default MyPageSidebar;
