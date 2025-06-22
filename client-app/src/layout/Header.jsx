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
  Modal,
  Button,
} from "@mui/material";
import {
  AccountCircle,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAsync } from "../slice/AuthSlice.js";
import { useLocation, useNavigate } from "react-router-dom";
import { getAutocompleteSuggestions } from "../api/productApi.js";
import { fetchChatRooms } from "../api/chatApi.js";
import { useCustomDebounce } from "../assets/useCustomDebounce.js";

function Header() {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatRoomCount, setChatRoomCount] = useState(0);
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedInput = useCustomDebounce(searchInput, 300);
  const params = new URLSearchParams(location.search);
  const selectedKeyword = params.get("keyword") || "";

  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isSticky, setIsSticky] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
  const loadChatRooms = async () => {
    try {
      if (user?.email) {
        const res = await fetchChatRooms();
        setChatRoomCount(res.length);  // 채팅방 개수
      }
    } catch (err) {
      console.error("채팅방 정보를 불러오는 데 실패했습니다", err);
    }
  };
  loadChatRooms();
}, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 80;
      setIsSticky(window.scrollY >= threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUserAsync())
      .then(() => {
        alert("로그아웃 되었습니다.");
        navigate("/login", { replace: true });
      })
      .catch((err) => alert("로그아웃 실패: " + err));
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate("/login");
    setAnchorEl(null);
  };
  const handleSave = () => {
    navigate("/save");
    setAnchorEl(null);
  };
  const handleMoveToMyPage = () => navigate("/myPage");
  const handleMoveToAdminPage = () => navigate("/admin");

  const handleNotificationClick = () => {
    if (!user?.email) {
      setOpenNotificationModal(true);
    } else {
      navigate("/myPage/chat");
    }
  };

  useEffect(() => {
    if (debouncedInput.trim() === "" || debouncedInput === keyword) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const result = await getAutocompleteSuggestions(debouncedInput);
        setSuggestions(result.data);
      } catch (err) {
        console.error("추천 검색어 오류", err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
    setHighlightedIndex(-1);
  }, [debouncedInput, keyword]);

  const handleSearch = () => {
    setKeyword(searchInput);
    navigate(`/main/search?keyword=${encodeURIComponent(searchInput.trim())}`);
    setSuggestions([]);
  };

  const handleSearchKey = (e) => {
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
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const selected = suggestions[highlightedIndex];
        setSearchInput(selected);
        navigate(`/main/search?keyword=${encodeURIComponent(selected)}`);
        setSuggestions([]);
      } else {
        handleSearch();
      }
    }
  };

  useEffect(() => {
    setKeyword(selectedKeyword);
    setSearchInput(selectedKeyword);
  }, [selectedKeyword]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position={isSticky ? "fixed" : "static"}
          elevation={0}
          sx={{ borderRadius: "30px", mx: "auto", my: 1.5, px: 2 }}
        >
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                maxWidth: 1220,
                mx: "auto",
                px: { xs: 1, sm: 2 },
              }}
            >
              {/* 로고 + 검색창 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src="/hourPanda.png"
                    alt="logo"
                    sx={{ height: 48, cursor: "pointer" }}
                    onClick={() => navigate("/")}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => navigate("/")}
                  >
                    HourXChange
                  </Typography>
                </Box>
                {/* 검색창 */}
                <Box
                  sx={{
                    flex: 1,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    bgcolor: "#edecec",
                    borderRadius: 1,
                    maxWidth: 500,
                  }}
                >
                  <SearchIcon fontSize="small" />
                  <InputBase
                    placeholder="시간으로 거래하고 싶은 상품을 검색해보세요!"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKey}
                    sx={{
                      bgcolor: "white",
                      px: 1,
                      borderRadius: 1,
                      width: "100%",
                      height: 50,
                    }}
                  />
                  {suggestions.length > 0 && (
                    <Paper
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: 200,
                        overflowY: "auto",
                        borderRadius: 1,
                      }}
                    >
                      <List dense>
                        {suggestions.map((item, index) => (
                          <ListItem disablePadding key={item}>
                            <ListItemButton
                              selected={index === highlightedIndex}
                              onClick={() => {
                                setSearchInput(item);
                                navigate(
                                  `/main/search?keyword=${encodeURIComponent(item)}`
                                );
                                setSuggestions([]);
                              }}
                            >
                              <ListItemText primary={item} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Box>
              </Box>
              {/* 오른쪽 아이콘 */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, ml: 2 }}
              >
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => navigate("/main")}
                >
                  <HomeIcon />
                </IconButton>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleNotificationClick}
                >
                  <Badge badgeContent={chatRoomCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
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
            </Box>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={() => setAnchorEl(null)}
        >
          {user.email ? (
            <>
              <MenuItem disabled>
                {user.name}님, 환영합니다
                <br />
                잔액: {user.wallet?.credit ?? 0} 크레딧
              </MenuItem>
              {user.role === "ROLE_ADMIN" ? (
                <MenuItem onClick={handleMoveToAdminPage}>
                  어드민페이지
                </MenuItem>
              ) : (
                <MenuItem onClick={handleMoveToMyPage}>마이페이지</MenuItem>
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
      {/* 알림용 모달 - 로그인 유도 */}
      <Modal
        open={openNotificationModal}
        onClose={() => setOpenNotificationModal(false)}
      >
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
            채팅 기능을 이용하려면 로그인을 해주세요.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setOpenNotificationModal(false);
                navigate("/login");
              }}
            >
              로그인 하러 가기
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setOpenNotificationModal(false);
                navigate("/save");
              }}
            >
              회원가입 하러 가기
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
}

export default Header;
