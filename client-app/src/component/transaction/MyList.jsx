import React, { useEffect, useState } from "react";
import { getMyTransactionList } from "../../api/transactionApi.js";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function MyList() {
  const [serverDataList, setServerDataList] = useState([]);

  useEffect(() => {
    getMyTransactionList()
      .then((response) => {
        console.log("✅ 내 트랜잭션 데이터:", response.data); // 👈 여기!
        setServerDataList(response.data);
      })
      .catch((error) => {
        console.error("❌ 트랜잭션 목록 불러오기 실패:", error);
      });
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            나의 거래 내역
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table stickyHeader aria-label="transaction table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    제품명
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    상대방 이름
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    생성일자
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serverDataList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.product.title}</TableCell>
                    <TableCell>{item.user.name}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString("ko-KR")}
                    </TableCell>
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

export default MyList;
