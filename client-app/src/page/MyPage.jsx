import React from "react";
import { Outlet } from "react-router-dom";
import MyPageLayout from "../layout/MyPageLayout.jsx";

function MyPage() {
  return (
    <MyPageLayout>
      <Outlet />
    </MyPageLayout>
  );
}

export default MyPage;
