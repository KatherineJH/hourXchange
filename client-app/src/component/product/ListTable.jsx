import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  getList,
  getListWithKeyword,
  getAutocompleteSuggestions,
} from "../../api/productApi.js";
import { useNavigate } from "react-router-dom";

function ListTable({
  filterProviderType,
  category,
  keyword: keywordProp = "",
  onVisibleItemsChange, 
}) {
  const [serverDataList, setServerDataList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState(keywordProp);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchInput.trim() === "" || searchInput === keyword) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const result = await getAutocompleteSuggestions(searchInput);
        setSuggestions(result.data);
      } catch (e) {
        console.error("추천 검색어 실패", e);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
    setHighlightedIndex(-1);
  }, [searchInput, keyword]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response =
          keyword.trim() === ""
            ? await getList(0, 100) // fetch ALL (first 100)
            : await getListWithKeyword(keyword, 0, 100);

        let full = response.data.content;

        if (filterProviderType) {
          full = full.filter((p) => p.providerType === filterProviderType);
        }
        if (category) {
          full = full.filter((p) => p.category?.categoryName === category);
        }

        const start = page * size;
        const end = start + size;
        const paged = full.slice(start, end);

        setServerDataList(paged);
        setTotalPages(Math.ceil(full.length / size));

        if (onVisibleItemsChange) {
          onVisibleItemsChange(paged);
        }

        // 🔥 Notify parent about currently visible page
        if (onVisibleItemsChange) {
          onVisibleItemsChange(data);
        }
      } catch (error) {
        console.error("리스트 조회 실패:", error);
      }
    };
    fetch();
  }, [page, size, keyword, filterProviderType, category]);

  useEffect(() => {
    setKeyword(keywordProp);
  }, [keywordProp]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(0);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ position: "relative", width: "300px" }}>
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

            <Button
              variant="contained"
              onClick={() => navigate("/product/register")}
            >
              게시물 작성
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table stickyHeader aria-label="product table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>설명</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    시간(비용)
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    시작시간
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    끝시간
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    작성자
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    카테고리
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>타입</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serverDataList.length > 0 ? (
                  serverDataList.map((item) => (
                    <TableRow
                      hover
                      key={item.id}
                      onClick={() => navigate(`/product/read/${item.id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.hours}</TableCell>
                      <TableCell>{item.startedAt}</TableCell>
                      <TableCell>{item.endAt}</TableCell>
                      <TableCell>{item.owner.name}</TableCell>
                      <TableCell>{item.category.categoryName}</TableCell>
                      <TableCell>{item.providerType}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Box>

      <Box
        sx={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
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
    </Box>
  );
}

export default ListTable;
