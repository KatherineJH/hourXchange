import React, { lazy } from "react";

import ChatRoom from "../component/chat/ChatRoom.jsx";
import board from "./boardRouter.jsx";
import Read from "../component/product/Read.jsx";
import ProductForm from "../component/product/ProductForm.jsx";
import transactionRouter from "./transactionRouter.jsx";
import Modify from "../component/product/Modify.jsx";
const ModifyUser = lazy(() => import("../component/user/Modify.jsx"));
const MyAccount = lazy(() => import("../component/user/MyAccount.jsx"));
const MyPostList = lazy(() => import("../component/product/MyPostList.jsx"));
const MyBoardPage = lazy(() => import("../component/board/MyBoardPage.jsx"));
const Chat = lazy(() => import("../component/chat/ChatContainer.jsx"));
const Favorites = lazy(() => import("../component/product/Favorites.jsx"));
const MyWallet = lazy(() => import("../component/payment/Wallet.jsx"));
const MyDonationHistoryList = lazy(
  () => import("../component/donation/MyDonationHistoryList.jsx")
);
const MyDonationList = lazy(() => import("../component/donation/MyDonationList.jsx"));
const AdvertisementForm = lazy(
  () => import("../component/advertisement/AdvertisementForm.jsx")
);
const AdvertisementList = lazy(
  () => import("../component/advertisement/AdvertisementList.jsx")
);

const myPageRouter = () => [
  {
    path: "",
    element: <MyAccount />,
  },
  {
    path: "edit",
    element: <ModifyUser />,
  },
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
    path: "donationHistory",
    element: <MyDonationHistoryList />,
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
  {
    path: "chat-room/:chatRoomId",
    element: <ChatRoom />,
  },
  {
    path: "board",
    children: board(),
  },
  {
    path: "product",
    children: [
      { path: "read/:id", element: <Read /> },
      { path: "register", element: <ProductForm /> },
      { path: "modify/:id", element: <Modify /> },
    ],
  },
  ...transactionRouter(),
];

export default myPageRouter;
