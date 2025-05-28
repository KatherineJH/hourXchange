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

  const CARD_HEIGHT = 460;
  const MEDIA_HEIGHT = 290;
  const CONTENT_HEIGHT = 100;

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 1,
        borderRadius: 1,
        overflow: "hidden",
        cursor: "pointer",
        p: 2,
      }}
      onClick={() => {
        navigate(`/advertisement/${ad.id}`);
      }}
    >
      <CardActionArea
        sx={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <CardMedia
          component="img"
          image={ad.images?.[0] || "/defaut.png"}
          alt={ad.title}
          sx={{
            height: MEDIA_HEIGHT,
            objectFit: "cover",
            width: "100%",
          }}
        />
        <CardContent
          sx={{
            height: CONTENT_HEIGHT,
            overflow: "hidden",
            px: 2,
          }}
        >
          <Typography gutterBottom variant="h6" sx={{ overflow: "hidden" }}>
            {ad.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ad.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
        <Typography variant="caption" sx={{ color: "grey", cursor: "pointer" }}>
          자세히 보기 &gt;
        </Typography>
      </CardActions>
    </Card>
  );
}
