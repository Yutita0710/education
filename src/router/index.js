// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Swal from "sweetalert2";

import Login from "@/views/admin/Login.vue";
import CurriculumList from "@/views/CurriculumList.vue";
import AdminCurriculumList from "@/views/admin/CurriculumList.vue";
import AddCollegeAdmin from "@/views/admin/AddCollegeAdmin.vue";

// ===== Session helper =====
function checkSession() {
  const token  = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");
  if (!token || !expiry) return false;

  const now = Date.now();
  if (now > Number(expiry)) {
    // clear แล้ว broadcast
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiry");
    if (typeof window !== "undefined") window.dispatchEvent(new Event("auth-changed"));
    return false;
  }
  return true;
}

const routes = [
  {
    path: "/",
    name: "curriculum",
    component: CurriculumList,
    meta: { breadcrumb: "หลักสูตร", sanitizeQuery: true }, // ✅ ให้ route นี้โดน sanitize
  },
  {
    path: "/admin/login",
    name: "login",
    component: Login,
    meta: { hideNavbar: true, hideFooter: true },
  },
  {
    path: "/admin/curriculum",
    name: "admin-curriculum",
    component: AdminCurriculumList,
    meta: { requiresAuth: true, breadcrumb: "จัดการหลักสูตร", sanitizeQuery: true }, // ✅ sanitize ด้วย
  },
  {
    path: "/admin/college",
    name: "add-college",
    component: AddCollegeAdmin,
    meta: { requiresAuth: true, breadcrumb: "เพิ่มสถาบัน", sanitizeQuery: true }, // เผื่อมี query
  },
];

const router = createRouter({
  // ใช้ BASE_URL ของ Vite (เช่น /education/) ให้ตรงกับการ deploy
  history: createWebHistory(import.meta.env.VITE_BASE || "/education/"),
  routes,
});

// ===== Global guard เดียว จัดการทั้ง "sanitize query" + "auth" =====
router.beforeEach(async (to, from, next) => {
  // 1) auth
  if (to.meta.requiresAuth && !checkSession()) {
    // ถ้าไม่ได้อยู่หน้า login แล้วค่อยส่งไป login
    if (to.name !== "login") {
      // (ถ้าจะโชว์ Swal, ทำก่อน next)
      await Swal.fire({
        icon: "warning",
        title: "Session หมดอายุ",
        text: "กรุณาเข้าสู่ระบบใหม่",
        confirmButtonColor: "#3B82F6",
      });
      return next({ name: "login", query: { redirect: to.fullPath } });
    }
    return next();
  }


  next();
});


export default router;
