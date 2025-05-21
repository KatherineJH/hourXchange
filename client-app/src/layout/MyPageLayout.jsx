// scr/layout/MainLayout.jsx
import React from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";
import { Box } from "@mui/material";
import MyPageSidebar from "./MyPageSidebar.jsx";
import AiChat from "../component/common/AiChatbotWidget.jsx";

function MyPageLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flex: 1 }}>
        <Box sx={{ width: 240 }}>
          <MyPageSidebar />
        </Box>
        <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
          <AiChat/>
      </Box>
      <Footer />
    </Box>
  );
}

export default MyPageLayout;
