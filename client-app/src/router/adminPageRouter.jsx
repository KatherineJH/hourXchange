import React from "react";

import Chat from "../component/chat/ChatContainer.jsx";
import PaymentDashboard from "../component/admin/PaymentDashboard.jsx"
import PaymentAmountDashboard from "../component/admin/PaymentAmountDashboard.jsx"
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
    {
        path: "paymentAmount",
        element: <PaymentAmountDashboard />,
    },
    {
        path: "userList",
        element: <PaymentAmountDashboard />,
    },
];

export default adminPageRouter;
