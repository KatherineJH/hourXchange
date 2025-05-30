// src/layout/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { getList } from "../api/categoryApi";
import IamportButton from "../component/common/IamportButton.jsx";

const menu = [
  { text: "시간충전", to: "/payment/buy" },
  { text: "삽니다", to: "/product/buy" },
  { text: "팝니다", to: "/product/sell" },
  { text: "지역별", to: "/product/list" },
  { text: "커뮤니티", to: "/board/list" },
  { text: "기부모집", to: "/donation/list" },
  { text: "봉사해요", to: "/product/volunteer" },
  { text: "기부해요", to: "/product/donation" },
];

const Sidebar = () => {
  const [openRegion, setOpenRegion] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getList()
      .then((res) => setCategoryList(res.data.content))
      .catch((err) => console.error("카테고리 목록 조회 실패:", err));
  }, []);

  const handleCategoryChange = (e) => {
    const params = new URLSearchParams(location.search);
    if (e.target.value === "전체") {
      params.delete("category"); // "전체" 선택 시 쿼리 파라미터 제거
    } else {
      params.set("category", e.target.value);
    }
    navigate({ pathname: location.pathname, search: params.toString() });
  };

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
        <RadioGroup
          value={new URLSearchParams(location.search).get("category") || "전체"}
          onChange={handleCategoryChange}
        >
          <FormControlLabel value="전체" control={<Radio />} label="전체" />
          {categoryList.map((c) => (
            <FormControlLabel
              key={c.id}
              value={c.categoryName}
              control={<Radio />}
              label={c.categoryName}
            />
          ))}
        </RadioGroup>
      </Box>
    </Box>
  );
};

export default Sidebar;
