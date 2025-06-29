// src/layout/MyPageLayout.jsx
import React, { useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Box, Drawer, useMediaQuery, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import MyPageSidebar from "./MyPageSidebar.jsx";
import AiChat from "../component/common/AiChatbotWidget.jsx";

function MyPageLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ zIndex: 1201, position: "relative" }}>
        <Header />
      </Box>{" "}
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
      <Box sx={{ flex: 1, display: "flex" }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ "& .MuiDrawer-paper": { width: 240 } }}
          >
            <MyPageSidebar onClickAny={handleDrawerToggle} />
          </Drawer>
        ) : (
          <Box sx={{ width: 240, flexShrink: 0 }}>
            <MyPageSidebar />
          </Box>
        )}

        <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
        <AiChat />
      </Box>
      <Footer />
    </Box>
  );
}

export default MyPageLayout;
