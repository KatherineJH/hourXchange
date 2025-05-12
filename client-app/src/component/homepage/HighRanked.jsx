// src/component/homepage/HighRanked.jsx
import React from "react";
import ProductGrid from "../common/ProductGrid";

export default function HighRanked({
  products,
  favorite,
  onToggleFavorite,
  expandedId,
  onToggleExpand,
}) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const filtered = [...products].filter((p) => {
    const createdAt = new Date(p.createAt);
    return (
      createdAt >= thirtyDaysAgo &&
      (p.reviewCount ?? 0) > 0 &&
      (p.starsAverage ?? 0) > 0
    );
  });

  const sorted = filtered.sort(
    (a, b) => popularityScore(b) - popularityScore(a)
  );

  const deduplicated = deduplicateByUser(sorted);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🌟 최근 한 달간 신뢰 기반 인기 상품</h2>
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

const popularityScore = (p) => {
  const stars = p.starsAverage ?? 0;
  const reviews = p.reviewCount ?? 0;
  const favorites = p.favoriteCount ?? 0;
  const starsScore = stars * Math.log2(reviews + 1);
  const favoriteScore = Math.log2(favorites + 1) * 0.5;
  return starsScore + favoriteScore;
};

const deduplicateByUser = (products) => {
  const seen = new Set();
  return products.filter((p) => {
    const userId = p.owner?.id;
    if (!userId || seen.has(userId)) return false;
    seen.add(userId);
    return true;
  });
};
