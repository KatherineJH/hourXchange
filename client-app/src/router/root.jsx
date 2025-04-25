import { createBrowserRouter } from "react-router-dom";
import Main from "../page/Main.jsx";
import NotFound from "../component/common/NotFound.jsx";
import Homepage from "../component/homepage/Homepage.jsx";
import ChatRoom from "../component/chat/ChatRoom.jsx"; // WebSocket 채팅방


import userRouter from "./userRouter.jsx";
import productRouter from "./productRouter.jsx";
import transactionRouter from "./transactionRouter.jsx";



const root = createBrowserRouter([
  {
    path: "*",
    element: <NotFound/>
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
  }
  ,
  {
    path: "transaction",
    element: <Main />,
    children: transactionRouter(),
  }
]);

export default root;
