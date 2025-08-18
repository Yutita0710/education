import { createRouter, createWebHistory } from "vue-router";
import CurriculumList from "@/views/CurriculumList.vue";
import CurriculumListAdmin from "@/views/admin/CurriculumListAdmin.vue";
import Login from "@/views/admin/Login.vue";
import Swal from "sweetalert2";
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
    return false;
  }
  return true;
}

// ตัวอย่างตรวจสอบ token ใน localStorage
function isAuthenticated() {
  return !!localStorage.getItem("token");
}

const routes = [
  {
    path: "/",
    name: "curriculum",
    component: CurriculumList,
    meta: { breadcrumb: "หลักสูตร" },
  },
  {
    path: "/login",
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
    component: CurriculumListAdmin,
    beforeEnter: async (to, from, next) => {
      if (checkSession()) {
        next();
      } else {
        // ❌ เคลียร์ token + username ก่อน
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        await Swal.fire({
          icon: "warning",
          title: "Session หมดอายุ",
          text: "กรุณาเข้าสู่ระบบใหม่",
          confirmButtonColor: "#3B82F6",
        });

        // ไปหน้า login (ซ่อน navbar อัตโนมัติถ้า meta.hideNavbar = true)
        next("/login");
      }
    },
    meta: { requiresAuth: true, breadcrumb: "จัดการหลักสูตร" },
  },
  {
    path: "/admin/College/add",
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
        next("/login");
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
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "login" }); // ถ้ายังไม่ login ให้ไปหน้า Login
  } else {
    next();
  }
});

export default router;
