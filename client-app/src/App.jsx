import "./App.css";

import root from './router/root.jsx'
import {RouterProvider} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Theme from "./Theme";
import {useEffect} from "react";
import {fetchUserAsync} from "./slice/AuthSlice.js";
import {useDispatch, useSelector} from "react-redux";


function App() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
        // user.email이 빈 문자열("")인 경우에만 한 번 호출
        if (!user.email) {
            dispatch(fetchUserAsync());
        }
        console.log(user)
    }, [dispatch, user.email]);

  return (
    <>
      <ThemeProvider theme={Theme}>
          <CssBaseline />
            <RouterProvider router={root} />
      </ThemeProvider>
    </>
  );
}

export default App;


