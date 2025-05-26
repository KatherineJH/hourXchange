// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { IconButton, Box, Button, styled } from "@mui/material";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import ProductGrid from "../common/ProductGrid";
// import { getFavoriteList, postFavorite } from "../../api/productApi";
// import ListTable from "./ListTable";
// import { useSelector } from "react-redux";
// import AdvertisementCard from "../advertisement/AdvertisementCard";

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
//     if (!user.email) return;
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

//   const singleAd = {
//     id: "single-test-ad", // 고유 ID
//     imgUrl: "/donationAd.png", // 이미지 경로. 이미지가 웹에 호스팅되어 있지 않고 로컬에 있다면, `/`로 시작하는 경로 사용
//     title: "테스트 광고 (하나만 보임)", // 광고 제목
//     description: "이 광고가 잘 나오는지 확인해봅시다!", // 광고 설명
//     linkUrl: "/product/donation", // 광고 클릭 시 이동할 URL
//   };

//   const intertionIndex = 2;

//   const items = [...shownCards];
//   i;

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

// src/component/product/BuyPost.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton, Box, Button, styled } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useSelector } from "react-redux";

import ProductGrid from "../common/ProductGrid";
import ListTable from "./ListTable";
import { getFavoriteList, postFavorite } from "../../api/productApi";
import { getAdvertisement } from "../../api/advertisementApi";

const PAGE_SIZE = 4;

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
  const [carouselDisplayImages, setCarouselDisplayImages] = useState([]);

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
        // 광고 데이터를 ProductGrid에서 구분하기 위한 'type: "ad"' 추가
        const formattedAds = data.map((ad) => ({ ...ad, type: "ad" }));
        setAdvertisements(formattedAds);
        // 광고가 로드될 때마다 순서를 섞어줍니다.
        setShuffledAds([...formattedAds].sort(() => Math.random() - 0.5));
      })
      .catch((err) => {
        console.error("광고 목록 불러오기 실패:", err);
      });
  }, []);

  // 상품 리스트 변경 시 페이지 초기화
  useEffect(() => {
    if (advertisements.length > 0) {
      // 광고 데이터가 있을 때만 셔플 시도
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
  const shownCards = visibleProducts.slice(0, cardRowCount * PAGE_SIZE);
  const hasMore = shownCards.length < visibleProducts.length;

  //광고 삽입
  const itemsWithAds = [];
  let adIndex = 0;
  const adInterval = 4; //상품 4개마다 광고 1개 삽입
  for (let i = 0; i < shownCards.length; i++) {
    itemsWithAds.push(shownCards[i]);
    if ((i + 1) % adInterval === 0 && adIndex < shuffledAds.length) {
      itemsWithAds.push(shuffledAds[adIndex]);
      adIndex++;
    }
  }

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

      {/* 상품 + 광고 그리드 */}
      <ProductGrid
        products={itemsWithAds}
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

      {/* 리스트 테이블 */}
      <ListTable
        filterProviderType="BUYER"
        category={selectedCategory}
        onVisibleItemsChange={setVisibleProducts}
      />
    </Box>
  );
}
