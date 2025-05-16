import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { IconButton, Box } from "@mui/material";
import ProductGrid from "../common/ProductGrid";
import { getFavoriteList, getList, postFavorite } from "../../api/productApi";

import ListTable from "./ListTable";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function SellPost() {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [favorite, setFavorite] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getList();
        const allProducts = response.data.content;
        const filtered = selectedCategory
          ? allProducts.filter(
              (p) => p.category?.categoryName === selectedCategory
            )
          : allProducts;
        setProducts(filtered);
      } catch (error) {
        console.error("상품 목록 불러오기 실패", error);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    getFavoriteList()
      .then((response) => setFavorite(response.data || []))
      .catch(console.error);
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

  const sellerProducts = products.filter((p) => p.providerType === "SELLER");

  return (
    <>
      <Box>
        <ProductGrid
          products={sellerProducts}
          favorite={favorite}
          onToggleFavorite={handleClickFavorite}
          expandedId={expandedProductId}
          onToggleExpand={handleExpandClick}
        />
      </Box>
      <ListTable filterProviderType="SELLER" category={selectedCategory} />
    </>
  );
}
