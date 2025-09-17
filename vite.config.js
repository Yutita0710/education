// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig(({ mode }) => {
  // โหลดตัวแปร .env (เช่น .env, .env.development, .env.production)
  const env = loadEnv(mode, process.cwd(), "");

  // ตั้งค่าเป้าหมาย proxy จาก env หรือใช้ค่า default
  const proxyTarget = env.VITE_API_TARGET || "https://master-dev.tfac.or.th";

  return {
    base: "/education",
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
