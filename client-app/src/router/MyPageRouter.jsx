import React from "react";
import Login from "../component/user/Login.jsx";
import EmailLoginForm from "../component/user/EmailLoginForm.jsx";
import Chat from "../component/chat/ChatContainer.jsx";
import Save from "../component/user/Save.jsx";

const UserRouter = () => [
    {
        path: "chat",
        element: <Chat />,
    }
];

export default UserRouter;
