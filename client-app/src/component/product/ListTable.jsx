import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Paper,
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

  useEffect(() => {
    getList()
      .then((response) => {
        setServerDataList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

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
    </Box>
  );
}

export default ListTable;
