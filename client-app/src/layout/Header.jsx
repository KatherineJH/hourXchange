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
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  AccountCircle,
  Notifications as NotificationsIcon,
  FavoriteBorder,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAsync, logoutUserAsync } from "../slice/AuthSlice.js";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "/background.jpg";
import { getAutocompleteSuggestions } from "../api/productApi.js";

function Header() {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const params = new URLSearchParams(location.search);
  const selectedKeyword = params.get("keyword") || "";

  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // 선택된 인덱스

  const { user, isLoading, error } = useSelector((state) => state.auth);
  const isMenuOpen = Boolean(anchorEl);
  console.log(user);

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
  };

  useEffect(() => {
    if (searchInput.trim() === "" || searchInput === keyword) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const result = await getAutocompleteSuggestions(searchInput);
        setSuggestions(result.data);
      } catch (err) {
        console.error("추천 검색어 오류", err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
    setHighlightedIndex(-1);
  }, [searchInput, keyword]);

  const handleSearch = () => {
    setKeyword(searchInput);
    navigate(`/search?keyword=${encodeURIComponent(searchInput.trim())}`);
    setSuggestions([]);
  };

  useEffect(() => {
    // 쿼리파라미터로 넘어온 keyword를 keyword 상태로 반영
    setKeyword(selectedKeyword);
    setSearchInput(selectedKeyword); // input에도 반영
  }, [selectedKeyword]);

  const handleMoveToAdminPage = () => {
    navigate("/admin");
  };

  return (
    <>
      {/* <Box
        sx={{
          width: "100%",
          height: 250,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      /> */}
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
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                  bgcolor: "#f1f3f4",
                  borderRadius: 1,
                  ml: 2,
                  width: 300,
                }}
              >
                <SearchIcon fontSize="small" />
                <InputBase
                  placeholder="검색"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightedIndex((prev) =>
                        prev < suggestions.length - 1 ? prev + 1 : 0
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightedIndex((prev) =>
                        prev > 0 ? prev - 1 : suggestions.length - 1
                      );
                    } else if (e.key === "Enter") {
                      if (
                        highlightedIndex >= 0 &&
                        highlightedIndex < suggestions.length
                      ) {
                        const selected = suggestions[highlightedIndex];
                        setSearchInput(selected);
                        navigate(
                          `/search?keyword=${encodeURIComponent(selected)}`
                        );
                        setSuggestions([]);
                      } else {
                        handleSearch();
                      }
                    }
                  }}
                  sx={{
                    bgcolor: "white",
                    px: 1,
                    borderRadius: 1,
                    width: "100%",
                  }}
                />
              </Box>

              {suggestions.length > 0 && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "300px",
                    zIndex: 10,
                    mt: "4px",
                  }}
                >
                  <List dense>
                    {suggestions.map((s, idx) => (
                      <ListItem key={idx} disablePadding>
                        <ListItemButton
                          selected={idx === highlightedIndex}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          onClick={() => {
                            setSearchInput(s);
                            navigate(
                              `/search?keyword=${encodeURIComponent(s)}`
                            );
                            setSuggestions([]);
                          }}
                        >
                          <ListItemText primary={s} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
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
                onClick={() => navigate("/myPage/chat")}
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
          {user.username ? (
            <>
              <MenuItem disabled>
                {user.name + user.role}님, 환영합니다
              </MenuItem>
              {user.role === "ROLE_ADMIN" ? (
                <MenuItem onClick={handleMoveToAdminPage}>
                  어드민페이지
                </MenuItem>
              ) : (
                <>
                  <MenuItem onClick={handleMoveToAdminPage}>
                    어드민페이지
                  </MenuItem>
                  <MenuItem onClick={handleMoveToMyPage}>마이페이지</MenuItem>
                </>
              )}
              <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </>
          ) : (
            <>
              <MenuItem disabled>로그인이 필요합니다.</MenuItem>
              <MenuItem onClick={handleLogin}>로그인</MenuItem>
              <MenuItem onClick={handleSave}>회원가입</MenuItem>
            </>
          )}
        </Menu>
      </Box>
    </>
  );
}

export default Header;
