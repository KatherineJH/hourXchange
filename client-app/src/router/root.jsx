import { createBrowserRouter } from "react-router-dom";
import Main from "../page/Main.jsx";
import Homepage from "../component/homepage/Homepage.jsx";
import ChatRoom from "../component/chat/ChatRoom.jsx"; // WebSocket 채팅방
import UserRouter from "./UserRouter.jsx";
import serviceProduct from "./serviceProduct.jsx";

const root = createBrowserRouter([
  {
    path: "",
    element: <Main />, 
    children: [
      { index: true, element: <Homepage /> },
      { path: "chat-room/:chatRoomId", element: <ChatRoom /> },
      ...UserRouter(), // /chat 등
    ],
  },
  {
    path: "serviceProduct",
    element: <Main />,
    children: serviceProduct(),
  }
]);

export default root;
