// src/component/homepage/Homepage.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFavoriteList, getList, postFavorite } from "../../api/productApi";
import New7Days from "./New7Days";
import HighRanked from "./HighRanked";
import NearMe from "./NearMe";
import ListTable from "../product/ListTable";
import ProductGrid from "../common/ProductGrid";
import TopDonatorsChart from "../common/TopDonatorChart.jsx";
import CustomHeader from "../common/CustomHeader.jsx";
import DonationCardList from "../donation/DonationCardList.jsx";
import {
  getRecentDonations,
  getTopByProgress,
  getTopByViews,
} from "../../api/donationApi.js";
import { Button, Modal, Box, Checkbox, FormControlLabel } from "@mui/material";
import { height } from "@mui/system";
import { useCookies, CookiesProvider } from "react-cookie";
import CarouselAd from "../advertisement/CarouselAd.jsx";
import AdvertisementCard from "../component/advertisement/AdvertisementCard";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 480,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  gap: 2,
};

const MODAL_HIDDEN_COOKIE_NAME = "HBB_Modal_Hidden";

export default function Homepage() {
  const [products, setProducts] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [TopByProgress, setTopByProgress] = useState([]);
  const [TopByViews, setTopByViews] = useState([]);
  const [RecentDonations, setRecentDonations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category"); // 현재 선택된 카테고리
  const filteredProducts = products.filter(
    (p) => !selectedCategory || p.category?.categoryName === selectedCategory
  );
  const [advertisement, setAdvertisement] = useState(null);
  
  const { pathname } = useLocation(); // 현재 경로
  const [cookies, setCookie] = useCookies([MODAL_HIDDEN_COOKIE_NAME]);
  const [openModal, setOpenModal] = useState(() => {
    const initialCookies = cookies; // useCookies 훅이 반환하는 초기 cookies 객체
    if (initialCookies?.[MODAL_HIDDEN_COOKIE_NAME]) {
      // 쿠키가 존재하면, 초기부터 모달을 닫힌 상태로 시작
      return false;
    }
    // 쿠키가 없다면, 초기부터 모달을 열린 상태로 시작
    return true;
  });
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (cookies[MODAL_HIDDEN_COOKIE_NAME]) {
      setOpenModal(false); // 모달 숨김용 쿠키가 있다면 모달을 닫음
    } else {
      setOpenModal(true); // 쿠키가 없다면 모달을 엶 (이 부분이 초기 openModal = true와 함께 작동)
    }
  }, [cookies, MODAL_HIDDEN_COOKIE_NAME]);

  const handleCloseModal = () => {
    setOpenModal(false);
    // 체크박스가 선택된 경우에만 MODAL_HIDDEN_COOKIE_NAME 쿠키를 설정하여 24시간 동안 모달을 숨깁니다.
    if (checked) {
      const expires = new Date();
      expires.setTime(expires.getTime() + 5 * 1000); // 현재 시간으로부터 24시간
      setCookie(MODAL_HIDDEN_COOKIE_NAME, "true", { path: "/", expires }); // 새로 정의한 쿠키 이름 사용
    }
  };

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  useEffect(() => {
    getFavoriteList()
      .then((response) => {
        setFavorite(response.data || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

  useEffect(() => {
    getTopByProgress()
      .then((response) => {
        setTopByProgress(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    getTopByViews()
      .then((response) => {
        setTopByViews(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    getRecentDonations()
      .then((response) => {
        setRecentDonations(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      {/*모달 영역 */}
      <Modal open={openModal}>
        <Box sx={{ ...modalStyle, outline: "none" }}>
          {/* 이미지 영역 */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ width: "100%" }}>
              <CarouselAd />
            </Box>
          </Box>

          {/* 체크박스 + 닫기 버튼 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="오늘 하루 보지 않기"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "1rem", // 원하는 크기로 조절
                  lineHeight: 1.2,
                },
                "& .MuiSvgIcon-root": {
                  color: (theme) => theme.palette.primary.main,
                },
              }}
            />
            <Button variant="contained" size="small" onClick={handleCloseModal}>
              닫기
            </Button>
          </Box>
        </Box>
      </Modal>
      <h1>🏠 Home Page</h1>
      <TopDonatorsChart />

      <CustomHeader text={"거의 모집이 완료된 기부"} />
      <DonationCardList
        serverDataList={TopByProgress}
        navigate={navigate}
        pathname={pathname}
      />
      <CustomHeader text={"가장 조회수가 높은 기부"} />
      <DonationCardList
        serverDataList={TopByViews}
        navigate={navigate}
        pathname={pathname}
      />
      <CustomHeader text={"가장 최근 등록된 기부"} />
      <DonationCardList
        serverDataList={RecentDonations}
        navigate={navigate}
        pathname={pathname}
      />

      <New7Days
        selectedCategory={selectedCategory}
        products={filteredProducts}
        favorite={favorite}
        onToggleFavorite={handleClickFavorite}
        expandedId={expandedProductId}
        onToggleExpand={handleExpandClick}
      />
      <HighRanked
        selectedCategory={selectedCategory}
        products={filteredProducts}
        favorite={favorite}
        onToggleFavorite={handleClickFavorite}
        expandedId={expandedProductId}
        onToggleExpand={handleExpandClick}
      />
      <NearMe
        selectedCategory={selectedCategory}
        products={filteredProducts}
        favorite={favorite}
        onToggleFavorite={handleClickFavorite}
        expandedId={expandedProductId}
        onToggleExpand={handleExpandClick}
      />
      <ListTable category={selectedCategory} />
    </div>
  );
}
