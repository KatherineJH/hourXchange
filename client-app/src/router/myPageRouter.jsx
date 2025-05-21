import React, { lazy } from "react";
import Chat from "../component/chat/ChatContainer.jsx";
import Favorites from "../component/product/Favorites.jsx";
import MyWallet from "../component/payment/Wallet.jsx";

const MyPostList = lazy(() => import("../component/product/MyPostList.jsx"));
const MyBoardPage = lazy(() => import("../component/board/MyBoardPage.jsx"));
const MyDonationList = lazy(() => import("../component/donation/MyDonationHistoryList.jsx"));

const myPageRouter = () => [
  {
    path: "chat",
    element: <Chat />,
  },
  {
    path: "myProducts",
    element: <MyPostList />,
  },
  {
    path: "myBoards",
    element: <MyBoardPage />,
  },
  {
    path: "favorites",
    element: <Favorites />,
  },
  {
    path: "wallet",
    element: <MyWallet />,
  },
  {
    path: "donation",
    element: <MyDonationList />,
  },
];

export default myPageRouter;
