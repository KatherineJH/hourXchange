import { createBrowserRouter } from "react-router-dom";
import Main from "../page/Main.jsx";
import NotFound from "../component/common/NotFound.jsx";
import Homepage from "../component/homepage/Homepage.jsx";
import ChatRoom from "../component/chat/ChatRoom.jsx"; // WebSocket 채팅방
import board from "./BoardRouter.jsx"; // 게시판 관련 라우터
import userRouter from "./userRouter.jsx";
import productRouter from "./productRouter.jsx";
import transactionRouter from "./transactionRouter.jsx";
import MyPage from "../page/MyPage.jsx";
import MyPageRouter from "./MyPageRouter.jsx";
import Read from "../component/product/Read.jsx";
import ProductForm from "../component/product/ProductForm.jsx";
import Modify from "../component/product/Modify.jsx";

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
      ...userRouter(), // /chat 등
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
    path: "myPage",
    element: <MyPage />,
    children: [
      ...MyPageRouter(),
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
]);

export default root;
