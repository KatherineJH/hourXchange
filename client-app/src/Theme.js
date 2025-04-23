import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    mode: "light", // 기본 밝은 테마
    background: {
      default: "#ffffff", // 전체 배경 흰색
    },
    text: {
      primary: "#333333", // 글씨 진회색
    },
    primary: {
      main: "#23ad92", // 포인트 색상
      contrastText: "#333333", // 텍스트는 진회색
    },
  },
});

export default Theme;
