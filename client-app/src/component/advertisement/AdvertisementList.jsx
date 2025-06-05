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

  // ① API 호출하여 “실제 광고 배열”만 뽑아오는 함수
  const fetchMyAds = async () => {
    try {
      const response = await getMyAdvertisements();

      // 1) 만약 response 자체가 배열이라면 그대로 사용
      if (Array.isArray(response)) {
        setAds(response);
        return;
      }

      // 2) 배열이 아니라면 response.content (또는 response.data 등)에 담겨있는 경우
      if (response && Array.isArray(response.content)) {
        setAds(response.content);
        return;
      }

      // 그 외의 경우에도 빈 배열로 설정 (방어 코드)
      setAds([]);
    } catch (err) {
      console.error("광고 목록 불러오기 실패:", err);
      alert("광고 목록을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchMyAds();
  }, []);

  // 광고 삭제 핸들러
  const handleDelete = async (adId) => {
    if (!window.confirm("정말 이 광고를 삭제하시겠습니까?")) return;

    try {
      await deleteAdvertisement(adId);
      alert("광고가 삭제되었습니다.");
      fetchMyAds(); // 삭제 후 목록을 다시 갱신
    } catch (err) {
      console.error("광고 삭제 실패:", err);
      alert("광고 삭제에 실패했습니다.");
    }
  };

  return (
    // ② maxWidth="md" 로 콘텐츠 폭을 제한하고 padding을 줘서 중앙 정렬
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" color="black" gutterBottom>
        🙋‍♀️ 내 광고 리스트
      </Typography>

      {/* ─── 신규 등록 버튼 ─── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
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

      {/* ─── 광고 목록 테이블 ─── */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table size="small">
          {/* 테이블 헤더 */}
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>제목</TableCell>
              <TableCell sx={{ color: "#fff" }}>설명</TableCell>
              <TableCell sx={{ color: "#fff" }}>시간(분)</TableCell>
              <TableCell sx={{ color: "#fff" }}>작성자</TableCell>
              <TableCell align="right" sx={{ color: "#fff" }}>
                수정 / 삭제
              </TableCell>
            </TableRow>
          </TableHead>

          {/* 테이블 바디 */}
          <TableBody>
            {ads.length > 0 ? (
              ads.map((ad) => (
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
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(ad.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // 광고가 하나도 없거나 로딩 중인 경우 안내 메시지
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    등록된 광고가 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
