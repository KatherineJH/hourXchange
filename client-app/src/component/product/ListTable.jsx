import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
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
  Typography,
} from "@mui/material";
import { getList, getListWithKeyword } from "../../api/productApi.js";
import { useNavigate } from "react-router-dom";
import { getAutocompleteSuggestions } from "../../api/productApi.js";

function ListTable({ filterProviderType }) {
  const [serverDataList, setServerDataList] = useState([]);
  const navigate = useNavigate();

  const [page, setPage] = useState(0); // JPA는 0부터 시작
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState(""); // 검색어 입력
  const [suggestions, setSuggestions] = useState([]); // 추천 검색어 리스트

  // useEffect(() => {
  //   if (keyword.trim() === "") {
  //     getList(page, size)
  //       .then((response) => {
  //         setServerDataList(response.data.content);
  //         setTotalPages(response.data.totalPages);
  //       })
  //       .catch((error) => console.log(error));
  //   } else {
  //     getListWithKeyword(keyword, page, size).then((response) => {
  //       setServerDataList(response.data.content);
  //       setTotalPages(response.data.totalPages);
  //       console.log(response.data.content);
  //       console.log(response.data.totalPages);
  //     });
  //   }
  // }, [page, size, keyword]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.trim() === "") {
        setSuggestions([]);
        return;
      }
      try {
        const result = await getAutocompleteSuggestions(searchInput);
        setSuggestions(result.data);
      } catch (e) {
        console.error("추천 검색어 실패", e);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchInput]);

  useEffect(() => {
    const fetch = async () => {
      try {
        let response;
        if (keyword.trim() === "") {
          response = await getList(page, size);
        } else {
          response = await getListWithKeyword(keyword, page, size);
        }

        // ✅ Seller or Buyer 필터링 로직 추가
        const filtered = filterProviderType
          ? response.data.content.filter(
              (p) => p.providerType === filterProviderType
            )
          : response.data.content;

        setServerDataList(filtered);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("리스트 조회 실패:", error);
      }
    };
    fetch();
  }, [page, size, keyword, filterProviderType]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(0);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          {/* <Typography variant="h5" gutterBottom>
            제품 리스트
          </Typography> */}

          {/* 검색창 */}
          <Box sx={{ position: "relative", width: "300px", margin: "1rem 0" }}>
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
                {serverDataList.map((item) => (
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
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
    </Box>
  );
}

export default ListTable;
