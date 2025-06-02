import React from "react";
import { lazy } from "react";
import Homepage from "../component/homepage/Homepage.jsx";
import ChatRoom from "../component/chat/ChatRoom.jsx";
import SearchProduct from "../component/homepage/SearchProduct.jsx";
import userRouter from "./userRouter.jsx";





const adminPageRouter = () => [
    {
        path: "",
        element: <Homepage />
    },
    {
        path: "chat-room/:chatRoomId",
        element: <ChatRoom />
    },
    {
        path: "search",
        element: <SearchProduct />
    },
    ...userRouter(),
];

export default adminPageRouter;
