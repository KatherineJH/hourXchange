import React, { useEffect, useState } from "react";
import { getWalletHistory } from "../../api/walletApi.js";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

function MyWallet() {
  const [history, setHistory] = useState([]);
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    getWalletHistory()
      .then((res) => setHistory(res))
      .catch((err) => console.error("❌ Wallet history load error:", err));
  }, []);

  const currentBalance = history.length > 0 ? history[0].balance : 0;

  // 🔹 연도 / 월 목록 만들기
  const years = [
    ...new Set(history.map((item) => new Date(item.createdAt).getFullYear())),
  ];
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  // 🔎 필터 적용
  const filteredHistory = history.filter((item) => {
    const date = new Date(item.createdAt);
    const matchYear = yearFilter
      ? date.getFullYear().toString() === yearFilter
      : true;
    const matchMonth = monthFilter
      ? (date.getMonth() + 1).toString().padStart(2, "0") === monthFilter
      : true;
    const matchType = typeFilter ? item.type === typeFilter : true;
    return matchYear && matchMonth && matchType;
  });

  return (
    <>
      {/* <Box sx={{ mt: 4 }}>
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
                    <TableCell sx={{ bgcolor: "secondary.main" }}>
                      유형
                    </TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>
                      금액
                    </TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>
                      잔액
                    </TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>
                      제품 ID
                    </TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>
                      일시
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
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
      </Box> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
          mt: 4,
          px: 2,
        }}
      >
        {/* 좌측: 잔액 + 필터 */}
        <Box sx={{ minWidth: 280 }}>
          <Typography variant="h6" gutterBottom>
            🙋 나의 지갑: 현재 남은 크레딧 - {currentBalance} 시간
          </Typography>

          {/* 🔸 연도 */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>연도</InputLabel>
            <Select
              value={yearFilter}
              label="연도"
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* 🔸 월 */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>월</InputLabel>
            <Select
              value={monthFilter}
              label="월"
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              {[
                ...new Set(
                  history
                    .filter((item) => {
                      const date = new Date(item.createdAt);
                      return yearFilter
                        ? date.getFullYear().toString() === yearFilter
                        : true;
                    })
                    .map((item) =>
                      (new Date(item.createdAt).getMonth() + 1)
                        .toString()
                        .padStart(2, "0")
                    )
                ),
              ]
                .sort()
                .map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* 🔸 유형 */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>유형</InputLabel>
            <Select
              value={typeFilter}
              label="유형"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="EARN">적립</MenuItem>
              <MenuItem value="SPEND">사용</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* 우측: 카드 리스트 */}
        <Box sx={{ flex: 1, maxWidth: 600 }}>
          {filteredHistory.map((item) => (
            <Box
              key={item.id}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#fff",
                boxShadow: 1,
                borderLeft: `6px solid ${item.type === "EARN" ? "#4caf50" : "#f44336"}`,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {item.type === "EARN"
                  ? `+${item.amount} 시간 적립`
                  : `-${item.amount} 시간 사용`}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                📦 제품 ID: {item.productId}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                🕓 {new Date(item.createdAt).toLocaleString("ko-KR")}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                💰 잔액: {item.balance} 시간
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
export default MyWallet;
