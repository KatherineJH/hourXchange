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
        };
      })
    // 로그아웃
    builder
      .addCase(logoutUserAsync.fulfilled, (state) => {
        return initialState // 초기화
      })
    // // 사용자 정보 조회
    builder
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          name: action.payload.name,
          role: action.payload.role,
        };
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        console.log('실패')
        return initialState // 초기화
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
