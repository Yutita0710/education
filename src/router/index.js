import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/admin/Login.vue";
import Swal from "sweetalert2";
import CurriculumList from "@/views/CurriculumList.vue";
import AdminCurriculumList from "@/views/admin/CurriculumList.vue";
import AddCollegeAdmin from "@/views/admin/AddCollegeAdmin.vue";

// ตรวจสอบ token และเวลา session
function checkSession() {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  if (!token || !expiry) {
    return false;
  }

  const now = Date.now();
  if (now > Number(expiry)) {
    // ลบ token ถ้าหมดอายุ
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiry");
    if (typeof window !== "undefined")
      window.dispatchEvent(new Event("auth-changed"));
    return false;
  }
  return true;
}

// ตัวอย่างตรวจสอบ token ใน localStorage
function isAuthenticated() {
  return checkSession();
}

const routes = [
  {
    path: "/",
    name: "curriculum",
    component: CurriculumList,
    meta: { breadcrumb: "หลักสูตร" },
  },
  {
    path: "/admin/login",
    name: "login",
    component: Login,
    meta: {
      hideNavbar: true,
      hideFooter: true,
    },
  },
  {
    path: "/admin/curriculum",
    name: "admin-curriculum",
    component: AdminCurriculumList,
    beforeEnter: async (to, from, next) => {
      if (checkSession()) {
        next();
      } else {
        // ❌ เคลียร์ token + username ก่อน
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("expiry");
        if (typeof window !== "undefined")
          window.dispatchEvent(new Event("auth-changed"));

        await Swal.fire({
          icon: "warning",
          title: "Session หมดอายุ",
          text: "กรุณาเข้าสู่ระบบใหม่",
          confirmButtonColor: "#3B82F6",
        });

        // ไปหน้า login (ซ่อน navbar อัตโนมัติถ้า meta.hideNavbar = true)
        next("/admin/login");
      }
    },
    meta: { requiresAuth: true, breadcrumb: "จัดการหลักสูตร" },
  },
  {
    path: "/admin/College",
    name: "add-College",
    component: AddCollegeAdmin,
    beforeEnter: async (to, from, next) => {
      if (checkSession()) {
        next();
      } else {
        await Swal.fire({
          icon: "warning",
          title: "Session หมดอายุ",
          text: "กรุณาเข้าสู่ระบบใหม่",
          confirmButtonColor: "#3B82F6",
        });
        next("/admin/login");
      }
    },
    meta: { requiresAuth: true, breadcrumb: "เพิ่มสถาบัน" },
  },
];

const router = createRouter({
  history: createWebHistory("/education/"),
  routes,
});

// Navigation Guard สำหรับกรณีทั่วไป
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // ตรวจหมดอายุตรงนี้ด้วย
    if (!checkSession()) {
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("auth-changed"));
      return next({ name: "login" });
    }
  }
  next();
});

export default router;
