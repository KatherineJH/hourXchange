import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

import {
  getMyAdvertisements,
  deleteAdvertisement,
} from "../../api/advertisementApi";

export default function AdvertisementList() {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  const fetchMyAds = async () => {
    try {
      const data = await getMyAdvertisements();
      setAds(data);
    } catch (err) {
      console.error("광고 목록 불러오기 실패:", err);
      alert("광고 목록을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchMyAds();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 이 광고를 삭제하시겠습니까?")) return;
    try {
      await deleteAdvertisement(id);
      fetchMyAds();
      alert("광고가 삭제되었습니다.");
    } catch (err) {
      console.error("광고 삭제 실패:", err);
      alert("광고 삭제에 실패했습니다.");
    }
  };

  return (
    // ① maxWidth로 전체 덩어리 폭 제한, mx="auto"로 중앙 정렬
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" color="black">
        🙋‍♀️내 광고 리스트
      </Typography>
      {/* ─── ② 헤더 + 버튼을 한 덩어리로 flex 배치 ─── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end", // 오른쪽 끝에 모아두고
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/myPage/advertisement/register")}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          신규 등록
        </Button>
      </Box>

      {/* ─── ③ 테이블 컨테이너도 자동으로 가운데 ─── */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>제목</TableCell>
              <TableCell sx={{ color: "#fff" }}>설명</TableCell>
              <TableCell sx={{ color: "#fff" }}>시간</TableCell>
              <TableCell sx={{ color: "#fff" }}>작성자</TableCell>
              <TableCell align="right" sx={{ color: "#fff" }}>
                수정 / 삭제
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id} hover>
                <TableCell>{ad.title}</TableCell>
                <TableCell>{ad.description}</TableCell>
                <TableCell>{ad.hours}</TableCell>
                <TableCell>{ad.ownerName}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() =>
                      navigate(`/myPage/advertisement/modify/${ad.id}`)
                    }
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(ad.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
