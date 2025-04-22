import React from 'react';
import MainLayout from "../layout/MainLayout.jsx";
import {Outlet} from "react-router-dom";

function Main() {

    return (
        <MainLayout>
            <Outlet/>
        </MainLayout>
    )
}

export default Main;