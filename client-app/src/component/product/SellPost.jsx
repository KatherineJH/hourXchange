import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton, Box, Button, styled } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ProductGrid from "../common/ProductGrid";
import { getFavoriteList, getList, postFavorite } from "../../api/productApi";
import ListTable from "./ListTable";
import CategoryNav from "../../layout/CategoryNav";

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

const carouselImages = [
  "https://images.unsplash.com/photo-1582826310241-0cd9cc92dbb1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557660559-42497f78035b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?q=80&w=1200&auto=format&fit=crop",
];

const ArrowButton = ({ className, onClick, direction }) => (
  <Box
    onClick={onClick}
    className={className}
    sx={{
      zIndex: 2,
      display: "flex !important",
      alignItems: "center",
      justifyContent: "center",
      width: 36,
      height: 36,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      borderRadius: "50%",
      color: "white",
      cursor: "pointer",
      position: "absolute",
      top: "calc(50% - 18px)",
      [direction === "left" ? "left" : "right"]: "12px",
      fontSize: 24,
      fontWeight: "bold",
      userSelect: "none",
    }}
  >
    {direction === "left" ? "‹" : "›"}
  </Box>
);

const PAGE_SIZE = 4;

export default function SellPost() {
  const [favorite, setFavorite] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [cardRowCount, setCardRowCount] = useState(1);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category");

  useEffect(() => {
    getFavoriteList()
      .then((response) => setFavorite(response.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setCardRowCount(1);
  }, [visibleProducts]);

  const handleClickFavorite = async (id) => {
    const isFavorited = favorite.some((f) => f.product.id === id);
    setFavorite((prev) =>
      isFavorited
        ? prev.filter((f) => f.product.id !== id)
        : [...prev, { product: { id } }]
    );
    try {
      await postFavorite(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExpandClick = (id) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  const shownCards = visibleProducts.slice(0, cardRowCount * PAGE_SIZE);
  const hasMore = shownCards.length < visibleProducts.length;

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <ArrowButton direction="left" />,
    nextArrow: <ArrowButton direction="right" />,
    adaptiveHeight: true,
  };

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <CategoryNav/>
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            mt: 3,
            position: "relative",
            "& .slick-dots": {
              position: "static",
              mt: 1,
              display: "flex !important",
              justifyContent: "center",
            },
            "& .slick-slide > div": {
              display: "block !important",
            },
          }}
        >
          <Slider {...carouselSettings}>
            {carouselImages.map((url, idx) => (
              <Box
                key={idx}
                sx={{
                  height: { xs: 200, sm: 300, md: 400 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <img
                  src={url}
                  alt={`carousel-${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Cards */}
        <Box>
          <ProductGrid
            products={shownCards}
            favorite={favorite}
            onToggleFavorite={handleClickFavorite}
            expandedId={expandedProductId}
            onToggleExpand={handleExpandClick}
          />

          {hasMore && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="outlined"
                onClick={() => setCardRowCount((prev) => prev + 1)}
                sx={{ borderRadius: 2 }}
              >
                더 보기
              </Button>
            </Box>
          )}
        </Box>

        {/* Table */}
        <ListTable
          filterProviderType="SELLER"
          category={selectedCategory}
          onVisibleItemsChange={setVisibleProducts}
        />
      </Box>
    </>
  );
}
