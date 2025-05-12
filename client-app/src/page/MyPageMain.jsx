import React from 'react';
import MainLayout from "../layout/MainLayout.jsx";
import {Outlet} from "react-router-dom";
import MyPageMainLayout from "../layout/MyPageMainLayout.jsx";

function MyPageMain() {

    return (
        <MyPageMainLayout>
            <Outlet/>
        </MyPageMainLayout>
    )
}

export default MyPageMain;