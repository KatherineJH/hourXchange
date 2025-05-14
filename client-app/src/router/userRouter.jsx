// router/userRouter.jsx
import React from "react";
import Login from "../component/user/Login.jsx";
import EmailLoginForm from "../component/user/EmailLoginForm.jsx";
import Chat from "../component/chat/ChatContainer.jsx";
import Save from "../component/user/Save.jsx";
import Favorites from "../component/product/Favorites.jsx";

const userRouter = () => [
  {
    path: "favorites", // ✅ 추가
    element: <Favorites />,
  },
  {
    path: "chat",
    element: <Chat />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "email-login",
    element: <EmailLoginForm />,
  },
  {
    path: "save",
    element: <Save/>
  }
];

export default userRouter;
