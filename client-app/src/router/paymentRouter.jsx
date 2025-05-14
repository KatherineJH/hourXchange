// router/userRouter.jsx
import React from "react";
import Buy from "../component/payment/Buy.jsx";

const paymentRouter = () => [
    {
        path: "buy",
        element: <Buy />,
    }
];

export default paymentRouter;
