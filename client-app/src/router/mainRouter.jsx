import React from "react";
import { lazy } from "react";
import Homepage from "../component/homepage/Homepage.jsx";
import ChatRoom from "../component/chat/ChatRoom.jsx";
import SearchProduct from "../component/homepage/SearchProduct.jsx";
import userRouter from "./userRouter.jsx";
import ProtectedRoute from "../component/common/ProtectedRoute.jsx";





const mainRouter = () => [
    {
        path: "",
        element: <Homepage />
    },
    {
        path: "chat-room/:chatRoomId",
        element: (
            <ProtectedRoute roles={['ROLE_USER']}>
                <ChatRoom />
            </ProtectedRoute>
        )
    },
    {
        path: "search",
        element: <SearchProduct />
    },
    ...userRouter(),
];

export default mainRouter;
