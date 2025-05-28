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
  { text: "나의 기부 내역", to: "/myPage/donation" },
  { text: "찜 리스트", to: "/myPage/favorites" },
  { text: "나의 채팅 목록", to: "/myPage/chat" },
  { text: "내 지갑", to: "/myPage/wallet" },
];

const MyPageSidebar = (onClickAny) => {
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

export default MyPageSidebar;
