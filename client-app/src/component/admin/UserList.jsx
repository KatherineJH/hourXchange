import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import CustomPagination from "../common/CustomPagination.jsx";
import { getUserList } from "../../api/userApi.js";

export default function UserList() {
  const navigate = useNavigate();
  const [serverData, setServerData] = useState([]);
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getUserList(page, size)
      .then((response) => {
        setServerData(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.log(error));
  }, [page]);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        유저조회
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>이메일</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>이름</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>닉네임</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>생일</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>권한</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>잔액</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serverData.length > 0 ? (
              serverData.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/donation/read/${item.id}`)}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.birthdate}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.wallet?.credit ?? 0}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  등록된 정보가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomPagination totalPages={totalPages} page={page} setPage={setPage} />
    </Box>
  );
}
