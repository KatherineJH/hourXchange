// src/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Stack,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useTheme } from "@mui/material/styles";

import StoreIcon from "@mui/icons-material/Store";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ForumIcon from "@mui/icons-material/Forum";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

const menuItems = [
  {
    text: "홈으로",
    icon: <HomeIcon color="action" fontSize="large" />,
    to: "/main",
  },
  {
    text: "재능나눔",
    icon: <StoreIcon color="primary" fontSize="large" />,
    subMenu: [
      { text: "전체 보기", to: "/product/all" },
      { text: "삽니다", to: "/product/buy" },
      { text: "팝니다", to: "/product/sell" },
    ],
  },
  {
    text: "시간충전",
    icon: <AccessTimeIcon color="secondary" fontSize="large" />,
    to: "/payment/buy",
  },
  {
    text: "지역별",
    icon: <LocationOnIcon color="action" fontSize="large" />,
    to: "/product/list",
  },
  {
    text: "커뮤니티",
    icon: <ForumIcon color="disabled" fontSize="large" />,
    to: "/board/list",
  },
  {
    text: "기부 참여",
    icon: <VolunteerActivismIcon color="error" fontSize="large" />,
    subMenu: [
      { text: "기부모집", to: "/donation/list" },
      { text: "기부해요", to: "/product/donation" },
    ],
  },
  {
    text: "봉사해요",
    icon: <EmojiPeopleIcon color="warning" fontSize="large" />,
    to: "/product/volunteer",
  },
];

function Navbar({ onClickAny, forceCloseMenu }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // 960px 이하
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleClick = (event, menuKey) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(menuKey);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const handleMenuAndDrawerClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
    if (typeof onClickAny === "function") {
      onClickAny(); // ← Drawer 닫히게
    }
  };
  useEffect(() => {
    if (forceCloseMenu) {
      setAnchorEl(null);
      setActiveMenu(null);
    }
  }, [forceCloseMenu]);

  return (
    <Box>
      {isMobile ? (
        <Stack spacing={2} alignItems="center" sx={{ mt: 15 }}>
          {menuItems.map((item) => (
            <Paper
              key={item.text}
              elevation={2}
              onClick={(e) => {
                if (item.subMenu) {
                  handleClick(e, item.text);
                } else {
                  navigate(item.to);
                  if (typeof onClickAny === "function") onClickAny(); // <— Drawer 닫기
                }
              }}
              sx={{
                width: "50%",
                p: 2,
                borderRadius: 3,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: "third.main",
                transition: "0.2s",
                "&:hover": { bgcolor: "secondary.main" },
              }}
            >
              {item.icon}
              <Typography variant="subtitle2" mt={1}>
                {item.text}
              </Typography>
              {item.subMenu && activeMenu === item.text && (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && activeMenu === item.text}
                  onClose={handleMenuAndDrawerClose}
                  PaperProps={{
                    sx: {
                      bgcolor: "third.main", // 카드와 동일한 배경
                      borderRadius: 2,
                      boxShadow: 3,
                      width: anchorEl?.offsetWidth, // 카드와 동일한 너비
                      "& .MuiMenuItem-root": {
                        color: theme.palette.text.primary,
                        "&:hover": { bgcolor: "secondary.main" },
                      },
                    },
                  }}
                >
                  {item.subMenu.map((sub) => (
                    <MenuItem
                      key={sub.text}
                      onClick={() => {
                        handleMenuAndDrawerClose();
                        navigate(sub.to);
                      }}
                    >
                      {sub.text}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Paper>
          ))}
        </Stack>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {menuItems.map((item) => (
            <Grid item xs={4} sm={2} md={1.7} key={item.text}>
              <Paper
                elevation={2}
                onClick={(e) =>
                  item.subMenu ? handleClick(e, item.text) : navigate(item.to)
                }
                sx={{
                  px:4,
                  py: 1,
                  borderRadius: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: "third.main",
                  transition: "0.2s",
                  "&:hover": { bgcolor: "secondary.main" },
                }}
              >
                {item.icon}
                <Typography variant="subtitle2" mt={1}>
                  {item.text}
                </Typography>
              </Paper>
              {item.subMenu && (
                <Menu
                  anchorEl={anchorEl}
                  open={activeMenu === item.text}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      bgcolor: "third.main", // 드롭다운 배경색 동일
                      borderRadius: 2,
                      boxShadow: 3,
                      "& .MuiMenuItem-root": {
                        color: theme.palette.text.primary,
                        px: 2,
                        py: 1,
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        "&:hover": {
                          bgcolor: "secondary.main", // 호버 효과 통일
                        },
                      },
                    },
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  {item.subMenu.map((sub) => (
                    <MenuItem
                      key={sub.text}
                      onClick={() => {
                        handleMenuAndDrawerClose();
                        navigate(sub.to);
                      }}
                    >
                      {sub.text}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Navbar;
