import React, { useEffect, useState } from "react";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UserAdvertisement({ width = 300, height = 200 }) {
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  // public/advertisement/ad1.png ~ ad10.png
  const adUrls = Array.from(
    { length: 10 },
    (_, i) => `/advertisement/ad${i + 1}.png`
  );

  useEffect(() => {
    // 로딩 표시를 위해 setTimeout 예시
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * adUrls.length);
      setImageUrl(adUrls[randomIndex]);
    }, 300); // 실제 로딩이 아니라 UX용 예시

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

  if (!imageUrl) {
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
          background: "linear-gradient(to bottom, #fff, #f7f7f7)",
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        height: "250px",
        borderRadius: 1,
        overflow: "hidden",
        background: "linear-gradient(to bottom, #fff, #f7f7f7)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Chip
        label="AD"
        color="warning"
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
      />
      <Box
        component="img"
        src={imageUrl}
        alt="광고 이미지"
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Box>
  );
}
