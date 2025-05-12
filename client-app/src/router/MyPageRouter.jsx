import React, { lazy } from "react";
import Chat from "../component/chat/ChatContainer.jsx";
const MyPostList = lazy(() => import("../component/product/MyPostList.jsx"));
const MyBoardPage = lazy(() => import("../component/board/MyBoardPage.jsx"));

const MyPageRouter = () => [
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
];

export default MyPageRouter;
