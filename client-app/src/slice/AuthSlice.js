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
  // isAuthenticated: false,
  // isLoading: false,
  // error: null,
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
  // reducers: {
  //   // 수동으로 상태 초기화 (필요 시 사용)
  //   resetAuthState: (state) => {
  //     state.user = null;
  //     state.isAuthenticated = false;
  //     state.isLoading = false;
  //     state.error = null;
  //   },
  // },
  extraReducers: (builder) => {
    // 로그인
    builder
      // .addCase(loginUserAsync.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        // state.isLoading = false;
        // state.isAuthenticated = true;
        console.log(action.payload);
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          name: action.payload.name,
          role: action.payload.role,
        };
      })
      // .addCase(loginUserAsync.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload || "로그인 실패";
      // });

    // 로그아웃
    builder
      // .addCase(logoutUserAsync.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        return initialState // 초기화
      })
      // .addCase(logoutUserAsync.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload || "로그아웃 실패";
      // });

    // // 사용자 정보 조회
    builder
    //   .addCase(fetchUserAsync.pending, (slice) => {
    //     slice.isLoading = true;
    //     slice.error = null;
    //   })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        // slice.isLoading = false;
        // slice.isAuthenticated = true;
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          username: action.payload.username,
          name: action.payload.name,
          role: action.payload.role,
        };
      })
    //   .addCase(fetchUserAsync.rejected, (slice, action) => {
    //     slice.isLoading = false;
    //     slice.isAuthenticated = false;
    //     slice.user = null;
    //     slice.error = action.payload || "사용자 정보 조회 실패";
    //   });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
