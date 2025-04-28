// src/component/homepage/Homepage.jsx
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getList } from "../../api/productApi";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Homepage() {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getList();
        console.log("📦 받아온 상품 목록:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("상품 목록 불러오기 실패", error);
      }
    };
    fetchProducts();
  }, []);

  const handleExpandClick = (id) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  // 여기서 분류
  const activeProducts = products.slice(0, 4); // 예시: 활동이 활발한 상품
  const topRatedProducts = products.slice(4, 8); // 예시: 평가가 좋은 상품
  const nearbyProducts = products.slice(8); // 예시: 내 주변 상품

  const renderProductGrid = (productList) => (
    <Grid container spacing={2} sx={{ padding: 2, justifyContent: "center" }}>
      {productList.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {product.owner?.name ? product.owner.name[0] : "?"}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={product.title}
              subheader={new Date(product.startedAt).toLocaleDateString()}
            />
            <CardMedia
              component="img"
              height="194"
              image={product.images?.[0] || "/static/images/cards/paella.jpg"}
              alt={product.title}
            />
            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {product.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={expandedProductId === product.id}
                onClick={() => handleExpandClick(product.id)}
                aria-expanded={expandedProductId === product.id}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse
              in={expandedProductId === product.id}
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

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <h1>🏠 Home Page</h1>
      </div>

      {/* 🔥 상품 섹션별 표시 */}
      <div style={{ padding: "1rem" }}>
        <h2>🔥 활동이 활발한 상품</h2>
        {renderProductGrid(activeProducts)}

        <h2>🌟 평가가 좋은 상품</h2>
        {renderProductGrid(topRatedProducts)}

        <h2>📍 내 주변의 상품</h2>
        {renderProductGrid(nearbyProducts)}
      </div>
    </>
  );
}
