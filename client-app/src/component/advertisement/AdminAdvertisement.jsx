// src/component/admin/AdminAdvertisementList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Pagination,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAdvertisement,
  deleteAdvertisement,
} from "../../api/advertisementApi";

export default function AdminAdvertisementList() {
  const [ads, setAds] = useState({ content: [] });
  const [page, setPage] = useState(0);
  const size = 10;
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdvertisement = async () => {
    setLoading(true);
    try {
      const res = await getAdvertisement({ page, size }); // 백엔드에서 page/size 받도록 되어 있어야 함
      setAds(res);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("광고 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisement();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm(`ID ${id}의 광고를 정말 삭제하시겠습니까?`)) return;
    try {
      await deleteAdvertisement(id);
      fetchAdvertisement(); // 삭제 후 다시 로드
      alert("광고가 성공적으로 삭제되었습니다!");
    } catch (err) {
      console.error("광고 삭제 실패:", err);
      alert("광고 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        모든 광고 리스트 (관리자 전용)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "secondary.main" }}>ID</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>설명</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>시간</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>작성자</TableCell>
              <TableCell
                sx={{ bgcolor: "secondary.main", pr: 3 }}
                align="right"
              >
                삭제
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  등록된 광고가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              ads.content.map((ad) => (
                <TableRow key={ad.id} hover>
                  <TableCell>{ad.id}</TableCell>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>{ad.description}</TableCell>
                  <TableCell>{ad.hours}</TableCell>
                  <TableCell>{ad.ownerName || "알 수 없음"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(ad.id)}
                      color="primary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
          />
        </Stack>
      </Box>
    </Box>
  );
}
