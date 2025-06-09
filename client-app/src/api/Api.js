// Api.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // 쿠키 포함
});

/**
 * 토큰 리프레시 요청을 위한 인터셉터 설정
 * - Access Token 만료 시 Refresh Token을 사용하여 새로운 Access Token을 발급받음
 */
// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access Token 만료 → Refresh 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await api.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        // 재요청
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh 토큰도 실패:", refreshError);
        // 필요 시 로그아웃 처리도 가능
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
