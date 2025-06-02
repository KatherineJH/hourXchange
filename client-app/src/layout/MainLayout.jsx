// src/layout/MainLayout.jsx
import React, { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar.jsx";
import CategoryNav from "./CategoryNav.jsx";
import Footer from "./Footer";
import { Box, Drawer, useMediaQuery, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import AiChat from "../component/common/AiChatbotWidget.jsx";

function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [forceCloseMenu, setForceCloseMenu] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md = 960px 이하

  const handleDrawerToggle = () => {
    if (mobileOpen) {
      setForceCloseMenu(true);
      setTimeout(() => setForceCloseMenu(false), 300);
    }
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      {isMobile ? (
        <>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: "fixed",
              top: 80,
              left: 12,
              zIndex: 1300,
              bgcolor: "white",
              border: "1px solid grey",
              boxShadow: 1,
              "&:hover": { bgcolor: "secondary.main" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: "50%", maxWidth: 280 },
            }}
          >
            <Navbar
              onClickAny={handleDrawerToggle}
              forceCloseMenu={forceCloseMenu}
            />
          </Drawer>
        </>
      ) : (
        <Navbar />
      )}
      <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
      <AiChat />
      <Footer />
    </Box>
  );
}

export default MainLayout;
