import { Gradient } from "@mui/icons-material";
import { Box } from "@mui/material";
import React from "react";
import Theme from "../../Theme.js";

export default function CheckBar() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "primary.main",
        backgroundImage: `
          linear-gradient(45deg, #F5F5DC 25%, transparent 25%),
          linear-gradient(-45deg,  #F5F5DC 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #F5F5DC 75%),
          linear-gradient(-45deg, transparent 75%, #F5F5DC 75%)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        p: 10,
      }}
    ></Box>
  );
}
