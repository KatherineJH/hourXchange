import "./App.css";

import root from './router/root.jsx'
import {RouterProvider} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Theme from "./Theme";
import React, { useEffect } from "react";
import {fetchUserAsync} from "./slice/AuthSlice.js";
import {useDispatch} from "react-redux";
import LoadingSpinner from "./component/common/LoadingSpinner.jsx";


function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUserAsync());
    }, [dispatch]);

  return (
    <>
      <ThemeProvider theme={Theme}>
          <CssBaseline />
          <React.Suspense fallback={<LoadingSpinner/>}>
              <RouterProvider router={root} />
          </React.Suspense>
      </ThemeProvider>
    </>
  );
}

export default App;


