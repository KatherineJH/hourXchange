import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Modal,
  Paper,
} from "@mui/material";

// 바뀐 import: ../api → ../../api
import {
  getAdvertisementDetail,
  deleteAdvertisement,
} from "../../api/advertisementApi.js";
import { useSelector } from "react-redux";

export default function AdvertisementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getAdvertisementDetail(id)
      .then((ad) => {
        setAdData(ad);
        setLoading(false);
      })
      .catch((err) => {
        console.error("광고 상세 조회 중 오류:", err);
        setError("광고 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    navigate(`/advertisement/modify/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 이 광고를 삭제하시겠습니까?")) return;

    try {
      await deleteAdvertisement(id);
      alert("광고가 삭제되었습니다.");
      navigate("/advertisement");
    } catch (err) {
      console.error("광고 삭제 실패:", err);
      alert("광고 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const handleWatchClick = async () => {
    if (!user?.id) {
      setOpenModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`/api/advertisement/${id}/watch`, {});

      if (response.ok) {
        alert("광고 시청 완료! 크레딧이 지급되었습니다.");
      } else if (response.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        const text = await response.text();
        alert("시청 실패: " + text);
      }
    } catch (err) {
      console.error("광고 시청 중 오류:", err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        📢 광고 상세
      </Typography>

      {adData.images && adData.images.length > 0 ? (
        <Card sx={{ mb: 2 }}>
          <CardMedia
            component="img"
            image={adData.images[0]}
            alt={adData.title}
            sx={{ height: 400, objectFit: "cover" }}
          />
        </Card>
      ) : (
        <Card sx={{ mb: 2 }}>
          <CardMedia
            component="img"
            image="/default.png"
            alt="기본 이미지"
            sx={{ height: "100%", objectFit: "cover" }}
          />
        </Card>
      )}

      <Typography variant="h5" gutterBottom>
        {adData.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {adData.description}
      </Typography>

      {adData.ownerName && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          받는 크레딧 : {adData.hours}
        </Typography>
      )}
      {adData.createdAt && (
        <Typography variant="body2" color="text.secondary">
          등록일: {new Date(adData.createdAt).toLocaleDateString("ko-KR")}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
        <Button variant="contained" onClick={handleWatchClick}>
          광고 시청하기
        </Button>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 350,
              p: 3,
              outline: "none",
            }}
          >
            <Typography variant="h6" gutterBotton>
              로그인이 필요합니다.
            </Typography>
            <Typography variant="body2" mb={3} sx={{ pt: 2 }}>
              광고를 시청하려면 로그인을 해주세요.
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  setOpenModal(false);
                  navigate("/login");
                }}
              >
                로그인 하러 가기
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenModal(false);
                  navigate("/save");
                }}
              >
                회원가입 하러 가기
              </Button>
            </Box>
          </Paper>
        </Modal>
        <Button variant="contained" onClick={() => navigate("/product/all")}>
          목록으로
        </Button>
      </Box>
    </Box>
  );
}
