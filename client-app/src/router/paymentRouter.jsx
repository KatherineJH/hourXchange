// router/userRouter.jsx
import React from "react";
import PackagePaymentScreen from "../component/payment/Buy";
import ProtectedRoute from "../component/common/ProtectedRoute.jsx";

const paymentRouter = () => [
  {
    path: "buy",
    element: (
        <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
          <PackagePaymentScreen />
        </ProtectedRoute>
    ),
  },
];

export default paymentRouter;
