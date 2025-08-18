<template>
  <div class="bg-white min-h-screen flex flex-col">
    <!-- Navbar (fixed ด้านบน) -->
    <div class="relative px-6 pt-6">
      <nav
        v-if="showNavbar && isAdmin"
        class="bg-[#EFF9FF] rounded-xl shadow-md w-full"
      >
        <div
          class="flex justify-between items-center mx-auto px-4 md:px-8 py-4"
        >
          <!-- โลโก้ + ชื่อระบบ (อยู่ซ้ายสุด) -->
          <a class="flex items-center space-x-3">
            <img
              src="./assets/img/tfac.ico"
              class="h-14 w-14 md:h-16 md:w-16"
              alt="TFAC Logo"
            />
            <span
              class="text-lg md:text-xl font-semibold whitespace-normal text-[#111C2D]/80"
            >
              ระบบจัดการหลักสูตรที่ผ่านการรับรองจากสภาวิชาชีพบัญชี
            </span>
          </a>
          <!-- ปุ่มออกจากระบบ (อยู่ขวาสุด) -->
          <div
            class="bg-white flex items-center gap-2 cursor-pointer rounded-lg p-2 shadow-md transition"
            @click="logout"
          >
            <!-- ข้อความแสดงเฉพาะจอ md ขึ้นไป -->
            <div class="hidden md:block text-right text-[#414957] font-bold">
              {{ username }} <br />
              ออกจากระบบ
            </div>
            <!-- ไอคอน (แสดงตลอด) -->
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 md:w-10 md:h-10"
            >
              <path
                opacity="0.5"
                d="M9.052 4.5C9 5.07763 9 5.80355 9 6.72183V17.2781C9 18.1964 9 18.9224 9.05201 19.5H8C5.64298 19.5 4.46447 19.5 3.73223 18.7678C3 18.0355 3 16.857 3 14.5V9.5C3 7.14298 3 5.96447 3.73223 5.23223C4.46447 4.5 5.64298 4.5 8 4.5H9.052Z"
                fill="#0085DB"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.70725 2.4087C9 3.03569 9 4.18259 9 6.4764V17.5236C9 19.8174 9 20.9643 9.70725 21.5913C10.4145 22.2183 11.4955 22.0297 13.6576 21.6526L15.9864 21.2465C18.3809 20.8288 19.5781 20.62 20.2891 19.7417C21 18.8635 21 17.5933 21 15.0529V8.94711C21 6.40671 21 5.13652 20.2891 4.25826C19.5781 3.37999 18.3809 3.17118 15.9864 2.75354L13.6576 2.34736C11.4955 1.97026 10.4145 1.78171 9.70725 2.4087ZM12.75 10.9535C12.75 10.52 12.4142 10.1686 12 10.1686C11.5858 10.1686 11.25 10.52 11.25 10.9535V13.0465C11.25 13.48 11.5858 13.8314 12 13.8314C12.4142 13.8314 12.75 13.48 12.75 13.0465V10.9535Z"
                fill="#0085DB"
              />
            </svg>
          </div>
        </div>
      </nav>
    </div>
    <!-- Main Content (เว้น padding-top ให้ navbar ไม่บัง) -->
    <main class="flex-grow pb-[60px]">
      <router-view />
    </main>

    <!-- Footer (fixed ด้านล่าง) -->
    <footer
      v-if="showFooter"
      class="bg-gray-100 border-t border-gray-300 text-center py-4 text-sm text-gray-600 bottom-0 left-0 w-full z-50"
    >
      <div class="container mx-auto px-4">
        <p>© 2025 สภาวิชาชีพบัญชี ในพระบรมราชูปถัมภ์ — All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const username = ref(localStorage.getItem("username") || "");
const token = ref(localStorage.getItem("token") || "");
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

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
watch(
  route,
  () => {
    username.value = localStorage.getItem("username") || "";
    token.value = localStorage.getItem("token") || "";
  },
  { immediate: true }
);

// Listen to storage changes (สำหรับกรณี login ใน tab อื่น)
window.addEventListener("storage", (e) => {
  if (e.key === "token" || e.key === "username") {
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

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>