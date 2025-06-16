// src/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

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
    to: "/product/all",
  },
  {
    text: "지역별",
    icon: <LocationOnIcon color="action" fontSize="large" />,
    to: "/product/list",
  },
  {
    text: "기부 참여",
    icon: <VolunteerActivismIcon color="error" fontSize="large" />,
    to: "/donation/list",
  },
  {
    text: "기부, 봉사 조회",
    icon: <EmojiPeopleIcon color="warning" fontSize="large" />,
    subMenu: [
      { text: "기부해요", to: "/product/donation" },
      { text: "봉사해요", to: "/product/volunteer" },
    ],
  },
  {
    text: "커뮤니티",
    icon: <ForumIcon color="disabled" fontSize="large" />,
    to: "/board/list",
  },
  {
    text: "시간충전",
    icon: <AccessTimeIcon color="secondary" fontSize="large" />,
    to: "/payment/buy",
  },
];

function Navbar({ onClickAny, forceCloseMenu }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // 960px 이하
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { user } = useSelector((state) => state.auth);

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
                } else if (item.text === "시간충전" && !user?.email) {
                  setOpenModal(true); // 로그인 안했으면 모달 열기
                } else {
                  navigate(item.to);
                  if (typeof onClickAny === "function") onClickAny(); // Drawer 닫기
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
                onClick={(e) => {
                  if (item.subMenu) {
                    handleClick(e, item.text);
                  } else if (item.text === "시간충전" && !user?.email) {
                    setOpenModal(true);
                  } else {
                    navigate(item.to);
                  }
                }}
                sx={{
                  px: 4,
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
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            p: 3,
            outline: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            로그인이 필요합니다.
          </Typography>
          <Typography variant="body2" sx={{ pt: 2, mb: 3 }}>
            시간 크레딧 충전 기능을 이용하려면 로그인 해주세요.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setOpenModal(false);
                navigate("/login");
              }}
            >
              로그인 하러 가기
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setOpenModal(false);
                navigate("/save");
              }}
            >
              회원가입 하러 가기
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}

export default Navbar;
