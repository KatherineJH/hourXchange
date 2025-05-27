// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { IconButton, Box, Button, styled } from "@mui/material";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import ProductGrid from "../common/ProductGrid";
// import { getFavoriteList, postFavorite } from "../../api/productApi";
// import ListTable from "./ListTable";
// import {useSelector} from "react-redux";

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   marginLeft: "auto",
//   transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
//   transition: theme.transitions.create("transform", {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const carouselImages = [
//   "https://images.unsplash.com/photo-1582826310241-0cd9cc92dbb1?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1557660559-42497f78035b?q=80&w=1200&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?q=80&w=1200&auto=format&fit=crop",
// ];
// // 커스텀 화살표 버튼 컴포넌트
// const ArrowButton = ({ className, onClick, direction }) => (
//   <Box
//     onClick={onClick}
//     className={className}
//     sx={{
//       zIndex: 2,
//       display: "flex !important",
//       alignItems: "center",
//       justifyContent: "center",
//       width: 36,
//       height: 36,
//       backgroundColor: "rgba(0, 0, 0, 0.4)",
//       borderRadius: "50%",
//       color: "white",
//       cursor: "pointer",
//       position: "absolute",
//       top: "calc(50% - 18px)",
//       [direction === "left" ? "left" : "right"]: "12px",
//       fontSize: 24,
//       fontWeight: "bold",
//       userSelect: "none",
//     }}
//   >
//     {direction === "left" ? "‹" : "›"}
//   </Box>
// );

// const PAGE_SIZE = 4;

// export default function BuyPost() {
//   const [favorite, setFavorite] = useState([]);
//   const [expandedProductId, setExpandedProductId] = useState(null);
//   const [visibleProducts, setVisibleProducts] = useState([]);
//   const [cardRowCount, setCardRowCount] = useState(1);

//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const selectedCategory = params.get("category");
//   const user = useSelector((state) => state.auth);

//   useEffect(() => {
//       if(!user.email) return
//     getFavoriteList()
//       .then((response) => setFavorite(response.data || []))
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     setCardRowCount(1);
//   }, [visibleProducts]);

//   const handleClickFavorite = async (id) => {
//     const isFavorited = favorite.some((f) => f.product.id === id);
//     setFavorite((prev) =>
//       isFavorited
//         ? prev.filter((f) => f.product.id !== id)
//         : [...prev, { product: { id } }]
//     );
//     try {
//       await postFavorite(id);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleExpandClick = (id) => {
//     setExpandedProductId((prev) => (prev === id ? null : id));
//   };

//   const shownCards = visibleProducts.slice(0, cardRowCount * PAGE_SIZE);
//   const hasMore = shownCards.length < visibleProducts.length;

//   const carouselSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     prevArrow: <ArrowButton direction="left" />,
//     nextArrow: <ArrowButton direction="right" />,
//     adaptiveHeight: true,
//   };

//   return (
//     <>
//       <Box
//         sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//       >
//         {/* 캐러셀 */}
//         <Box
//           sx={{
//             width: "100%",
//             maxWidth: "1200px",
//             mx: "auto",
//             mt: 3,
//             position: "relative", // dots 바깥으로 빼기 위함
//             "& .slick-dots": {
//               position: "static", // dots를 아래에 고정
//               mt: 1,
//               display: "flex !important",
//               justifyContent: "center",
//             },
//             "& .slick-slide > div": {
//               display: "block !important",
//             },
//           }}
//         >
//           <Slider {...carouselSettings}>
//             {carouselImages.map((url, idx) => (
//               <Box
//                 key={idx}
//                 sx={{
//                   height: { xs: 200, sm: 300, md: 400 },
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backgroundColor: "#f5f5f5",
//                 }}
//               >
//                 <img
//                   src={url}
//                   alt={`carousel-${idx}`}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     display: "block",
//                   }}
//                 />
//               </Box>
//             ))}
//           </Slider>
//         </Box>

//         {/* Cards */}
//         <Box>
//           <ProductGrid
//             products={shownCards}
//             favorite={favorite}
//             onToggleFavorite={handleClickFavorite}
//             expandedId={expandedProductId}
//             onToggleExpand={handleExpandClick}
//           />

//           {hasMore && (
//             <Box display="flex" justifyContent="center" mt={2}>
//               <Button
//                 variant="outlined"
//                 onClick={() => setCardRowCount((prev) => prev + 1)}
//                 sx={{ borderRadius: 2 }}
//               >
//                 더 보기
//               </Button>
//             </Box>
//           )}
//         </Box>

//         {/* Table */}
//         <ListTable
//           filterProviderType="BUYER"
//           category={selectedCategory}
//           onVisibleItemsChange={setVisibleProducts}
//         />
//       </Box>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton, Box, Button, styled, Grid } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSelector } from "react-redux";

import ProductGrid from "../common/ProductGrid";
import AdsGrid from "../common/AdsGrid";
import ListTable from "./ListTable";
import { getFavoriteList, postFavorite } from "../../api/productApi";
import { getAdvertisement } from "../../api/advertisementApi";
import AdvertisementCard from "../advertisement/AdvertisementCard";

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

export default function BuyPost() {
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
  const itemsWithAds = [];
  let adIndex = 0;

  // 상품과 광고를 번갈아 배치
  for (let i = 0; i < shownProducts.length; i++) {
    itemsWithAds.push(shownProducts[i]);
    if ((i + 1) % AD_INTERVAL === 0 && adIndex < shuffledAds.length) {
      itemsWithAds.push(shuffledAds[adIndex]);
      adIndex++;
    }
  }
  // 남은 광고를 고르게 분배
  while (adIndex < shuffledAds.length && itemsWithAds.length > 0) {
    itemsWithAds.splice(
      (adIndex + 1) * (AD_INTERVAL + 1),
      0,
      shuffledAds[adIndex]
    );
    adIndex++;
  }

  const hasMore = shownProducts.length < visibleProducts.length;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* 슬라이더 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
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
      <Box>
        {/* 통합된 그리드 렌더링 */}
        <Grid
          container
          spacing={2}
          sx={{ padding: 2, justifyContent: "center" }}
        >
          {itemsWithAds.map((item) =>
            item.type === "ad" ? (
              <Grid key={`ad-${item.id}`} xs={12} sm={6} md={4} lg={3}>
                <AdvertisementCard ad={item} />
              </Grid>
            ) : (
              <Grid key={`product-${item.id}`} xs={12} sm={6} md={4} lg={3}>
                <ProductGrid
                  products={[item]}
                  favorite={favorite}
                  onToggleFavorite={handleClickFavorite}
                  expandedId={expandedProductId}
                  onToggleExpand={handleExpandClick}
                />
              </Grid>
            )
          )}
        </Grid>
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
          filterProviderType="BUYER"
          category={selectedCategory}
          onVisibleItemsChange={setVisibleProducts}
        />
      </Box>
    </Box>
  );
}
