// src/component/homepage/Homepage.jsx
import React, { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { getFavoriteList, getList, postFavorite } from "../../api/productApi";
import New7Days from "./New7Days";
import HighRanked from "./HighRanked";
import NearMe from "./NearMe";
import ListTable from "../product/ListTable";
import ProductGrid from "../common/ProductGrid";
import TopDonatorsChart from "../common/TopDonatorChart.jsx";
import CustomHeader from "../common/CustomHeader.jsx";
import DonationCardList from "../donation/DonationCardList.jsx";
import {getRecentDonations, getTopByProgress, getTopByViews} from "../../api/donationApi.js";
import {useSelector} from "react-redux";

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
    const { pathname } = useLocation();              // 현재 경로
    const user = useSelector((state) => state.auth);

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
      if(!user.email) return

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
        getTopByProgress().then(response => {
            setTopByProgress(response.data)
        }).catch(error => {
            console.log(error);
        })

        getTopByViews().then(response => {
            setTopByViews(response.data)
        }).catch(error => {
            console.log(error);
        })

        getRecentDonations().then(response => {
            setRecentDonations(response.data)
        }).catch(error => {
            console.log(error);
        })
    }, [])

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🏠 Home Page</h1>
        <TopDonatorsChart/>

        <CustomHeader text={'거의 모집이 완료된 기부'}/>
        <DonationCardList serverDataList={TopByProgress} navigate={navigate} pathname={pathname}/>
        <CustomHeader text={'가장 조회수가 높은 기부'}/>
        <DonationCardList serverDataList={TopByViews} navigate={navigate} pathname={pathname}/>
        <CustomHeader text={'가장 최근 등록된 기부'}/>
        <DonationCardList serverDataList={RecentDonations} navigate={navigate} pathname={pathname}/>

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
