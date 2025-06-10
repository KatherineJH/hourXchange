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
import {useHasEmail} from "../../assets/useCustomAuth.js";

const PAGE_SIZE = 4;
const AD_INTERVAL = 3;

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
    const isLoggedIn = useHasEmail();

  // 1) 찜 목록 가져오기
  useEffect(() => {
    if (!isLoggedIn) return;
    getFavoriteList()
      .then((res) => setFavorite(res.data || []))
      .catch(console.error);
  }, []);

  // 2) 광고 목록 가져오기 (data.content 사용)
  useEffect(() => {
    getAdvertisement()
      .then((data) => {
        const formattedAds = data.content.map((ad) => ({ ...ad, type: "ad" }));
        setAdvertisements(formattedAds);
        setShuffledAds([...formattedAds].sort(() => Math.random() - 0.5));
      })
      .catch((err) => {
        console.error("광고 목록 불러오기 실패:", err);
      });
  }, []);

  // 3) visibleProducts 또는 advertisements가 바뀔 때마다 카드 행 수 초기화 및 광고 재셔플
  useEffect(() => {
    setCardRowCount(1);
    if (advertisements.length > 0) {
      setShuffledAds([...advertisements].sort(() => Math.random() - 0.5));
    }
  }, [visibleProducts, advertisements]);

  // 4) 찜(즐겨찾기) 클릭 핸들러
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

  // 5) 확장(펼침) 클릭 핸들러
  const handleExpandClick = (id) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  // 6) 페이징된 상품 목록
  const shownProducts = visibleProducts.slice(0, cardRowCount * PAGE_SIZE);
  const shouldInjectAds = shownProducts.length >= AD_INTERVAL;

  // 7) 상품 + 광고 섞기
  const itemsWithAds = shouldInjectAds
    ? shownProducts
        .filter((product) => product && product.id)
        .reduce((acc, product, i) => {
          // 상품 추가
          acc.push({ ...product, key: `product-${product.id}` });

          // (i + 1)이 AD_INTERVAL 배수일 때만 광고 삽입
          if ((i + 1) % AD_INTERVAL === 0) {
            const adIndex = Math.floor(i / AD_INTERVAL);
            const ad = shuffledAds[adIndex];
            if (ad) {
              acc.push({ ...ad, key: `ad-${ad.id}`, type: "ad" });
            }
          }
          return acc;
        }, [])
    : shownProducts
        .filter((product) => product && product.id)
        .map((product) => ({
          ...product,
          key: `product-${product.id}`,
        }));

  // 8) 상품+광고가 섞인 itemsWithAds에서 화면에 실질 렌더링할 개수만큼 자르기
  const DISPLAY_COUNT = PAGE_SIZE + Math.floor(PAGE_SIZE / AD_INTERVAL);
  const displayedItems = itemsWithAds.slice(0, cardRowCount * DISPLAY_COUNT);
  const hasMore = shownProducts.length < visibleProducts.length;

  return (
    <Box
      sx={{ width: "100%", maxWidth: 1220, mx: "auto", px: { xs: 1, sm: 2 } }}
    >
      {/* 카테고리 네비게이션 */}
      <CategoryNav />
      {/* 상품 + 광고 그리드 */}
      <Box sx={{ mt: 3 }}>
        <ProductGrid
          products={displayedItems}
          favorite={favorite}
          onToggleFavorite={handleClickFavorite}
          expandedId={expandedProductId}
          onToggleExpand={handleExpandClick}
        />
        {/* “더 보기” 버튼 */}
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

      {/* 리스트 테이블 */}
      <Box>
        <ListTable
          category={selectedCategory}
          onVisibleItemsChange={setVisibleProducts}
        />
      </Box>
      {/* 슬라이더(이미지 캐러셀) */}
      <Box
        sx={{
          width: "100%",
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
    </Box>
  );
}
