// src/component/product/Favorites.jsx
import React, { useEffect, useState } from "react";
import { getFavoriteList, postFavorite } from "../../api/productApi";
import ProductGrid from "../common/ProductGrid";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getFavoriteList()
      .then((res) => {
        const products = res.data.map((f) => f.product);
        setFavorites(products);
      })
      .catch((err) => console.error("찜 목록 로딩 실패:", err));
  }, []);

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id)); // optimistic update
  };

  const handleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>💖 찜한 상품 목록</h2>
      <ProductGrid
        products={favorites}
        favorite={favorites.map((p) => ({ product: p }))} // 찜 상태 유지
        onToggleFavorite={handleToggleFavorite}
        expandedId={expandedId}
        onToggleExpand={handleExpand}
      />
    </div>
  );
}
