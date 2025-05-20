// scr/layout/MainLayout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box } from "@mui/material";
import AdminPageSidebar from "./AdminPageSidebar.jsx";
import AiChat from "../component/common/AiChatbotWidget.jsx";

function AdminPageMainLayout({ children }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <Box sx={{ display: "flex", flex: 1 }}>
                <Box sx={{ width: 240 }}>
                    <AdminPageSidebar />
                </Box>
                <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
                <AiChat/>
            </Box>
            <Footer />
        </Box>
    );
}

export default AdminPageMainLayout;
