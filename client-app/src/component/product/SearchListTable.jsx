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
  getFilteredList,
} from "../../api/productApi.js";
import { useNavigate } from "react-router-dom";
import { useCustomDebounce } from "../../assets/useCustomDebounce.js";

function SearchListTable({
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
  const debouncedInput = useCustomDebounce(searchInput, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedInput.trim() === "" || debouncedInput === keyword) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const result = await getAutocompleteSuggestions(debouncedInput);
        setSuggestions(result.data);
      } catch (e) {
        console.error("추천 검색어 실패", e);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
    setHighlightedIndex(-1);
  }, [debouncedInput, keyword]);

  useEffect(() => {
    const fetch = async () => {
      try {
        let response;
        if (keyword.trim() !== "") {
          response = await getListWithKeyword(keyword, 0, 9999);
        } else if (filterProviderType) {
          response = await getFilteredList(0, 9999, filterProviderType);
        } else {
          response = await getList(0, 9999);
        }

        let full = response.data.content;

        if (category) {
          full = full.filter((p) => p.category?.categoryName === category);
        }

        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paged = full.slice(startIndex, endIndex);

        setServerDataList(paged);
        setTotalPages(Math.ceil(full.length / size));

        if (onVisibleItemsChange) {
          onVisibleItemsChange(full);
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
    <Box>
      <Box>
        <CardContent>
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
                  <TableCell sx={{ bgcolor: "secondary.main" }}>날짜</TableCell>
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
                      <TableCell>{item.startedAt?.substring(0, 10)}</TableCell>
                      <TableCell>{item.owner.name}</TableCell>
                      <TableCell>{item.category.categoryName}</TableCell>
                      <TableCell>
                        {item.providerType === "SELLER"
                          ? "판매"
                          : item.providerType === "BUYER"
                            ? "구매"
                            : item.providerType}
                      </TableCell>
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

export default SearchListTable;