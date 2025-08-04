<template>
  <div class="bg-white flex flex-col min-h-screen">
    <!-- ✅ Navbar - ซ่อนในหน้า login -->
    <header
      v-if="showNavbar && isAdmin"
      class="bg-[#0085DB] text-white px-6 py-3 flex justify-between items-center"
    >
      <h1 class="text-lg font-bold">ระบบจัดการหลักสูตร</h1>
      <div class="flex items-center gap-4">
        <span>สวัสดี, {{ username }}</span>
        <button
          @click="logout"
          class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
        >
          Logout
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view /> <!-- หน้าต่างๆ จะแสดงตรงนี้ -->
    </main>

    <!-- Footer - ซ่อนในหน้า login -->
    <footer
      v-if="showFooter"
      class="bg-gray-100 border-t border-gray-300 text-center py-4 text-sm text-gray-600"
    >
      <div class="container mx-auto px-4">
        <p>
          © 2025 สภาวิชาชีพบัญชี ในพระบรมราชูปถัมภ์ — All Rights Reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const username = ref(localStorage.getItem("username") || "");
const token = ref(localStorage.getItem("token") || "");

// ใช้ computed แทนการกำหนดค่าคงที่
const isAdmin = computed(() => {
  return !!token.value;
});

// ตรวจสอบว่าควรแสดง Navbar หรือไม่
const showNavbar = computed(() => {
  return route.meta?.hideNavbar !== true;
});

// ตรวจสอบว่าควรแสดง Footer หรือไม่
const showFooter = computed(() => {
  return route.meta?.hideFooter !== true;
});

// Watch route changes เพื่ออัพเดทข้อมูล auth
watch(route, () => {
  username.value = localStorage.getItem("username") || "";
  token.value = localStorage.getItem("token") || "";
}, { immediate: true });

// Listen to storage changes (สำหรับกรณี login ใน tab อื่น)
window.addEventListener('storage', (e) => {
  if (e.key === 'token' || e.key === 'username') {
    username.value = localStorage.getItem("username") || "";
    token.value = localStorage.getItem("token") || "";
  }
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  
  // อัพเดท reactive values
  username.value = "";
  token.value = "";
  
  router.push("/login");
}
</script>