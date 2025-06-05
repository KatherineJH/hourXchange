import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton, Box, Button, styled } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSelector } from "react-redux";

import ProductGrid from "../common/ProductGrid";
import ListTable from "./ListTable";
import CategoryNav from "../../layout/CategoryNav";
import { getFavoriteList, postFavorite } from "../../api/productApi";
import { getAdvertisement } from "../../api/advertisementApi";
import AdvertisementCard from "../advertisement/AdvertisementCard"; // 광고 카드 컴포넌트 (예시)

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

const carouselImages = [
  "https://images.unsplash.com/photo-1582826310241-0cd9cc92dbb1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557660559-42497f78035b?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?q=80&w=1200&auto=format&fit=crop",
];

export default function SellPost() {
  const [favorite, setFavorite] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [cardRowCount, setCardRowCount] = useState(1);
  const [advertisements, setAdvertisements] = useState([]);
  const [shuffledAds, setShuffledAds] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category");

  // 찜 목록 가져오기
  useEffect(() => {
    getFavoriteList()
      .then((response) => setFavorite(response.data || []))
      .catch(console.error);
  }, []);

  // 광고 목록 가져오기
  useEffect(() => {
    getAdvertisement()
      .then((data) => {
        // API로부터 { content: [ { id, title, imageUrl, ... }, ... ] } 형태로 온다고 가정
        const formattedAds = data.content.map((ad) => ({ ...ad, type: "ad" }));
        setAdvertisements(formattedAds);

        // 셔플해서 초기화
        setShuffledAds([...formattedAds].sort(() => Math.random() - 0.5));
      })
      .catch((err) => {
        console.error("광고 목록 불러오기 실패:", err);
      });
  }, []);

  // visibleProducts(리스트 테이블 데이터)가 바뀔 때마다 카드 행 수 초기화 및 광고 재셔플
  useEffect(() => {
    setCardRowCount(1);
    if (advertisements.length > 0) {
      setShuffledAds([...advertisements].sort(() => Math.random() - 0.5));
    }
  }, [visibleProducts, advertisements]);

  // 찜(즐겨찾기) 클릭 핸들러
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

  // 확장(펼침) 클릭 핸들러
  const handleExpandClick = (id) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  // 1) 전체 리스트에서 현재 보여줄 카드 개수만큼 자르기
  const shownProducts = visibleProducts.slice(0, cardRowCount * PAGE_SIZE);

  // 2) 광고 삽입 로직: 3개마다 한 개씩 광고 끼워넣기
  const shouldInjectAds = shownProducts.length >= AD_INTERVAL;
  const itemsWithAds = shouldInjectAds
    ? shownProducts
        .filter((product) => !!product && !!product.id) // undefined 방지
        .reduce((acc, product, i) => {
          // 상품 객체 추가
          acc.push({
            ...product,
            key: `product-${product.id}`,
            type: "product",
          });

          // (i + 1)이 AD_INTERVAL 배수일 때 광고 삽입
          if ((i + 1) % AD_INTERVAL === 0) {
            const adIndex = Math.floor(i / AD_INTERVAL);
            const ad = shuffledAds[adIndex];
            if (ad) {
              acc.push({ ...ad, key: `ad-${ad.id}`, type: "ad" });
            }
          }
          return acc;
        }, [])
    : shownProducts.map((product) => ({
        ...product,
        key: `product-${product.id}`,
        type: "product",
      }));

  // 3) 상품+광고가 섞인 itemsWithAds에서 화면에 실제 렌더링할 개수만큼 자르기
  const DISPLAY_COUNT = PAGE_SIZE + Math.floor(PAGE_SIZE / AD_INTERVAL);
  // → 예: PAGE_SIZE=4, AD_INTERVAL=3 이면 광고이 들어갈 수 있는 최대 개수는 1개.
  //    따라서 4개 상품 + 1개 광고 = 5개 아이템을 한 페이지로 봄.
  const displayedItems = itemsWithAds.slice(0, cardRowCount * DISPLAY_COUNT);
  const hasMore = shownProducts.length < visibleProducts.length;

  // 캐러셀 설정
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
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* 카테고리 네비게이션 */}
      <CategoryNav />

      {/* 슬라이더(이미지 캐러셀) */}
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

      {/* 상품 + 광고 그리드 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1220px",
          mx: "auto",
          px: { xs: 1, sm: 2 },
          mt: 3,
        }}
      >
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
              onClick={() => setCardRowCount((prev) => prev + 1)}
              sx={{ borderRadius: 2 }}
            >
              더 보기
            </Button>
          </Box>
        )}
      </Box>

      {/* 리스트 테이블: SELLER 타입 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1220px",
          mx: "auto",
          px: { xs: 1, sm: 2 },
          mt: 3,
        }}
      >
        <ListTable
          filterProviderType="SELLER"
          category={selectedCategory}
          onVisibleItemsChange={setVisibleProducts}
        />
      </Box>
    </Box>
  );
}
