import React from "react";

import Chat from "../component/chat/ChatContainer.jsx";

const myPageRouter = () => [
    {
        path: "chat",
        element: <Chat />,
    }
];

export default myPageRouter;
