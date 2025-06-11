import React, { lazy } from "react";
import ProtectedRoute from "../component/common/ProtectedRoute.jsx";

const Register = lazy(() => import("../component/donation/DonationForm.jsx"));
const Read = lazy(() => import("../component/donation/Read.jsx"));
const List = lazy(() => import("../component/donation/ListTable.jsx"));
const Modify = lazy(() => import("../component/donation/Modify.jsx"));

const donationRouter = () => {
    return [
        {
            path: "register",
            element: (
                <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
                    <Register />
                </ProtectedRoute>
            ),
        },
        {
            path: "read/:id",
            element: <Read />,
        },
        {
            path: "list",
            element: <List />,
        },
        {
            path: "modify/:id",
            element: (
                <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
                    <Modify />
                </ProtectedRoute>
            ),
        },
    ];
};

export default donationRouter;
