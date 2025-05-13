import { createBrowserRouter } from "react-router-dom";
import Main from "../page/Main.jsx";
import NotFound from "../component/common/NotFound.jsx";
import Homepage from "../component/homepage/Homepage.jsx";
import ChatRoom from "../component/chat/ChatRoom.jsx"; // WebSocket 채팅방
import MyPageMain from "../page/MyPageMain.jsx";
import AdminPageMain from "../page/AdminPageMain.jsx";

import board from "./boardRouter.jsx"; // 게시판 관련 라우터
import userRouter from "./userRouter.jsx";
import productRouter from "./productRouter.jsx";
import transactionRouter from "./transactionRouter.jsx";
import myPageRouter from "./myPageRouter.jsx";
import adminPageRouter from "./adminPageRouter.jsx";
import paymentRouter from "./paymentRouter.jsx";

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
    element: <MyPageMain />,
    children: myPageRouter(),
  },
  {
    path: "admin",
    element: <AdminPageMain />,
    children: adminPageRouter(),
  },

]);

export default root;
