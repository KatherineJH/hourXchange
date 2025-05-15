import React, { lazy } from "react";

const List = lazy(() => import("../component/transaction/List.jsx"));
const MyList = lazy(() => import("../component/transaction/MyList.jsx"));
const MyProductList = lazy(
  () => import("../component/product/MyProductList.jsx")
);
const MyBoardList = lazy(() => import("../component/board/MyBoardList.jsx"));

const serviceProductRouter = () => {
  return [
    // {
    //     path: "read/:id",
    //     element: <Read/>
    // },
    {
      path: "list",
      element: <List />,
    },
    {
      path: "my",
      element: <MyList />,
    },
    {
      path: "my-products",
      element: <MyProductList />,
    },
    {
      path: "my-board",
      element: <MyBoardList />,
    },
    // {
    //     path: "save",
    //     element: <Save/>
    // },
    // {
    //     path: "modify/:id",
    //     element: <Modify/>
    // },
  ];
};

export default serviceProductRouter;
