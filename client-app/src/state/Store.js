import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Reducer.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
