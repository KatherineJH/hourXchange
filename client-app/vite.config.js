import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis", // ✅ 핵심: global 오류 해결
  },
  server: {
    proxy: {
      '/openapi': {
        target: 'http://openapi.1365.go.kr',
        changeOrigin: true,
        // 경로 앞에 /openapi 를 다시 붙여서 올바른 경로로 요청
        rewrite: path => `/openapi${path.replace(/^\/openapi/, '')}`
      }
    }
  }
});
