import React, { lazy } from "react";
import Chat from "../component/chat/ChatContainer.jsx";
import Favorites from "../component/product/Favorites.jsx";
const MyPostList = lazy(() => import("../component/product/MyPostList.jsx"));
const MyBoardPage = lazy(() => import("../component/board/MyBoardPage.jsx"));

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
];

export default myPageRouter;