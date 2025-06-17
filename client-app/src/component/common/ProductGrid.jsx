import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import AdvertisementCard from "../advertisement/AdvertisementCard";

export default function ProductGrid({ products, favorite, onToggleFavorite }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        mt: 2,
        width: "100%",
        justifyItems: "start",
        justifyContent: "flex-start",
      }}
    >
      {products.map((product) => {
        console.log(product);
        if (product.type === "ad") {
          return <AdvertisementCard key={`ad-${product.id}`} ad={product} />;
        }

        return (
          <Card
            key={`product-${product.id}`}
            onClick={() => navigate(`/product/read/${product.id}`)}
            sx={{
              maxWidth: 345,
              width: "100%",
              height: 420,
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
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 방지

                    if (!isLoggedIn) {
                      alert("로그인 후 찜할 수 있습니다.");
                      return;
                    }

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
              }
              title={product.title}
              subheader={new Date(product.startedAt).toLocaleDateString()}
            />

            <CardMedia
              component="img"
              height="160"
              image={product.images?.[0] || "/default.png"}
              alt={product.title}
              onError={(e) => (e.target.src = "/default.png")}
              onClick={() => navigate(`/product/read/${product.id}`)}
              sx={{ cursor: "pointer", objectFit: "cover" }}
            />

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography sx={{ color: "text.secondary" }}>
                {product.description.length > 10
                  ? product.description.substring(0, 20) + "..."
                  : product.description}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                작성자: {product.owner?.name || "알 수 없음"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                카테고리 : {product.category?.categoryName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                날짜 : {new Date(product.startedAt).toLocaleDateString("ko-KR")}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                시간:{" "}
                {(() => {
                  const m = Math.floor(
                    (new Date(product.endAt) - new Date(product.startedAt)) /
                      60000
                  );
                  return `${Math.floor(m / 60)}시간 ${m % 60}분`;
                })()}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                타입:{" "}
                {product.providerType === "SELLER"
                  ? "판매"
                  : product.providerType === "BUYER"
                    ? "구매"
                    : product.providerType}
              </Typography>

              {/* 태그 렌더링 */}
              {Array.isArray(product.tags) && product.tags.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                    justifyContent: "flex-start",
                  }}
                >
                  {product.tags.map((tag, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        backgroundColor: "secondary.main",
                        color: "#000",
                        padding: "4px 10px",
                        borderRadius: "16px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
