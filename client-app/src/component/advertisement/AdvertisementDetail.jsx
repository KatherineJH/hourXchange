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
} from "@mui/material";

// 바뀐 import: ../api → ../../api
import {
  getAdvertisementDetail,
  deleteAdvertisement,
} from "../../api/advertisementApi.js";

export default function AdvertisementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          작성자: {adData.ownerName}
        </Typography>
      )}
      {adData.createdAt && (
        <Typography variant="body2" color="text.secondary">
          등록일: {new Date(adData.createdAt).toLocaleDateString("ko-KR")}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
        <Button variant="text" onClick={() => navigate("/product/all")}>
          목록으로
        </Button>
      </Box>
    </Box>
  );
}
