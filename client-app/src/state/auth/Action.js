//Action.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api";

// ✅ 로그인
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("accessToken", response.data.accessToken); // ✅ localStorage 저장
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "로그인 실패");
    }
  }
);

// ✅ 로그아웃
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/logout", {});
      localStorage.removeItem("accessToken"); // ✅ localStorage 삭제
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "로그아웃 실패");
    }
  }
);

// ✅ 사용자 정보 조회
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "사용자 정보 조회 실패"
      );
    }
  }
);