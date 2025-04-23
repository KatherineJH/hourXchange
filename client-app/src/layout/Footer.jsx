// src/layout/Footer.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ textAlign: "center", py: 2, color: "#777" }}>
      <Typography variant="body2">
        © 2025 HourXchange. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
