// src/auth/Action.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api";

// 이메일 로그인 액션
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "로그인 실패");
    }
  },
);

// 로그아웃 액션
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/logout", {});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "로그아웃 실패");
    }
  },
);

// 사용자 정보 조회 액션
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "사용자 정보 조회 실패");
    }
  },
);
