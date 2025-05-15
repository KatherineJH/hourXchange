// src/layout/Sidebar.jsx
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
import MyList from "../component/transaction/MyList";
import MyProductList from "../component/product/MyProductList";
import MyBoardList from "../component/board/MyBoardList";

const menu = [
  { text: "메뉴1", to: "/myPage/my-products" },
  { text: "메뉴2", to: "/myPage/my" },
  { text: "메뉴3", to: "/myPage/my-board" },
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
