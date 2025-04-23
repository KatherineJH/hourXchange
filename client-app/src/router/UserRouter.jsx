// router/UserRouter.jsx
import React from "react";
import Login from "../component/login/Login.jsx";
import EmailLoginForm from "../component/login/EmailLoginForm.jsx";
import Chat from "../component/chat/ChatContainer.jsx";

const UserRouter = () => [
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
];

export default UserRouter;
