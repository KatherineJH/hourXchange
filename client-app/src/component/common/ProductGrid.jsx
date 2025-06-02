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
  ListItem,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
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
            console.error(`Failed to fetch tags for product ${product.id}`, err);
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
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        mt: 2,
      }}
    >
      {products.map((product) => {
        if (product.type === "ad") {
          return <AdvertisementCard key={`ad-{product.id}`} ad={product} />;
        }
        return (
          <Card
            key={`product-${product.id}`}
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
                minHeight: 92,
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
                      const confirm = window.confirm("정말 찜을 취소하시겠습니까?");
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

              {/* product.id 기준 태그 렌더링 */}
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
        );
      })}
    </Box>
  );
}
