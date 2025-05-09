// src/auth/Reducer.js
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { loginUser, logoutUser, fetchUser } from "../api/authApi.js";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// 이메일 로그인 액션
export const loginUserAsync =
    createAsyncThunk("loginUser", (email, password) => loginUser(email, password));

// 로그아웃 액션
export const logoutUserAsync =
    createAsyncThunk("logoutUser", () => logoutUser());

// 사용자 정보 조회 액션
export const fetchUserAsync =
    createAsyncThunk("fetchUser", () => fetchUser());

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 수동으로 상태 초기화 (필요 시 사용)
    resetAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 로그인
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        console.log(action.payload);
        state.user = {
          username: action.payload.username,
          name: action.payload.name,
          role: action.payload.role,
        };
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "로그인 실패";
      });

    // 로그아웃
    builder
      .addCase(logoutUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "로그아웃 실패";
      });

    // 사용자 정보 조회
    builder
      .addCase(fetchUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          name: action.payload.name,
          role: action.payload.role,
        };
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || "사용자 정보 조회 실패";
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
