// router/userRouter.jsx
import React from "react";
import PackagePaymentScreen from "../component/payment/Buy";

const paymentRouter = () => [
  {
    path: "buy",
    element: <PackagePaymentScreen />,
  },
];

export default paymentRouter;
