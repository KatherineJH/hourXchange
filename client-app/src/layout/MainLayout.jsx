// scr/layout/MainLayout.jsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Box } from "@mui/material";

function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flex: 1 }}>
        <Box sx={{ width: 240, borderRight: "1px solid #ddd" }}>
          <Sidebar />
        </Box>
        <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default MainLayout;