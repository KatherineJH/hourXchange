import React, { lazy } from "react";


const Read = lazy(() => import("../component/product/Read.jsx"));
const ListMap = lazy(() => import("../component/product/ListMap.jsx"))
const ListTable = lazy(() => import("../component/product/ListTable.jsx"))
const Save = lazy(() => import("../component/product/Save.jsx"));
const Modify = lazy(() => import("../component/product/Modify.jsx"));
const ProductForm = lazy(() => import("../component/product/ProductForm.jsx"));
const VolunteerList = lazy(() => import("../component/product/VolunteerList.jsx"))

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
        element: <VolunteerList/>
    }
]}

  ];
};


export default productRouter;
