import React, { lazy } from "react";
import ProtectedRoute from "../component/common/ProtectedRoute.jsx";

const Read = lazy(() => import("../component/product/Read.jsx"));
const AllPost = lazy(() => import("../component/product/AllPost.jsx"));
const SellPost = lazy(() => import("../component/product/SellPost.jsx"));
const BuyPost = lazy(() => import("../component/product/BuyPost.jsx"));
const ListMap = lazy(() => import("../component/product/ListMap.jsx"));
const ListTable = lazy(() => import("../component/product/ListTable.jsx"));
const Modify = lazy(() => import("../component/product/Modify.jsx"));
const ProductForm = lazy(() => import("../component/product/ProductForm.jsx"));
const VolunteerList = lazy(
  () => import("../component/product/VolunteerList.jsx")
);
const DonationList = lazy(
  () => import("../component/donation/DonationList.jsx")
);
const SearchProduct = lazy(
  () => import("../component/homepage/SearchProduct.jsx")
);

const productRouter = () => {
  return [
    {
      path: "read/:id",
      element: <Read />,
    },
        {
      path: "all",
      element: <AllPost />,
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
      path: "register",
      element: (
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <ProductForm />
          </ProtectedRoute>
      ),
    },
    {
      path: "modify/:id",
      element: (
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <Modify />
          </ProtectedRoute>
      ),
    },
    {
      path: "volunteer",
      element: <VolunteerList />,
    },
    {
      path: "donation",
      element: <DonationList />,
    },
    {
      path: "search",
      element: <SearchProduct />,
    },
  ];
};
export default productRouter;
