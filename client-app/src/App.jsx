import "./App.css";

import root from './router/root.jsx'
import {RouterProvider} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Theme from "./Theme";
import {LoadScript} from "@react-google-maps/api";


function App() {
  return (
    <>
      <ThemeProvider theme={Theme}>
          <CssBaseline />
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
            <RouterProvider router={root}/>
          </LoadScript>
      </ThemeProvider>
    </>
  );
}

export default App;


