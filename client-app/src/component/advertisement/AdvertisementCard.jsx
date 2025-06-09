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

  return (
    <Card
      sx={{
        maxWidth: 345, // 가로 345px
        width: "100%",
        height: 400, // 세로 400px
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 1,
        borderRadius: 1,
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate(`/advertisement/${ad.id}`);
      }}
    >
      {/* 이미지 + 제목/설명 */}
      <CardActionArea
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 이미지 위에 “AD” */}
        <Box sx={{ position: "relative", width: "100%", height: 200 }}>
          <CardMedia
            component="img"
            image={ad.images?.[0] || "/default.png"}
            alt={ad.title}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
          {/* 이미지 위에 “AD” 텍스트를 표시 */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "primary.main",
              px: 1.5,
              py: 0.5,
              borderRadius: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "white", fontWeight: "bold", lineHeight: 1 }}
            >
              AD
            </Typography>
          </Box>
        </Box>

        {/* 제목/설명 영역  */}
        <CardContent
          sx={{
            flexGrow: 1,
            px: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            overflow: "hidden",
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            sx={{
              mb: 0.5,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {ad.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {ad.description}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* 하단 '자세히 보기' 버튼 영역 */}
      <CardActions
        sx={{
          justifyContent: "flex-end",
          px: 2,
          py: 1,
          height: 48,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "grey",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => {
            navigate(`/advertisement/${ad.id}`);
          }}
        >
          자세히 보기 &gt;
        </Typography>
      </CardActions>
    </Card>
  );
}
