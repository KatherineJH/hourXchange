import React, { lazy } from "react";

const AdvertisementList = lazy(
  () => import("../component/advertisement/AdvertisementList.jsx")
);
const AdvertisementForm = lazy(
  () => import("../component/advertisement/AdvertisementForm.jsx")
);
const AdvertisementDetail = lazy(
  () => import("../component/advertisement/AdvertisementDetail.jsx")
);

const advertisement = () => {
  return [
    {
      path: "list",
      element: <AdvertisementList />,
    },
    {
      path: ":id",
      element: <AdvertisementDetail />,
    },
    {
      path: "register",
      element: <AdvertisementForm />,
    },
  ];
};

export default advertisement;
