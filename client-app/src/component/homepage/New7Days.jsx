// src/component/homepage/New7Days.jsx
import React from "react";
import ProductGrid from "../common/ProductGrid";
import { Typography } from "@mui/material";

export default function New7Days({
  selectedCategory,
  products,
  favorite,
  onToggleFavorite,
  expandedId,
  onToggleExpand,
}) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filtered = [...products].filter(
    (p) =>
      new Date(p.startedAt) >= sevenDaysAgo &&
      (!selectedCategory || p.category?.categoryName === selectedCategory) // 홈 사이드 카테고리 필터링
  );

  const deduplicated = deduplicateByUser(filtered);

  // console.log("New7Days 전체:", products.length);
  // console.log("필터링 조건 (7일 이내 + 카테고리):", filtered.map((p) => p.title));
  // console.log("중복 제거 후:", deduplicated.map((p) => p.title));

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        🔥 최근 7일 내 올라온 상품
      </Typography>
      <ProductGrid
        products={deduplicated}
        favorite={favorite}
        onToggleFavorite={onToggleFavorite}
        expandedId={expandedId}
        onToggleExpand={onToggleExpand}
      />
    </div>
  );
}

const deduplicateByUser = (products) => {
  const seen = new Set();
  return products.filter((p) => {
    const userId = p.owner?.id;
    if (!userId || seen.has(userId)) return false;
    seen.add(userId);
    return true;
  });
};
