import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSelector } from "react-redux";

import ProductGrid from "../common/ProductGrid";
import ListTable from "./ListTable";
import { getFavoriteList, postFavorite } from "../../api/productApi";
import { getAdvertisement } from "../../api/advertisementApi";
import AdvertisementCard from "../advertisement/AdvertisementCard";
import CategoryNav from "../../layout/CategoryNav";

const PAGE_SIZE = 4;
const AD_INTERVAL = 3;

// 슬릭 커스텀 화살표
const ArrowButton = ({ className, onClick, direction }) => (
  <Box
    onClick={onClick}
    className={className}
    sx={{
      zIndex: 2,
      display: "flex !important",
      alignItems: "center",
      justifyContent: "center",
      width: { xs: 32, sm: 36 },
      height: { xs: 32, sm: 36 },
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

export default function AllPost() {
  const [favorite, setFavorite] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [cardRowCount, setCardRowCount] = useState(1);
  const [advertisements, setAdvertisements] = useState([]);
  const [shuffledAds, setShuffledAds] = useState([]);

  const carouselImages = [
    "https://images.unsplash.com/photo-1582826310241-0cd9cc92dbb1?w=1200",
    "https://images.unsplash.com/photo-1557660559-42497f78035b?w=1200",
    "https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?w=1200",
  ];

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

  const location = useLocation();
  const selectedCategory = new URLSearchParams(location.search).get("category");
  const user = useSelector((state) => state.auth);

  // 찜 목록 가져오기
  useEffect(() => {
    if (!user.email) return;
    getFavoriteList()
      .then((res) => setFavorite(res.data || []))
      .catch(console.error);
  }, [user.email]);

  // 광고 목록 가져오기
  useEffect(() => {
    getAdvertisement()
      .then((data) => {
        const formattedAds = data.map((ad) => ({ ...ad, type: "ad" }));
        setAdvertisements(formattedAds);
        setShuffledAds([...formattedAds].sort(() => Math.random() - 0.5));
      })
      .catch((err) => {
        console.error("광고 목록 불러오기 실패:", err);
      });
  }, []);

  // 상품 리스트 변경 시 페이지 초기화 및 광고 셔플
  useEffect(() => {
    if (advertisements.length > 0) {
      setShuffledAds([...advertisements].sort(() => Math.random() - 0.5));
    }
  }, [advertisements, visibleProducts]);

  const handleClickFavorite = async (id) => {
    const isFav = favorite.some((f) => f.product.id === id);
    setFavorite((prev) =>
      isFav
        ? prev.filter((f) => f.product.id !== id)
        : [...prev, { product: { id } }]
    );
    try {
      await postFavorite(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExpandClick = (id) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  // 페이징된 상품 목록
  const shownProducts = visibleProducts.slice(0, cardRowCount * PAGE_SIZE);
  const shouldInjectAds = shownProducts.length >= AD_INTERVAL;

  const itemsWithAds = shouldInjectAds
    ? shownProducts
        .filter((product) => product && product.id)
        .reduce((acc, product, i) => {
          acc.push({ ...product, key: `product-${product.id}` });

          const adIndex = Math.floor(i / AD_INTERVAL);
          const ad = shuffledAds[adIndex]; // ad는 조건문 전에 선언되어야 함

          if ((i + 1) % AD_INTERVAL === 0 && i && ad) {
            acc.push({ ...ad, key: `ad-${ad.id}`, type: "ad" });
          } // shuffledAds[adIndex]가 undefined일 수 있기 때문에 .id 접근 시 오류 방지

          return acc;
        }, [])
    : shownProducts
        .filter((product) => product && product.id)
        .map((product) => ({
          ...product,
          key: `product-${product.id}`,
        }));

  //"다음" 페이지로 넘기기 전
  const DISPLAY_COUNT = 5;
  const displayedItems = itemsWithAds.slice(0, cardRowCount * DISPLAY_COUNT);
  const hasMore = shownProducts.length < visibleProducts.length;

  return (
    <Box
      sx={{ width: "100%", maxWidth: 1220, mx: "auto", px: { xs: 1, sm: 2 } }}
    >
      <CategoryNav />
      {/* 슬라이더 */}
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          mt: 3,
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

      <Box sx={{ mt: 3 }}>
        <ProductGrid
          products={displayedItems}
          favorite={favorite}
          onToggleFavorite={handleClickFavorite}
          expandedId={expandedProductId}
          onToggleExpand={handleExpandClick}
        />
        {/* 더 보기 버튼 */}
        {hasMore && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              onClick={() => setCardRowCount((c) => c + 1)}
              sx={{ borderRadius: 2 }}
            >
              더 보기
            </Button>
          </Box>
        )}
      </Box>
      <Box>
        {/* 리스트 테이블 */}
        <ListTable
          category={selectedCategory}
          onVisibleItemsChange={setVisibleProducts}
        />
      </Box>
    </Box>
  );
}
