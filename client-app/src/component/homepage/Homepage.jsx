// src/component/homepage/Homepage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFavoriteList, getList, postFavorite } from "../../api/productApi";
import New7Days from "./New7Days";
import HighRanked from "./HighRanked";
import NearMe from "./NearMe";
import ListTable from "../product/ListTable";
import CustomHeader from "../common/CustomHeader.jsx";
import DonationCardList from "../donation/DonationCardList.jsx";
import {
  getRecentDonations,
  getTopByProgress,
  getTopByViews,
} from "../../api/donationApi.js";
import { Button, Modal, Box, Checkbox, FormControlLabel } from "@mui/material";
import CarouselAd from "../advertisement/CarouselAd.jsx";
import { useSelector } from "react-redux";
import CategoryNav from "../../layout/CategoryNav.jsx";

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
  const { pathname } = useLocation(); // 현재 경로
  const user = useSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(true);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    getList()
      .then((response) => {
        setProducts(response.data.content);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (!user.email) return;

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
    <Box
      sx={{ width: "100%", maxWidth: 1220, mx: "auto", px: { xs: 1, sm: 2 } }}
    >
      {/*모달 영역 */}
      <Modal open={openModal}>
        <Box sx={{ ...modalStyle, outline: "none" }}>
          {/* 이미지 영역 */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ width: "100%" }}>
              <CarouselAd />
            </Box>
          </Box>

          {/*닫기 버튼 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mt: 3,
            }}
          >
            <Box>
              <Button
                variant="contained"
                size="small"
                onClick={handleCloseModal}
              >
                닫기
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

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
      <CategoryNav />
      <ListTable category={selectedCategory} />
    </Box>
  );
}
