// Api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8282",
  withCredentials: true, // 쿠키 포함
});

// ✅ 요청 인터셉터: Access 토큰 헤더에 자동 주입
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 토큰 리프레시 요청을 위한 인터셉터 설정
 * - Access Token 만료 시 Refresh Token을 사용하여 새로운 Access Token을 발급받음
 */
// ✅ 응답 인터셉터 설정: Access 토큰 만료 시 Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await api.post("/api/auth/refresh", {});
        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh 토큰 실패:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;