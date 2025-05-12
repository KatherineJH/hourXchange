// src/component/homepage/NearMe.jsx
import React, { useEffect, useState } from "react";
import ProductGrid from "../product/ProductGrid";
import { Typography } from "@mui/material";

export default function NearMe({
  products,
  favorite,
  onToggleFavorite,
  expandedId,
  onToggleExpand,
}) {
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationAccessDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const nearby = products.filter((p) => {
          const lat = parseFloat(p.lat);
          const lng = parseFloat(p.lng);
          return (
            Math.abs(lat - latitude) < 0.01 && Math.abs(lng - longitude) < 0.01
          );
        });

        setNearbyProducts(deduplicateByUser(nearby));
      },
      (error) => {
        console.warn("위치 접근 거부됨:", error.message);
        setLocationAccessDenied(true);
      }
    );
  }, [products]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📍 내 주변의 상품 (1km)</h2>
      {locationAccessDenied ? (
        <Typography sx={{ padding: 2 }}>
          내 주변 상품을 보기 위해 <strong>위치 공유를 허용해주세요 ❤️</strong>
        </Typography>
      ) : (
        <ProductGrid
          products={nearbyProducts}
          favorite={favorite}
          onToggleFavorite={onToggleFavorite}
          expandedId={expandedId}
          onToggleExpand={onToggleExpand}
        />
      )}
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
