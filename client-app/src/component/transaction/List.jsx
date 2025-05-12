// Admin Page - List.jsx
import React, { useEffect, useState } from "react";
import { getList } from "../../api/transactionApi.js";
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

const initState = {
  id: "",
  user: "",
  product: "",
  status: "",
  createAt: "",
};

function List(props) {
  const [serverDataList, setServerDataList] = useState([]);

  useEffect(() => {
    getList()
      .then((response) => {
        setServerDataList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            제품 리스트
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
                    <TableCell>{item.createdAt}</TableCell>
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

export default List;
