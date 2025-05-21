import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Pagination,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyProductList } from "../../api/productApi";

function MyPostList() {
  const [serverDataList, setServerDataList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const pathPrefix = location.pathname.startsWith("/admin")
    ? "/admin"
    : location.pathname.startsWith("/myPage")
      ? "/myPage"
      : "";

  const fetchMyProducts = async () => {
    try {
      const response = await getMyProductList(page, size);
      setServerDataList(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("❌ 나의 상품 리스트 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [page, size]);

  return (
    <Box sx={{ mt: 4 }}>
      <Box>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🙋‍♀️ 나의 상품 리스트
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`${pathPrefix}/product/register`)}
            >
              상품 등록
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="my product table">
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
                    onClick={() =>
                      navigate(`${pathPrefix}/product/read/${item.id}`)
                    }
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

export default MyPostList;
