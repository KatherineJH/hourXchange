import React, { useEffect, useState } from "react";
import { getWalletHistory } from "../../api/walletApi.js";
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

function MyWallet() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getWalletHistory()
      .then((res) => {
        setHistory(res);
        console.log("✅ WalletHistory:", res);
      })
      .catch((err) => {
        console.error("❌ Wallet history load error:", err);
      });
  }, []);

  const currentBalance = history.length > 0 ? history[0].balance : 0;

  return (
    <Box sx={{ mt: 4 }}>
      <Box>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🙋 나의 지갑: 현재 남은 크레딧 - {currentBalance} 시간
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table stickyHeader aria-label="wallet history table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>ID</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>유형</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>금액</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>잔액</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>
                    제품 ID
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main" }}>일시</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    {/* <TableCell>{item.type}</TableCell> */}
                    <TableCell>
                      {item.type === "EARN"
                        ? `+${item.amount}`
                        : `-${item.amount}`}
                    </TableCell>
                    <TableCell>{item.amount} 시간</TableCell>
                    <TableCell>{item.balance}</TableCell>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString("ko-KR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Box>
    </Box>
  );
}

export default MyWallet;
