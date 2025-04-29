// src/page/board/BoardPage.jsx
import React, { useEffect, useState } from "react";
import BoardTable from "../../component/board/BoardTable";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Pagination,
  Card,
  CardContent,
  Box,
  Typography,
} from "@mui/material";

import {
  getAllBoards,
  searchBoards,
  getAutocompleteSuggestions,
} from "../../api/boardApi";

function BoardPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);

  const [page, setPage] = useState(0); // JPA는 0부터 시작
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState(""); // 검색어 입력
  const [suggestions, setSuggestions] = useState([]); // 추천 검색어 리스트

  const fetchBoards = async () => {
    try {
      if (keyword.trim() === "") {
        const data = await getAllBoards(page, size);
        setBoards(data.content);
        setTotalPages(data.totalPages);
      } else {
        const data = await searchBoards(keyword, page, size);
        setBoards(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("게시판 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [page, size, keyword]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const result = await getAutocompleteSuggestions(searchInput);
        setSuggestions(result);
      } catch (e) {
        console.error("추천 검색어 실패", e);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchInput]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(0);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📋 Board 검색 & 리스트
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            {/* 검색창 */}
            <Box
              sx={{ position: "relative", width: "300px", margin: "1rem 0" }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="검색어를 입력하세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: "100%",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                검색
              </Button>

              {/* 추천 검색어 */}
              {suggestions.length > 0 && (
                <Paper
                  sx={{
                    position: "absolute",
                    width: "100%",
                    mt: "4px",
                    zIndex: 10,
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  <List dense>
                    {suggestions.map((s, idx) => (
                      <ListItem key={idx} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            setSearchInput(s);
                            setKeyword(s);
                            setPage(0);
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
            {/* 글쓰기 버튼 추가 */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/board/save")}
              sx={{ height: "40px" }}
            >
              글쓰기
            </Button>
          </Box>

          {/* 테이블 */}
          <BoardTable boards={boards} navigate={navigate} />

          {/* 페이지네이션 */}
          <Box
            sx={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BoardPage;
