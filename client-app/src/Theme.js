import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#11304f", // 주 색상
    },
    secondary: {
      main: "#ff4081", // 보조 색상
    },
    background: {
      default: "#f4f4f4", // 배경 색상
    },
  },
});

export default Theme;
