import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent, Pagination,
  Paper, Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getList } from "../../api/productApi.js";
import { useNavigate } from "react-router-dom";

function ListTable() {
  const [serverDataList, setServerDataList] = useState([]);
  const navigate = useNavigate();

  const [page, setPage] = useState(0); // JPA는 0부터 시작
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getList(page, size)
      .then((response) => {
        setServerDataList(response.data.content);
        setTotalPages(response.data.totalPages);

      })
      .catch((error) => console.log(error));
  }, [page, size]);

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            제품 리스트
          </Typography>

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
