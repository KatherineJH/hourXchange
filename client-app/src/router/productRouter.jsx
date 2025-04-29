import React, { lazy } from "react";

const Read = lazy(() => import("../component/product/Read.jsx"));
const List = lazy(() => import("../component/product/List.jsx"));
const Save = lazy(() => import("../component/product/Save.jsx"));
const ProductForm = lazy(() => import("../component/product/ProductForm.jsx"));

const Modify = lazy(() => import("../component/product/Modify.jsx"));

const productRouter = () => {
  return [
    {
      path: "read/:id",
      element: <Read />,
    },
    {
      path: "list",
      element: <List />,
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
  ];
};

export default productRouter;
