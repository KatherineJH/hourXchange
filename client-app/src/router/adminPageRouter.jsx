import React from "react";
import { lazy } from "react";

const PaymentDashboard        = lazy(() => import("../component/admin/PaymentDashboard.jsx"))
const PaymentAmountDashboard  = lazy(() => import("../component/admin/PaymentAmountDashboard.jsx"))
const UserDashboard           = lazy(() => import("../component/admin/UserDashboard.jsx"))
const DonationHistoryList     = lazy(() => import("../component/admin/DonationHistoryList.jsx"))
const UserList = lazy(() => import("../component/admin/UserList.jsx"))
const CategoryList = lazy(() => import("../component/admin/CategoryList.jsx"))
const TransactionList = lazy(() => import("../component/admin/TransactionList.jsx"))
const OrderList = lazy(() => import("../component/admin/OrderList.jsx"))
const PaymentList = lazy(() => import("../component/admin/PaymentList.jsx"))
const DonationList = lazy(() => import("../component/admin/DonationList.jsx"))

const ReadDonation            = lazy(() => import("../component/donation/Read.jsx"))
const RegisterDonation        = lazy(() => import("../component/donation/DonationForm.jsx"))
const ModifyDonation          = lazy(() => import("../component/donation/Modify.jsx"))
const UserAnalysisPage        = lazy(() => import("../component/analysis/UserAnalysisPage.jsx"));
const UserDetailPage          = lazy(() => import("../component/analysis/UserDetailPage.jsx"));
const PaymentDashboard = lazy(
  () => import("../component/admin/PaymentDashboard.jsx")
);
const PaymentAmountDashboard = lazy(
  () => import("../component/admin/PaymentAmountDashboard.jsx")
);
const UserDashboard = lazy(
  () => import("../component/admin/UserDashboard.jsx")
);
const DonationHistoryList = lazy(
  () => import("../component/admin/DonationHistoryList.jsx")
);
const ListTable = lazy(() => import("../component/donation/ListTable.jsx"));
const ReadDonation = lazy(() => import("../component/donation/Read.jsx"));
const RegisterDonation = lazy(
  () => import("../component/donation/DonationForm.jsx")
);
const ModifyDonation = lazy(() => import("../component/donation/Modify.jsx"));
const UserAnalysisPage = lazy(
  () => import("../component/analysis/UserAnalysisPage.jsx")
);
const UserDetailPage = lazy(
  () => import("../component/analysis/UserDetailPage.jsx")
);
const getAdvertisement = lazy(
  () => import("../component/advertisement/AdminAdvertisement.jsx")
);
const PaymentAnalysisPage = lazy(
  () => import("../component/analysis/PaymentAnalysisPage.jsx")
);
const DonationAnalysisPage = lazy(
  () => import("../component/analysis/DonationAnalysisPage.jsx")
);
const AdminAdvertisementList = lazy(
  () => import("../component/advertisement/AdminAdvertisement.jsx")
);



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
        path: "userList",
        element: <UserList />,
    },
    {
        path: "categoryList",
        element: <CategoryList />,
    },
    {
        path: "transactionList",
        element: <TransactionList />,
    },
    {
        path: "orderList",
        element: <OrderList />,
    },
    {
        path: "paymentList",
        element: <PaymentList />,
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
  {
    path: "advertisement/list",
    element: <AdminAdvertisementList />,
  },
  {
    path: "userAnalysis",
    element: <UserAnalysisPage />,
  },
  {
    path: "user/:id",
    element: <UserDetailPage />,
  },
  {
    path: "salesAnalysis",
    element: <PaymentAnalysisPage />
  },
    {
    path: "donationAnalysis",
    element: <DonationAnalysisPage />
  },
];

export default adminPageRouter;
