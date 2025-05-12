// src/layout/Header.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  InputBase,
} from "@mui/material";
import {
  AccountCircle,
  Notifications as NotificationsIcon,
  FavoriteBorder,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import {fetchUserAsync, logoutUserAsync} from "../slice/AuthSlice.js";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/image/background.jpg";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const isMenuOpen = Boolean(anchorEl);
  console.log(user)

  useEffect(() => {
    if (!user.email) dispatch(fetchUserAsync());
  }, []);

  const handleLogout = () => {
    dispatch(logoutUserAsync())
      .then(() => {
        alert("로그아웃 되었습니다.");
        window.location.href = "/login";
      })
      .catch((err) => alert("로그아웃 실패: " + err));
    setAnchorEl(null);
  };

    const handleLogin = () => {
        window.location.href = "/login";
        setAnchorEl(null);
    };
    const handleSave = () => {
        window.location.href = "/save";
        setAnchorEl(null);
    };

    const handleMoveToMyPage = () => {
        navigate("/myPage");
    }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: 250,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
              onClick={() => navigate("/")}
            >
              H@urXchange
            </Typography>
            {/* 🔍 Search bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1,
                bgcolor: "#f1f3f4",
                borderRadius: 1,
                ml: 2,
              }}
            >
              <SearchIcon fontSize="small" />
              <InputBase placeholder="검색" sx={{ ml: 1 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                size="large"
                aria-label="wishlist"
                color="inherit"
                onClick={() => alert("위시리스트로 이동합니다")}
              >
                <FavoriteBorder />
              </IconButton>
              <IconButton
                size="large"
                aria-label="chat list"
                color="inherit"
                onClick={() => navigate("/chat")}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="user menu"
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {user.name ? (
                  <Typography variant="subtitle1">
                    {user.name.charAt(0).toUpperCase()}
                  </Typography>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={() => setAnchorEl(null)}
        >
            {user.username ?
                <>
                    <MenuItem disabled>
                        {user.name}님, 환영합니다
                    </MenuItem>
                    <MenuItem onClick={handleMoveToMyPage}>마이페이지</MenuItem>
                    <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                </> :
                <>
                    <MenuItem disabled>
                        로그인이 필요합니다.
                    </MenuItem>
                    <MenuItem onClick={handleLogin}>로그인</MenuItem>
                    <MenuItem onClick={handleSave}>회원가입</MenuItem>
                </>

            }

        </Menu>
      </Box>
    </>
  );
}

export default Header;
