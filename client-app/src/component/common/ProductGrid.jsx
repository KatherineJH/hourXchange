

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import AdvertisementCard from "../advertisement/AdvertisementCard";
import { getProductTags } from "../../api/productApi";

export default function ProductGrid({
  products,
  favorite,
  onToggleFavorite,
  expandedId,
  onToggleExpand,
}) {
  const navigate = useNavigate();
  const [tagsMap, setTagsMap] = useState({});

  useEffect(() => {
    const fetchAllTags = async () => {
      const newMap = {};
      await Promise.all(
        products.map(async (product) => {
          if (!product.id) return;
          try {
            const tags = await getProductTags(product.id);
            newMap[product.id] = tags;
          } catch (err) {
            console.error(
              `Failed to fetch tags for product ${product.id}`,
              err
            );
            newMap[product.id] = [];
          }
        })
      );
      setTagsMap(newMap);
    };

    fetchAllTags();
  }, [products]);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        // DonationCardList와 동일하게 '최소 300px, 최대 1fr' 컬럼
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        mt: 2,
        width: "100%",
        justifyItems: "start",
        justifyContent: "flex-start",
      }}
    >
      {products.map((product) => {
        if (product.type === "ad") {
          return <AdvertisementCard key={`ad-${product.id}`} ad={product} />;
        }

        return (
          <Card
            key={`product-${product.id}`}
            sx={{
              maxWidth: 345,
              width: "100%",
              height: 400,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {product.owner?.name?.[0] || "?"}
                </Avatar>
              }
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title={product.title}
              subheader={new Date(product.startedAt).toLocaleDateString()}
            />

            {/* 기부 카드와 동일하게 이미지 높이를 160px로 고정 */}
            <CardMedia
              component="img"
              height="160"
              image={product.images?.[0] || "/default.png"}
              alt={product.title}
              onClick={() => navigate(`/product/read/${product.id}`)}
              sx={{ cursor: "pointer", objectFit: "cover" }}
            />

            {/* flexGrow로 남은 공간을 채워 높이를 맞춤 */}
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography sx={{ color: "text.secondary" }}>
                {product.description.length > 10
                  ? product.description.substring(0, 10) + "..."
                  : product.description}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                작성자: {product.owner?.name || "알 수 없음"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                카테고리 : {product.category?.categoryName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                시작 시간: {new Date(product.startedAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                종료 시간: {new Date(product.endAt).toLocaleString()}
              </Typography>
              <Box>
                <CardActions
                  disableSpacing
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    // px: 2,
                    pt: 1,
                    // DonationCardList의 CardContent 밑 부분 여백과 비슷한 높이를 확보
                    minHeight: 80,
                  }}
                >
                  <IconButton
                    onClick={() => {
                      const isFavorited = favorite.some(
                        (f) => f.product.id === product.id
                      );
                      if (isFavorited) {
                        const confirm =
                          window.confirm("정말 찜을 취소하시겠습니까?");
                        if (!confirm) return;
                      }
                      onToggleFavorite(product.id);
                    }}
                    sx={{ color: "primary.main" }}
                  >
                    {favorite.some((f) => f.product.id === product.id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </CardActions>
              </Box>
            </CardContent>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: 0,
                mb: 0,
              }}
            ></Box>

            {/* 태그 렌더링 */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "flex-end",
              }}
            >
              {tagsMap[product.id]?.map((tag, idx) => (
                <Box
                  key={idx}
                  sx={{
                    backgroundColor: "secondary.main",
                    padding: "4px 10px",
                    borderRadius: "16px",
                    fontSize: "0.8rem",
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}
