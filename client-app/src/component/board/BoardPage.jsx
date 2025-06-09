// src/page/board/BoardPage.jsx
import React, { useEffect, useState } from "react";
import BoardTable from "../../component/board/BoardTable";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  CardContent,
  Box,
} from "@mui/material";
import {
  getAllBoards,
  searchBoards,
  getAutocompleteSuggestions,
} from "../../api/boardApi";
import { useCustomDebounce } from "../../assets/useCustomDebounce";
import CategoryNav from "../../layout/CategoryNav";

function BoardPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || ""; // 없으면 빈 문자열

  const [page, setPage] = useState(0); // JPA는 0부터 시작
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState(""); // 검색어 입력
  const [suggestions, setSuggestions] = useState([]); // 추천 검색어 리스트
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // 선택된 인덱스
  const debouncedInput = useCustomDebounce(searchInput, 300);

  const fetchBoards = async () => {
    try {
      let data;
      if (keyword.trim() === "") {
        data = await getAllBoards(0, 9999); // 전체 데이터 불러오기
      } else {
        data = await searchBoards(keyword, 0, 9999);
      }
      let content = data.content;
      if (categoryParam) {
        content = content.filter(
          (board) => board.category?.categoryName === categoryParam
        );
      }
      // 페이지 슬라이싱
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paged = content.slice(startIndex, endIndex);
      setBoards(paged);
      setTotalPages(Math.ceil(content.length / size)); // 전 카테고리 페이지 수
    } catch (error) {
      console.error("게시판 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [page, size, keyword, categoryParam]);

  useEffect(() => {
    setPage(0); // 카테고리 변경 시 첫 페이지로 리셋
  }, [categoryParam]);

  useEffect(() => {
    if (debouncedInput.trim() === "" || debouncedInput === keyword) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const result = await getAutocompleteSuggestions(debouncedInput);
        setSuggestions(result);
      } catch (e) {
        console.error("추천 검색어 실패", e);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedInput, keyword]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(0);
  };

  return (
    <Box
      sx={{ width: "100%", maxWidth: 1220, mx: "auto", px: { xs: 1, sm: 2 } }}
    >
      {/* 카테고리 네비게이션 */}
      <CategoryNav />
      <Box>
        <CardContent>
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
                      setKeyword(selected);
                      setPage(0);
                      setSuggestions([]);
                      setHighlightedIndex(-1);
                    } else {
                      handleSearch();
                    }
                  }
                }}
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
                          selected={idx === highlightedIndex}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          onClick={() => {
                            setSearchInput(s);
                            setKeyword(s);
                            setPage(0);
                            setSuggestions([]);
                            setHighlightedIndex(-1);
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
      </Box>
    </Box>
  );
}

export default BoardPage;
