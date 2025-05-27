// src/common/ProductGrid.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { getReviewTagsByReceiverId } from "../../api/transactionApi";
import AdvertisementCard from "../advertisement/AdvertisementCard";

export default function ProductGrid({
  products,
  favorite,
  onToggleFavorite,
  expandedId,
  onToggleExpand,
}) {
  const navigate = useNavigate();
  const [tagsMap, setTagsMap] = useState({});

  // 상품 소유자별 리뷰 태그를 한 번에 가져오기
  useEffect(() => {
    async function fetchAllTags() {
      const newMap = {};
      // 광고 아이템(type==='ad')는 owner가 없으므로 제외
      const ownerIds = [
        ...new Set(
          products
            .filter((p) => p.type !== "ad")
            .map((p) => p.owner?.id)
            .filter(Boolean)
        ),
      ];

      await Promise.all(
        ownerIds.map(async (ownerId) => {
          try {
            const tags = await getReviewTagsByReceiverId(ownerId);
            newMap[ownerId] = tags;
          } catch (err) {
            console.error(`Failed to fetch tags for owner ${ownerId}`, err);
            newMap[ownerId] = [];
          }
        })
      );
      setTagsMap(newMap);
    }

    fetchAllTags();
  }, [products]);

  return (
    <Grid container spacing={2} sx={{ p: 2, justifyContent: "center" }}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
          {product.type === "ad" ? (
            // 광고 카드
            <AdvertisementCard ad={product} />
          ) : (
            // 일반 상품 카드
            <Card
              sx={{
                maxWidth: 345,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
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
              <CardMedia
                component="img"
                height="194"
                image={product.images?.[0] || "/default.png"}
                alt={product.title}
                onClick={() => navigate(`/product/read/${product.id}`)}
                sx={{ cursor: "pointer", objectFit: "cover" }}
              />
              <CardContent sx={{ minHeight: 64 }}>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions
                disableSpacing
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 2,
                }}
              >
                {/* 예: 즐겨찾기 버튼 */}
                <IconButton onClick={() => onToggleFavorite(product.id)}>
                  {favorite.some((f) => f.product.id === product.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                {/* 예: 상세 보기 토글 */}
                <IconButton onClick={() => onToggleExpand(product.id)}>
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>

              <Collapse
                in={expandedId === product.id}
                timeout="auto"
                unmountOnExit
              >
                <CardContent>
                  <Typography>
                    카테고리: {product.category?.categoryName}
                  </Typography>
                  <Typography>
                    시작: {new Date(product.startedAt).toLocaleString()}
                  </Typography>
                  <Typography>
                    종료: {new Date(product.endAt).toLocaleString()}
                  </Typography>
                  <Typography>
                    제공자: {product.owner?.name || "알 수 없음"}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          )}
        </Grid>
      ))}
    </Grid>
  );
}
