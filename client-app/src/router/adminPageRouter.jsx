import React from "react";

import Chat from "../component/chat/ChatContainer.jsx";
import PaymentDashboard from "../component/admin/PaymentDashboard.jsx"
import UserDashboard from "../component/admin/UserDashboard.jsx"

const adminPageRouter = () => [
    {
        path: "",
        element: <PaymentDashboard />,
    },
    {
        path: "user",
        element: <UserDashboard />,
    },
    {
        path: "payment",
        element: <PaymentDashboard />,
    },

];

export default adminPageRouter;
