// src/router/BoardRouter.jsx
import React, { lazy } from "react";

// 지금 있는 컴포넌트만 lazy import
const BoardPage = lazy(() => import("../component/board/BoardPage.jsx"));
const BoardDetail = lazy(() => import("../component/board/BoardDetail.jsx"));

const board = () => {
  return [
    {
      path: "list",
      element: <BoardPage />, // 리스트 (검색 결과)
    },
    {
      path: ":id",
      element: <BoardDetail />, // 상세 조회
    },
  ];
};

export default board;
