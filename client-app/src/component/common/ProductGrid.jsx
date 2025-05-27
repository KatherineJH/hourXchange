// src/component/product/ProductGrid.jsx
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
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { getReviewTagsByReceiverId } from "../../api/transactionApi";

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
      const ownerIds = [
        ...new Set(products.map((p) => p.owner?.id).filter(Boolean)),
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
    };

    fetchAllTags();
  }, [products]);

  return (
    <Grid container spacing={2} sx={{ padding: 2, justifyContent: "center" }}>
      {products.map((product) => (
        <Grid key={product.id} xs={12} sm={6} md={4} lg={3}>
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
              sx={{ cursor: "pointer" }}
            />
            <CardContent sx={{ minHeight: 64 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {product.description}
              </Typography>
            </CardContent>
            <CardActions
              disableSpacing
              sx={{
                flexDirection: "column",
                alignItems: "stretch",
                px: 2,
                pt: 1,
                minHeight: 92, // 🔒 reserve space even when no tags
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  mb: 1,
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
                >
                  {favorite.some((f) => f.product.id === product.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => onToggleExpand(product.id)}
                >
                  <ExpandMoreIcon />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    (상세보기 클릭)
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "flex-end",
                }}
              >
                {tagsMap[product.owner?.id]?.map((tag, idx) => (
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
            </CardActions>

            <Collapse
              in={expandedId === product.id}
              timeout="auto"
              unmountOnExit
            >
              <CardContent>
                <Typography sx={{ marginBottom: 1 }}>
                  카테고리: {product.category?.categoryName}
                </Typography>
                <Typography sx={{ marginBottom: 1 }}>
                  시작 시간: {new Date(product.startedAt).toLocaleString()}
                </Typography>
                <Typography sx={{ marginBottom: 1 }}>
                  종료 시간: {new Date(product.endAt).toLocaleString()}
                </Typography>
                <Typography sx={{ marginBottom: 1 }}>
                  제공자: {product.owner?.name || "알 수 없음"}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
