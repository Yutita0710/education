// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./assets/vue-select.tailwind.css";
import { initSessionGuard } from "./utils/session";


const app = createApp(App);

// เรียกใช้ Session Guard ก่อน mount
initSessionGuard(router, {
  ttlMs: Number(import.meta.env.VITE_SESSION_TTL_MS) || 60 * 60 * 1000, // 1 ชม.
  loginRoute: "/admin/login", // ให้ตรงกับ route จริง
  isProtectedRoute: (to) => to.path.startsWith("/admin") && to.path !== "/admin/login",
});

app.use(router);
app.mount("#app");
