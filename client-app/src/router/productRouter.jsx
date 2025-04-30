import React, { lazy } from "react";

const Read = lazy(() => import("../component/product/Read.jsx"));
const SellPost = lazy(() => import("../component/product/SellPost.jsx"));
const BuyPost = lazy(() => import("../component/product/BuyPost.jsx"));
const ListMap = lazy(() => import("../component/product/ListMap.jsx"));
const ListTable = lazy(() => import("../component/product/ListTable.jsx"));
const Save = lazy(() => import("../component/product/Save.jsx"));
const Modify = lazy(() => import("../component/product/Modify.jsx"));
const ProductForm = lazy(() => import("../component/product/ProductForm.jsx"));
const VolunteerList = lazy(
  () => import("../component/product/VolunteerList.jsx"),
);

const productRouter = () => {
  return [
    {
      path: "read/:id",
      element: <Read />,
    },
    {
      path: "sell",
      element: <SellPost />,
    },
    {
      path: "buy",
      element: <BuyPost />,
    },
    {
      path: "list",
      element: <ListMap />,
    },
    {
      path: "listTable",
      element: <ListTable />,
    },
    {
      path: "save",
      element: <Save />,
    },
    {
      path: "register",
      element: <ProductForm />,
    },
    {
      path: "modify/:id",
      element: <Modify />,
    },
    {
      path: "volunteer",
      element: <VolunteerList />,
    },
  ];
};
export default productRouter;
