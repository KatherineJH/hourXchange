import React, { useEffect, useState } from "react";
import { Box, Chip, CircularProgress } from "@mui/material";
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
    const randomIndex = Math.floor(Math.random() * adUrls.length);
    setImageUrl(adUrls[randomIndex]);
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
        height,
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
