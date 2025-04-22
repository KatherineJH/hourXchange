import "./App.css";

import root from './router/root.jsx'
import {RouterProvider} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Theme from "./Theme";

function App() {
  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <RouterProvider router={root}/>
      </ThemeProvider>
    </>
  );
}

export default App;
