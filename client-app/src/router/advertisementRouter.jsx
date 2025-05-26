import React, { lazy } from "react";

const AdvertisementList = lazy(
  () => import("../component/admin/AdvertisementList.jsx")
);
const AdvertisementForm = lazy(
  () => import("../component/admin/AdvertisementForm.jsx")
);
const AdvertisementDetail = lazy(
  () => import("../component/admin/AdvertisementDetail.jsx")
);
const AdvertisementModify = lazy(
  () => import("../component/admin/AdvertisementModify.jsx")
);

export default function advertisementRouter() {
  return [
    // 광고 목록 페이지
    {
      path: "advertisement/list",
      element: <AdvertisementList />,
    },
    // 광고 등록 페이지
    {
      path: "advertisement/register",
      element: <AdvertisementForm />,
    },
    // 광고 상세 조회
    {
      path: "advertisement/:id",
      element: <AdvertisementDetail />,
    },
    // 광고 수정 페이지
    {
      path: "advertisement/modify/:id",
      element: <AdvertisementModify />,
    },
  ];
}
