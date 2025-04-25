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

const Sidebar = () => {
  const [openRegion, setOpenRegion] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (text) => {
    if (text === "커뮤니티") {
      navigate("/board/list"); // 게시판으로 이동
    }
  };

  return (
    <Box component="nav" sx={{ p: 2 }}>
      <List>
        {["삽니다", "팝니다", "봉사해요", "커뮤니티"].map((text) => (
          <ListItemButton key={text} onClick={() => handleMenuClick(text)}>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <ListItemButton onClick={() => setOpenRegion(!openRegion)}>
        <ListItemText primary="📍 지역" />
      </ListItemButton>
      <Collapse in={openRegion} timeout="auto" unmountOnExit>
        <RadioGroup defaultValue="서울" sx={{ p: 2 }}>
          {[
            "서울",
            "강원도",
            "경기도",
            "충청도",
            "전라도",
            "경상도",
            "제주도",
          ].map((r) => (
            <FormControlLabel key={r} value={r} control={<Radio />} label={r} />
          ))}
        </RadioGroup>
      </Collapse>

      <Divider sx={{ my: 2 }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          🗂️ 카테고리
        </Typography>
        <RadioGroup defaultValue="운동">
          {["운동", "음악", "청소"].map((c) => (
            <FormControlLabel key={c} value={c} control={<Radio />} label={c} />
          ))}
        </RadioGroup>
      </Box>
    </Box>
  );
};

export default Sidebar;
