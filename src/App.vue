<template>
  <div class="bg-white min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav v-if="showNavbar" class="bg-custom-gradient sticky top-0 z-[60]">
      <div
        class="flex flex-row items-center justify-between mx-auto px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4"
      >
        <!-- Logo -->
        <a class="flex items-center space-x-2 sm:space-x-3">
          <img
            src="./assets/img/tfac.ico"
            class="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16"
            alt="TFAC Logo"
          />
          <span
            class="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold whitespace-normal text-[#111C2D]/80"
          >
            ระบบจัดการหลักสูตรที่ผ่านการรับรองจากสภาวิชาชีพบัญชี
          </span>
        </a>

        <!-- User Menu -->
        <div
          class="bg-white rounded-full shadow-sm md:order-2 inline-flex p-1 sm:p-1.5 border border-gray-200"
        >
          <div class="relative" ref="dropdownRef">
            <button
              id="dropdownAvatarNameButton"
              type="button"
              @click="toggleDropdown"
              class="flex items-center gap-2 rounded-full leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors px-2 sm:px-3 py-1 md:h-10"
            >
              <!-- Avatar -->
              <img
                src="./assets/img/user.jpg"
                class="rounded-full object-cover object-center size-8 sm:size-9 ring-1 ring-white"
                alt=""
              />

              <!-- ชื่อ (ซ่อนบนมือถือ, โชว์บน Tablet/PC) -->
              <span
                class="hidden sm:inline text-xs sm:text-sm md:text-base font-medium text-gray-900"
              >
                {{ username }}
              </span>

              <!-- Chevron -->
              <svg
                class="hidden md:block w-3 h-3"
                viewBox="0 0 10 6"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m1 1 4 4 4-4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- Dropdown -->
            <div
              v-show="isDropdownOpen"
              class="absolute right-0 mt-2 w-36 sm:w-44 bg-white divide-y divide-gray-100 rounded-full shadow-sm z-[70]"
            >
              <div class="p-2">
                <button
                  class="block w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 flex items-center gap-2"
                  @click="logout"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-5 sm:size-6"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.625 12C1.625 12.4142 1.96079 12.75 2.375 12.75L13.3476 12.75L11.3869 14.4306C11.0724 14.7001 11.036 15.1736 11.3056 15.4881C11.5751 15.8026 12.0486 15.839 12.3631 15.5694L15.8631 12.5694C16.0293 12.427 16.125 12.2189 16.125 12C16.125 11.7811 16.0293 11.573 15.8631 11.4306L12.3631 8.43056C12.0486 8.16099 11.5751 8.19741 11.3056 8.51191C11.036 8.8264 11.0724 9.29988 11.3869 9.56944L13.3476 11.25L2.375 11.25C1.96079 11.25 1.625 11.5858 1.625 12Z"
                        fill="#1C274C"
                      ></path>
                      <path
                        d="M9.375 9.75004L9.75328 9.75004C9.49473 9.01645 9.6241 8.16876 10.1667 7.53576C10.9754 6.59228 12.3958 6.48301 13.3393 7.29171L16.8393 10.2917C17.338 10.7192 17.625 11.3432 17.625 12C17.625 12.6569 17.338 13.2809 16.8393 13.7084L13.3393 16.7084C12.3958 17.5171 10.9754 17.4078 10.1667 16.4643C9.6241 15.8313 9.49473 14.9836 9.75328 14.25L9.375 14.25L9.375 16C9.375 18.8284 9.375 20.2426 10.2537 21.1213C11.1324 22 12.5466 22 15.375 22L16.375 22C19.2034 22 20.6176 22 21.4963 21.1213C22.375 20.2426 22.375 18.8284 22.375 16L22.375 8C22.375 5.17158 22.375 3.75736 21.4963 2.87868C20.6176 2 19.2034 2 16.375 2L15.375 2C12.5466 2 11.1324 2 10.2537 2.87868C9.375 3.75736 9.375 5.17157 9.375 8L9.375 9.75004Z"
                        fill="#1C274C"
                      ></path>
                    </g>
                  </svg>
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Tabs -->
    <nav
      v-if="showNavbar"
      class="bg-white backdrop-blur shadow-md border-b border-gray-200 sticky top-[56px] z-[50] md:top-[90px]"
    >
      <div class="mx-auto px-3 sm:px-4">
        <div
          class="flex flex-wrap md:flex-nowrap items-center gap-2 sm:gap-3 md:gap-4 pt-2"
        >
          <!-- Tab List (scrollable on mobile) -->
          <div class="relative order-1 w-full md:w-auto min-w-0">
            <div class="-mb-px overflow-x-auto md:overflow-visible">
              <ul
                role="tablist"
                class="flex items-center gap-2 sm:gap-3 md:gap-6 border-b border-slate-200 min-w-max md:min-w-0 pr-2"
              >
                <li class="shrink-0">
                  <router-link
                    :to="{ name: 'admin-curriculum' }"
                    v-slot="{ href, navigate, isActive }"
                  >
                    <a
                      :href="href"
                      @click="navigate"
                      role="tab"
                      class="block whitespace-nowrap px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm md:text-base"
                      :class="
                        isActive
                          ? 'text-slate-900 font-semibold border-b-2 border-blue-500'
                          : 'text-slate-500 hover:text-slate-900'
                      "
                    >
                      จัดการข้อมูลหลักสูตร
                    </a>
                  </router-link>
                </li>

                <li class="shrink-0">
                  <router-link
                    :to="{ name: 'add-college' }"
                    v-slot="{ href, navigate, isActive }"
                  >
                    <a
                      :href="href"
                      @click="navigate"
                      role="tab"
                      class="block whitespace-nowrap px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm md:text-base"
                      :class="
                        isActive
                          ? 'text-slate-900 font-semibold border-b-2 border-blue-500'
                          : 'text-slate-500 hover:text-slate-900'
                      "
                    >
                      จัดการข้อมูลสถาบัน
                    </a>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <!-- Breadcrumb (ซ่อนบน mobile, โชว์บน desktop) -->
          <div class="order-2 w-full md:w-auto md:ml-auto">
            <div class="hidden md:block">
              <Breadcrumb />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Breadcrumb บนมือถือ -->
    <nav v-if="showNavbar" class="p-3 sm:p-4 md:hidden">
      <Breadcrumb />
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>

    <!-- Footer -->
    <footer
      v-if="showFooter"
      class="bg-gray-100 border-t border-gray-300 text-center py-3 sm:py-4 text-xs sm:text-sm text-gray-600 bottom-0 left-0 w-full z-50"
    >
      <div class="container mx-auto px-2 sm:px-4">
        <p>© 2025 สภาวิชาชีพบัญชี ในพระบรมราชูปถัมภ์ — All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted, onUnmounted, watchPostEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import Breadcrumb from "./components/Breadcrumb.vue";

