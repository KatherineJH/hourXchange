// router/userRouter.jsx
import React from "react";
import PackagePaymentScreen from "../component/payment/Buy.jsx";

const paymentRouter = () => [
  {
    path: "buy",
    element: <PackagePaymentScreen />,
  },
];

export default paymentRouter;
