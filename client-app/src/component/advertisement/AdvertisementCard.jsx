// src/common/AdvertisementCard.jsx
import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdvertisementCard({ ad }) {
  const navigate = useNavigate();

  const CARD_MEDIA_FIXED_HEIGHT = 194;
  const CARD_CONTENT_MIN_HEIGHT = 64;
  const CARD_ACTIONS_MIN_HEIGHT = 92;

  return (
    <Card
      sx={{
        // maxWidth: 345,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 1,
        borderRadius: 2,
      }}
      onClick={() => {
        navigate(`/advertisement/${ad.id}`);
      }}
    >
      <CardActionArea sx={{ flex: 1 }}>
        <CardMedia
          component="img"
          height={CARD_MEDIA_FIXED_HEIGHT}
          image={
            ad.images?.[0] ||
            "https://via.placeholder.com/345x194?text=No+Image"
          }
          alt={ad.title}
        />
        <CardContent sx={{ minHeight: CARD_CONTENT_MIN_HEIGHT }}>
          <Typography gutterBottom variant="h6">
            {ad.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ad.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
        <Typography variant="caption" sx={{ color: "grey", cursor: "pointer" }}>
          자세히 보기 &gt;
        </Typography>
      </CardActions>
    </Card>
  );
}
