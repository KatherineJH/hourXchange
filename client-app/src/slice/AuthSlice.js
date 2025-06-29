// src/auth/AuthSlice.js
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchUser, loginUser, logoutUser} from "../api/authApi.js";

const initialState = {
  user: {
    id: '',
    email: '',
    username: '',
    name: '',
    role: '',
  },
  loading: true,
};

// 이메일 로그인 액션
export const loginUserAsync =
    createAsyncThunk("loginUserAsync", formData => loginUser(formData));

// 로그아웃 액션
export const logoutUserAsync =
    createAsyncThunk("logoutUserAsync", () => logoutUser());

// 사용자 정보 조회 액션
export const fetchUserAsync =
    createAsyncThunk("fetchUserAsync", () => fetchUser());

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    // 로그인
    builder
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        console.log(action.payload);
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          name: action.payload.name,
          role: action.payload.role,
          wallet: action.payload.wallet,
        };
      })
    // 로그아웃
    builder
      .addCase(logoutUserAsync.fulfilled, (state) => {
          state.user = initialState.user
          state.loading = false
      })
    // // 사용자 정보 조회
    builder
        .addCase(fetchUserAsync.pending, (state, action) => {
          state.loading = true
        })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          name: action.payload.name,
          role: action.payload.role,
          wallet: action.payload.wallet, 
        };
        state.loading = false
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        console.log('실패')
        state.loading = false
        state.user = initialState.user
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
