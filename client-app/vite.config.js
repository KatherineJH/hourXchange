import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    proxy: {
      // 1365 기부활동 OpenAPI 연동용
      '/openapi': {
        target: 'http://openapi.1365.go.kr',
        changeOrigin: true,
        rewrite: path => `/openapi${path.replace(/^\/openapi/, '')}`
      }
    }
  }
});
