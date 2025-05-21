import { createBrowserRouter } from "react-router-dom";
import Main from "../page/Main.jsx";
import NotFound from "../component/common/NotFound.jsx";
import Homepage from "../component/homepage/Homepage.jsx";
import ChatRoom from "../component/chat/ChatRoom.jsx"; // WebSocket 채팅방
import AdminPageMain from "../page/AdminPageMain.jsx";
import board from "./boardRouter.jsx"; // 게시판 관련 라우터
import userRouter from "./userRouter.jsx";
import productRouter from "./productRouter.jsx";
import transactionRouter from "./transactionRouter.jsx";
import MyPage from "../page/MyPage.jsx";
import myPageRouter from "./myPageRouter.jsx";
import Read from "../component/product/Read.jsx";
import ProductForm from "../component/product/ProductForm.jsx";
import Modify from "../component/product/Modify.jsx";
import MyPostList from "../component/product/MyPostList.jsx";
import SearchProduct from "../component/homepage/SearchProduct.jsx";
import adminPageRouter from "./adminPageRouter.jsx";
import paymentRouter from "./paymentRouter.jsx";
import donationRouter from "./donationRouter.jsx";
import UserAnalysisPage from "../component/analysis/UserAnalysisPage.jsx";

const root = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "",
    element: <Main />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "chat-room/:chatRoomId", element: <ChatRoom /> },
      { path: "search", element: <SearchProduct /> },
      ...userRouter(),
    ],
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
    element: <MyPage />,
    children: [
      ...myPageRouter(),
      { path: "", element: <MyPostList /> },
      {
        path: "chat-room/:chatRoomId",
        element: <ChatRoom />,
      },
      {
        path: "board",
        children: board(),
      },
      ...transactionRouter(),
      {
        path: "product",
        children: [
          { path: "read/:id", element: <Read /> },
          { path: "register", element: <ProductForm /> },
          { path: "modify/:id", element: <Modify /> },
        ],
      },
    ],
  },
  {
    path: "admin",
    element: <AdminPageMain />,
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
]);

export default root;
