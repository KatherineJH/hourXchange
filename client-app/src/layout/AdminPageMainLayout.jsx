// src/layout/AdminPageMainLayout.jsx
import React, { useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Box, Drawer, useMediaQuery, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import AdminPageSidebar from "./AdminPageSidebar.jsx";
import AiChat from "../component/common/AiChatbotWidget.jsx";

function AdminPageMainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      {isMobile && !mobileOpen && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 80,
            left: 12,
            zIndex: 1300,
            bgcolor: "white",
            border: "1px solid #ccc",
            boxShadow: 1,
            "&:hover": { bgcolor: "#f1f1f1" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Box sx={{ display: "flex", flex: 1 }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ "& .MuiDrawer-paper": { width: 240 } }}
          >
            <AdminPageSidebar onClickAny={handleDrawerToggle} />
          </Drawer>
        ) : (
          <Box sx={{ width: 240, flexShrink: 0 }}>
            <AdminPageSidebar />
          </Box>
        )}

        <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
        <AiChat />
      </Box>
      <Footer />
    </Box>
  );
}

export default AdminPageMainLayout;
