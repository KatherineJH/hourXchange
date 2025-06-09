import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { getList } from "../api/categoryApi";

function CategoryNav() {
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
      params.delete("category");
    } else {
      params.set("category", e.target.value);
    }
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 1,
        bgcolor: "background.paper",
        borderBottom: "none",
        flexWrap: "wrap",
      }}
    >
      <Typography variant="subtitle2" sx={{ mr: 2 }}>
        {/* 🗂️ 카테고리 */}
      </Typography>
      <RadioGroup
        row
        value={new URLSearchParams(location.search).get("category") || "전체"}
        onChange={handleCategoryChange}
        sx={{ gap: 1 }}
      >
        <FormControlLabel
          value="전체"
          control={<Radio size="small" />}
          label="전체"
        />
        {categoryList.map((c) => (
          <FormControlLabel
            key={c.id}
            value={c.categoryName}
            control={<Radio size="small" />}
            label={c.categoryName}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}

export default CategoryNav;
