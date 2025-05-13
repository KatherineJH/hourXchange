import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Button,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getFavoriteList, getList, postFavorite } from "../../api/productApi";
import ListTable from "./ListTable";

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

export default function BuyPost() {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [favorite, setFavorite] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category"); // 현재 선택된 카테고리

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getList();
        const allProducts = response.data.content;

        const filteredByCategory = selectedCategory
          ? allProducts.filter(
              (p) => p.category?.categoryName === selectedCategory
            )
          : allProducts;

        setProducts(filteredByCategory);
      } catch (error) {
        console.error("상품 목록 불러오기 실패", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // selectedCategory가 바뀔 때마다 재요청

  useEffect(() => {
    // 좋아요 정보 조회
    getFavoriteList()
      .then((response) => {
        setFavorite(response.data || []);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClickFavorite = async (id) => {
    // 좋아요 추가
    const isFavorited = favorite.some((f) => f.product.id === id);

    // 1) 로컬 상태 바로 토글
    setFavorite(
      (prev) =>
        isFavorited
          ? prev.filter((f) => f.product.id !== id) // 이미 좋아요면 제거
          : [...prev, { product: { id } }] // 아니면 추가
    );

    console.log(id);
    try {
      const response = await postFavorite(id);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExpandClick = (id) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  const renderProductGrid = (productList) => {
    const filteredProducts = productList.filter(
      (product) => product.providerType === "BUYER"
    );

    return (
      <Grid container spacing={2} sx={{ padding: 2, justifyContent: "center" }}>
        {filteredProducts.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={4} lg={3}>
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
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => handleClickFavorite(product.id)}
                >
                  {favorite.some((i) => i.product.id === product.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
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
  };

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/product/register")}
        >
          게시물 작성
        </Button>
      </Box>
      <div style={{ padding: "1rem" }}>
        {renderProductGrid(products)} {/* 모든 상품을 한 번에 나열 */}
      </div>
      <ListTable filterProviderType="BUYER" category={selectedCategory} />
    </>
  );
}
