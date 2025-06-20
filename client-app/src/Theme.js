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
    // primary: {
    //   main: "#f07b5a",
    //   contrastText: "#333333", // 텍스트는 진회색
    // },
    // secondary: {
    //   main: "#f8b3a0",
    //   contrastText: "#333333", // 읽기 쉬운 텍스트 대비
    // },
    // third: {
    //   main: "#f0e6dd",
    //   contrastText: "#333333", // 읽기 쉬운 텍스트 대비
    // },
    primary: {
      main: "#82d8b5", // 연두색
      contrastText: "#333333",
    },
    secondary: {
      main: "#dcedc1", // 노란 연두
      contrastText: "#333333",
    },
    third: {
      main: "#d7f5e4", // 연한 연두
      contrastText: "#333333",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

export default Theme;
