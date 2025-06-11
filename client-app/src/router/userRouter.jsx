// router/userRouter.jsx
import React from "react";
import Login from "../component/user/Login.jsx";
import Chat from "../component/chat/ChatContainer.jsx";
import Save from "../component/user/Save.jsx";
import Favorites from "../component/product/Favorites.jsx";
import ProtectedRoute from "../component/common/ProtectedRoute.jsx";

const userRouter = () => [
  {
    path: "favorites",
    element: (
        <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
          <Favorites />
        </ProtectedRoute>
    ),
  },
  {
    path: "chat",
    element: (
        <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
          <Chat />
        </ProtectedRoute>
    ),
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "save",
    element: <Save/>
  }
];

export default userRouter;
