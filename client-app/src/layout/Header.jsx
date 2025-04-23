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
import { fetchUser, logoutUser } from "../state/auth/Action";
import { useNavigate } from "react-router-dom";
import bgImage from "../image/background.jpg";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (!user && !isLoading && !error) dispatch(fetchUser());
  }, [dispatch, user, isLoading, error]);

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        alert("로그아웃 되었습니다.");
        window.location.href = "/login";
      })
      .catch((err) => alert("로그아웃 실패: " + err));
    setAnchorEl(null);
  };

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
                {user?.name ? (
                  <Typography variant="subtitle1">
                    {user.name.charAt(0)}
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
          <MenuItem disabled>
            {user?.name ? `${user.name}님, 환영합니다` : "로그인되지 않음"}
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export default Header;
