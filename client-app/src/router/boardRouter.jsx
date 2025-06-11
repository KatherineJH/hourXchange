// src/router/boardRouter.jsx
import React, { lazy } from "react";
import ProtectedRoute from "../component/common/ProtectedRoute.jsx";

// 지금 있는 컴포넌트만 lazy import
const BoardPage = lazy(() => import("../component/board/BoardPage.jsx"));
const BoardDetail = lazy(() => import("../component/board/BoardDetail.jsx"));
const SaveBoard = lazy(() => import("../component/board/SaveBoard.jsx"));

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
    {
      path: "save",
      element: (
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <SaveBoard />
          </ProtectedRoute>
      ), // 게시글 작성
    },
    {
      path: "update/:id",
      element: (
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <SaveBoard />
          </ProtectedRoute>
      ), // SaveBoard 재활용
    },
  ];
};

export default board;
