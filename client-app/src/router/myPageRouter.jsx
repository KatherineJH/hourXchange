import React, { lazy } from "react";

const MyPostList = lazy(() => import("../component/product/MyPostList.jsx"));
const MyBoardPage = lazy(() => import("../component/board/MyBoardPage.jsx"));
const Chat = lazy(() => import("../component/chat/ChatContainer.jsx"));
const Favorites = lazy(() => import("../component/product/Favorites.jsx"));
const MyWallet = lazy(() => import("../component/payment/Wallet.jsx"));
const MyDonationList = lazy(
  () => import("../component/donation/MyDonationHistoryList.jsx")
);
const AdvertisementForm = lazy(
  () => import("../component/advertisement/AdvertisementForm.jsx")
);
const AdvertisementList = lazy(
  () => import("../component/advertisement/AdvertisementList.jsx")
);

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
  {
    path: "advertisement/register",
    element: <AdvertisementForm mode="create" />,
  },
  {
    path: "advertisement/list",
    element: <AdvertisementList />,
  },
  {
    path: "advertisement/modify/:id",
    element: <AdvertisementForm mode="edit" />,
  },
];

export default myPageRouter;
