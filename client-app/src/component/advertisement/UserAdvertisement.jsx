import React from "react";
import { Box, Typography, CardContent } from "@mui/material";

function UserAdvertisement({ ad }) {
  if (!ad) {
    return (
      <Box
        sx={{
          border: "1px dashed gray",
          padding: 2,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">
          광고를 불러오는 중입니다...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 700,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        backgroundColor: "#fafafa",
        maxWidth: 300,
        width: "100%",
        flexDirection: "column",
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {ad.title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {ad.description}
        </Typography>
      </CardContent>
      <Box
        component="img"
        src={ad.imgUrl ?? "/donationAd.png"}
        alt={ad.title}
        sx={{
          width: "100%",
          borderRadius: 1,
          mb: 2,
        }}
      />
      <Typography variant="caption" color="text.secondary">
        작성자: {ad.ownerName}
      </Typography>
    </Box>
  );
}

export default UserAdvertisement;
