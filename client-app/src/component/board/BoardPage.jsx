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

  // 게시판 데이터 가져오기
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

  // 페이지 변경, 검색어 변경 시 다시 게시판 데이터를 불러옴
  useEffect(() => {
    fetchBoards();
  }, [page, size, keyword]);

  // 🔍 입력값이 바뀔 때마다 추천 검색어 호출
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
    setKeyword(searchInput); // 검색어를 확정
    setPage(0); // 첫 페이지로
  };

  return (
    <div>
      <h1>📋 Board 검색 페이지</h1>
      <div style={{ position: "relative", width: "300px", margin: "1rem 0" }}>
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
        {/* 🔽 추천 검색어 리스트 표시 */}
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
                      setSuggestions([]); // 추천창 닫기
                    }}
                  >
                    <ListItemText primary={s} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </div>
      <BoardTable boards={boards} navigate={navigate} />

      {/* 하단 페이지네이션 버튼 */}
      <div
        style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
      >
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={page + 1} // MUI는 1부터 시작하니까 +1
            onChange={(event, value) => setPage(value - 1)} // 다시 0부터 시작하게 맞춰줌
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </Stack>
      </div>
    </div>
  );
}

export default BoardPage;
