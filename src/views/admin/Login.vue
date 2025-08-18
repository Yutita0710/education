<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden"
  >
    <!-- Background Decorative Elements -->
    <div
      class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-300 to-blue-500 rounded-full opacity-80 transform translate-x-32 -translate-y-32"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full opacity-60 transform -translate-x-32 translate-y-32"
    ></div>
    <div
      class="absolute top-1/2 right-1/4 w-32 h-32 bg-yellow-300 rounded-full opacity-40"
    ></div>

    <!-- Login Card -->
    <div
      class="bg-white rounded-3xl shadow-2xl p-8 w-96 relative z-10 backdrop-blur-sm bg-opacity-95"
    >
      <!-- Profile Icon -->
      <div class="flex justify-center mb-6">
        <div
          class="w-20 h-20 bg-gradient-to-br from-cyan-300 to-blue-500 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>

      <!-- Login Form -->
      <form @submit.prevent="login" class="space-y-6">
        <!-- Email Input -->
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              ></path>
            </svg>
          </div>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-400"
          />
        </div>

        <!-- Password Input -->
        <div class="relative">
          <!-- Lock icon -->
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <!-- Input field - ใช้ type="text" เสมอ -->
          <input
            v-model="password"
            type="text"
            placeholder="Password"
            :style="{
              fontFamily: showPassword ? 'inherit' : 'monospace',
              WebkitTextSecurity: showPassword ? 'none' : 'disc',
              textSecurity: showPassword ? 'none' : 'disc',
            }"
            class="w-full pl-10 pr-10 py-3 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-400"
          />

          <!-- Toggle button -->
          <button
            :style="{ display: password ? 'flex' : 'none' }"
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <!-- Eye open icon -->
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fill-rule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Eye closed icon -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z"
              />
              <path
                d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z"
              />
              <path
                d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z"
              />
            </svg>
          </button>
        </div>
        <!-- Login Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            กำลังเข้าสู่ระบบ...
          </span>
        </button>
      </form>
    </div>

    <!-- Bottom Decorative Element -->
    <div
      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-40 h-20 bg-blue-600 rounded-full opacity-60"
    ></div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const username = ref("");
const isLoading = ref(false);
const password = ref("");
const showPassword = ref(false);
async function login() {
  // Validation
  if (!username.value.trim()) {
    Swal.fire({
      icon: "warning",
      title: "กรุณากรอกชื่อผู้ใช้",
      confirmButtonColor: "#3B82F6",
    });
    return;
  }

  if (!password.value.trim()) {
    Swal.fire({
      icon: "warning",
      title: "กรุณากรอกรหัสผ่าน",
      confirmButtonColor: "#3B82F6",
    });
    return;
  }

  isLoading.value = true;

  try {
    // จำลองการเรียก API (ลบออกถ้าไม่ต้องการ)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (username.value === "Admin" && password.value === "admin1234") {
      const token = "dummy-token";
      const sessionDuration = 60 * 60 * 1000; // 1 ชั่วโมง
      const expiryTime = Date.now() + sessionDuration;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username.value);
      localStorage.setItem("expiry", expiryTime);
      // แสดงข้อความสำเร็จ
      await Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ!",
        text: `ยินดีต้อนรับ ${username.value}`,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      router.push("/admin/curriculum");
    } else {
      // แสดงข้อความผิดพลาด
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        confirmButtonColor: "#EF4444",
        confirmButtonText: "ลองใหม่",
      });

      // เคลียร์รหัสผ่าน
      password.value = "";
    }
  } catch (error) {
    // แสดงข้อความเมื่อเกิดข้อผิดพลาด
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      confirmButtonColor: "#EF4444",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
