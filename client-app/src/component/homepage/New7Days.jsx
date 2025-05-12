// src/component/homepage/New7Days.jsx
import React from "react";
import ProductGrid from "./ProductGrid";

export default function New7Days({
  products,
  favorite,
  onToggleFavorite,
  expandedId,
  onToggleExpand,
}) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filtered = [...products].filter(
    (p) => new Date(p.startedAt) >= sevenDaysAgo
  );

  const deduplicated = deduplicateByUser(filtered);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🔥 최근 7일 내 올라온 상품</h2>
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
