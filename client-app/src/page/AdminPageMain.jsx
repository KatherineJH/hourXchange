import React from 'react';
import {Outlet} from "react-router-dom";
import AdminPageMainLayout from "../layout/AdminPageMainLayout.jsx";

function AdminPageMain() {

    return (
        <AdminPageMainLayout>
            <Outlet/>
        </AdminPageMainLayout>
    )
}

export default AdminPageMain;