const router = useRouter();
const route = useRoute();
const username = ref(localStorage.getItem("username") || "");
const token = ref(localStorage.getItem("token") || "");
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const sessionValid = computed(() => {
  // reactive: อ้าง token.value เพื่อกระตุ้น render ใหม่เมื่อ token เปลี่ยน
  if (!token.value) return false;
  const expiry = Number(localStorage.getItem("expiry") || 0);
  return !expiry || Date.now() < expiry;
});
const showNavbar = computed(
  () => sessionValid.value && route.meta?.hideNavbar !== true
);
const isAdmin = computed(() => !!token.value);

console.log("isAdmin:", isAdmin);
watch(isAdmin, (val) => {
  if (!val) return;
  if (route.name !== "admin-curriculum") {
    router.replace({ name: "admin-curriculum" }); // replace เพื่อลดซ้อนทับ
  }
}, { immediate: false }); // หลีกเลี่ยงยิงทันทีตอน mount ถ้าไม่จำเป็น
// ใช้ computed แทนการกำหนดค่าคงที่

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
    isDropdownOpen.value = false;
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
  localStorage.removeItem("expiry");
  // อัพเดท reactive values
  username.value = "";
  token.value = "";

  router.push("/admin/login");
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};
const syncAuth = () => {
  username.value = localStorage.getItem("username") || "";
  token.value = localStorage.getItem("token") || "";
  isDropdownOpen.value = false;
};

onMounted(() => {
  window.addEventListener("auth-changed", syncAuth);
});
onUnmounted(() => {
  window.removeEventListener("auth-changed", syncAuth);
});

const navRef = ref(null);
onMounted(() => {
  const update = () => {
    const h = navRef.value?.offsetHeight ?? 56;
    document.documentElement.style.setProperty("--nav-h", h + "px");
  };
  update();
  window.addEventListener("resize", update);
});
</script>