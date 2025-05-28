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
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // 관리자는 수정은 필요 없을 수 있으니 삭제만
import { useNavigate } from "react-router-dom";

import {
  getAdvertisement,
  deleteAdvertisement,
} from "../../api/advertisementApi";

export default function AdminAdvertisementList() {
  const [allAds, setAllAds] = useState([]);
  const navigate = useNavigate();

  // 모든 광고 불러오기
  const fetchAdvertisement = async () => {
    try {
      const data = await getAdvertisement();
      setAllAds(data);
    } catch (err) {
      console.error("모든 광고 목록 불러오기 실패:", err);
      alert("모든 광고 목록을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchAdvertisement();
  }, []);

  // 광고 삭제 핸들러 (어떤 광고든 삭제 가능)
  const handleDelete = async (id) => {
    if (!window.confirm(`ID ${id}의 광고를 정말 삭제하시겠습니까?`)) return;
    try {
      await deleteAdvertisement(id);
      fetchAdvertisement();
      alert("광고가 성공적으로 삭제되었습니다!");
    } catch (err) {
      console.error("광고 삭제 실패:", err);

      if (err.response && err.response.status === 403) {
        alert("광고를 삭제할 권한이 없습니다.");
      } else {
        alert("광고 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" component="h2" color="primary">
        {" "}
        모든 광고 리스트 (관리자 전용)
      </Typography>
      {/* 관리자 페이지에서는 신규 등록 버튼이 필요 없을 수 있음 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            {" "}
            {/* 관리자 페이지임을 나타내는 색상 */}
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>{" "}
              {/* ID 컬럼 추가 */}
              <TableCell sx={{ color: "white" }}>제목</TableCell>
              <TableCell sx={{ color: "white" }}>설명</TableCell>
              <TableCell sx={{ color: "white" }}>시간</TableCell>
              <TableCell sx={{ color: "white" }}>작성자</TableCell>
              <TableCell sx={{ color: "white" }} align="right">
                삭제
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allAds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  등록된 광고가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              allAds.map((ad) => (
                <TableRow key={ad.id} hover>
                  <TableCell>{ad.id}</TableCell> {/* 광고 ID 표시 */}
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>{ad.description}</TableCell>
                  <TableCell>{ad.hours}</TableCell>
                  <TableCell>{ad.ownerName || "알 수 없음"}</TableCell>{" "}
                  {/* ownerName 필드 확인 */}
                  <TableCell align="right">
                    {/* 관리자는 주로 삭제 권한이 있습니다. 수정이 필요하면 EditIcon 추가 */}
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
    </Box>
  );
}
