// src/router/root.jsx

import { createBrowserRouter, Outlet } from "react-router-dom";
import Main from "../page/Main.jsx";
import AdminPageMain from "../page/AdminPageMain.jsx";
import MyPage from "../page/MyPage.jsx";

import NotFound from "../component/common/NotFound.jsx";
import ErrorPage from "../component/common/ErrorPage.jsx";
import board from "./boardRouter.jsx"; // 게시판 관련 라우터
import productRouter from "./productRouter.jsx";
import transactionRouter from "./transactionRouter.jsx";
import myPageRouter from "./myPageRouter.jsx";
import adminPageRouter from "./adminPageRouter.jsx";
import paymentRouter from "./paymentRouter.jsx";
import donationRouter from "./donationRouter.jsx";
import UserAnalysisPage from "../component/analysis/UserAnalysisPage.jsx";
import HourXChangeMain from "../component/homepage/HourXChangeMain.jsx";
import Save from "../component/user/Save.jsx";
import EmailLoginForm from "../component/user/Login.jsx";
import mainRouter from "./mainRouter.jsx";
import ProtectedRoute from "../component/common/ProtectedRoute.jsx";
import PublicRoute from "../component/common/PublicRoute.jsx";
import Unauthorized from "../component/common/Unauthorized.jsx";

import advertisementRouter from "./advertisementRouter.jsx";

const root = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />, // 최상위 Outlet을 반드시 넣어야 자식이 렌더됩니다
    errorElement: <ErrorPage />, // 한 번만 지정하면 모든 하위 경로에 적용
    children: [
      {
        index: true,
        element: <HourXChangeMain />, // "/" 접속 시 표시될 컴포넌트
      },
      {
        path: "login",
        element: (
            <PublicRoute>
              <EmailLoginForm />
            </PublicRoute>
        ),
      },
      {
        path: "save",
        element: (
            <PublicRoute>
              <Save />
            </PublicRoute>
        ),
      },
      {
        path: "main",
        element: <Main />,
        children: mainRouter(),
      },
      {
        path: "product",
        element: <Main />,
        children: productRouter(),
      },
      {
        path: "board",
        element: <Main />,
        children: board(),
      },
      {
        path: "transaction",
        element: <Main />,
        children: transactionRouter(),
      },
      {
        path: "payment",
        element: <Main />,
        children: paymentRouter(),
      },
      {
        path: "myPage",
        element: (
            <ProtectedRoute roles={['ROLE_USER']}>
              <MyPage />
            </ProtectedRoute>
        ),
        children: myPageRouter(),
      },
      {
        path: "advertisement",
        element: <Main />,
        children: advertisementRouter(),
      },
      {
        path: "admin",
        element: (
            <ProtectedRoute roles={['ROLE_ADMIN']}>
              <AdminPageMain />
            </ProtectedRoute>
        ),
        children: adminPageRouter(),
      },
      {
        path: "donation",
        element: <Main />,
        children: donationRouter(),
      },
      {
        path: "userAnalysis",
        element: <UserAnalysisPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
]);

export default root;
