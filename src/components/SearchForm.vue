<template>
  <div class="relative">
    <!-- Header -->
    <header
      class="bg-[#E5F3FB] px-4 p-10 pb-20  rounded-md mb-20 relative flex flex-col justify-center items-center text-center shadow-md"
    >
      <div class="px-4 md:px-0">
        <img class="mx-auto h-40" src="../assets/img/tfac.ico" alt="">
        <h1 class="text-[#0085DB] text-xl md:text-3xl font-bold drop-shadow-sm">
          ตรวจสอบหลักสูตรการศึกษาที่ผ่านการรับรองจากสภาวิชาชีพบัญชี
        </h1>
        <p class="mt-2 text-[#F8B15D] text-base font-semibold md:text-xl text-gray-500">
          หลักสูตรสถาบันที่ผ่านการรับรองจากสภาวิชาชีพบัญชี
          หลักสูตรใหม่หรือหลักสูตรปรับปรุงตั้งแต่ พ.ศ. 2556 - ปัจจุบัน
        </p>
      </div>
    </header>

    <!-- Filter Section -->
    <div class="absolute bottom-0 left-0 right-0 z-20 px-4 -mb-[3rem]">
      <div
        class="flex flex-col md:flex-row justify-center items-stretch md:items-end gap-4 md:gap-6"
      >
        <!-- กล่องที่ 1 -->
        <div
          class="bg-white p-3 rounded-lg border shadow-sm w-full md:w-[25rem]"
        >
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            ประเภท
          </label>
          <select
            v-model="type"
            class="w-full border border-gray-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          >
            <option value="">แสดงทั้งหมด</option>
            <option
              v-for="degree in degrees"
              :key="degree.id"
              :value="degree.id"
            >
              {{ degree.name }}
            </option>
          </select>
        </div>

        <!-- กล่องที่ 2 -->
        <div
          class="bg-white p-3 rounded-lg border shadow-sm w-full md:w-[25rem]"
        >
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            ชื่อสถาบันการศึกษา
          </label>
          <div class="relative">
            <input
              v-model="school"
              type="text"
              placeholder="ส่วนหนึ่งของชื่อ"
              class="w-full border border-gray-300 rounded-md p-2.5 pr-10 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
            />
            <svg
              class="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              ></path>
            </svg>
          </div>
        </div>

        <!-- กล่องที่ 3 -->
        <div class="p-3 flex items-center justify-center w-full md:w-48 pb-7">
          <button
            @click="reset"
            class="bg-[#F8B15D] hover:bg-blue-500 text-white px-4 py-2.5 rounded-md shadow hover:from-blue-900 hover:to-blue-700 flex items-center justify-center gap-2 transition-all font-medium w-full"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              ></path>
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted, watch } from "vue";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { getDegrees } from "@/services/apiService";

const type = ref("");
const school = ref("");
const degrees = ref([]);
const emit = defineEmits(["onSearch"]);

let timeout = null;

// ✅ ค้นหาอัตโนมัติเมื่อพิมพ์ + debounce
watch(school, (newVal) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit("onSearch", { type: type.value, school: newVal });
  }, 300);
});

// ✅ ค้นหาอัตโนมัติเมื่อเปลี่ยนประเภท
watch(type, (newVal) => {
  emit("onSearch", { type: newVal, school: school.value });
});

async function fetchDegrees() {
  try {
    const res = await getDegrees();
    degrees.value = res.data?.data || [];
  } catch (err) {
    console.error("Error fetching degrees:", err);
  }
}

function reset() {
  type.value = "";
  school.value = "";
  emit("onSearch", { type: "", school: "" });
}

onMounted(() => {
  fetchDegrees();
});
</script>
