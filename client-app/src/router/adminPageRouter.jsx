import React from "react";
import { lazy } from 'react'

const PaymentDashboard        = lazy(() => import("../component/admin/PaymentDashboard.jsx"))
const PaymentAmountDashboard  = lazy(() => import("../component/admin/PaymentAmountDashboard.jsx"))
const UserDashboard           = lazy(() => import("../component/admin/UserDashboard.jsx"))
const DonationHistoryList     = lazy(() => import("../component/admin/DonationHistoryList.jsx"))
const ListTable               = lazy(() => import("../component/donation/ListTable.jsx"))
const ReadDonation            = lazy(() => import("../component/donation/Read.jsx"))
const RegisterDonation        = lazy(() => import("../component/donation/DonationForm.jsx"))
const ModifyDonation          = lazy(() => import("../component/donation/Modify.jsx"))


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
        path: "donation/list",
        element: <ListTable />,
    },
    {
        path: "donationHistoryList",
        element: <DonationHistoryList />,
    },
    {
        path: "donation/read/:id",
        element: <ReadDonation />,
    },
    {
        path: "donation/register",
        element: <RegisterDonation />,
    },
    {
        path: "donation/modify/:id",
        element: <ModifyDonation />,
    },
];

export default adminPageRouter;
