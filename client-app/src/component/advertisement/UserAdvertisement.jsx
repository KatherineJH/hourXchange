import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, CircularProgress } from "@mui/material";
import { getAdvertisement } from "../../api/advertisementApi";

export default function UserAdvertisement({ width = 300, height = 200 }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // adsArray 중 하나를 무작위로 반환
  const pickRandomAd = (adsArray) => {
    if (!Array.isArray(adsArray) || adsArray.length === 0) return null;
    const idx = Math.floor(Math.random() * adsArray.length);
    return adsArray[idx];
  };

  useEffect(() => {
    let isMounted = true;

    getAdvertisement()
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res.content) && res.content.length > 0) {
          const randomAd = pickRandomAd(res.content);
          // console.log("랜덤 선택된 ad:", randomAd);
          setAd(randomAd);
        } else {
          setError("등록된 광고가 없습니다.");
        }
      })
      .catch((err) => {
        console.error("광고 로딩 실패:", err);
        if (isMounted) setError("광고를 불러오는 데 실패했습니다.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 로딩 중 표시
  if (loading) {
    return (
      <Box
        sx={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "linear-gradient(to bottom, #ffffff, #f7f7f7)",
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !ad) {
    return (
      <Box
        sx={{
          width,
          height,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "linear-gradient(to bottom, #ffffff, #f7f7f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {error || "광고를 불러오는 중 문제가 발생했습니다."}
        </Typography>
      </Box>
    );
  }

  const imageUrl =
    Array.isArray(ad.images) && ad.images.length > 0
      ? ad.images[0]
      : "/default.png";

  return (
    <Box
      sx={{
        width,
        height: "250px",
        borderRadius: 1,
        overflow: "hidden",
        background: "linear-gradient(to bottom, #ffffff, #f7f7f7)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {/* AD 배지 */}
      <Chip
        label="AD"
        color="warning"
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
      />

      {/* 광고 이미지 */}
      <Box
        component="img"
        src={imageUrl}
        alt={ad.title || "광고 이미지"}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
