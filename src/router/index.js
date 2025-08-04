import { createRouter, createWebHistory } from "vue-router";
import CurriculumList from "@/views/CurriculumList.vue";
import CurriculumListAdmin from "@/views/admin/CurriculumListAdmin.vue";
import AddCurriculum from "@/views/admin/AddCurriculum.vue";
import Login from "@/views/admin/Login.vue";

// ตัวอย่างตรวจสอบ token ใน localStorage
function isAuthenticated() {
  return !!localStorage.getItem("token");
}

const routes = [
  {
    path: "/",
    name: "curriculum",
    component: CurriculumList,
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
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/curriculum/add",
    name: "add-curriculum",
    component: AddCurriculum,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "login" }); // ถ้ายังไม่ login ให้ไปหน้า Login
  } else {
    next();
  }
});

export default router;
