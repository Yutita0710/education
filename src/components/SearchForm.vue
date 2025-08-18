<template>
  <div class="relative">
    <!-- Header -->
    <header
      class="bg-custom-gradient px-4 py-16 md:py-20 rounded-md mb-8 md:mb-20 flex flex-col justify-center items-center text-center shadow-md"
    >
      <div class="px-4 md:px-0">
        <img class="mx-auto h-20 md:h-28" src="../assets/img/tfac.ico" alt="" />
        <h1
          class="text-[#111C2D]/80 text-lg md:text-3xl font-bold drop-shadow-sm mt-4"
        >
          ตรวจสอบหลักสูตรการศึกษาที่ผ่านการรับรองจากสภาวิชาชีพบัญชี
        </h1>
        <p class="mt-3 text-[#0085DB] text-base md:text-xl font-semibold mb-6">
          หลักสูตรสถาบันที่ผ่านการรับรองจากสภาวิชาชีพบัญชี
          หลักสูตรใหม่หรือหลักสูตรปรับปรุงตั้งแต่ พ.ศ. 2556 - ปัจจุบัน
        </p>
      </div>
    </header>

    <!-- Filter Section -->
    <div
      class="px-4 md:px-8 md:absolute md:bottom-0 md:left-0 md:right-0 md:-mb-[3rem] mb-6 z-20 flex flex-col items-center"
    >
      <div
        class="flex flex-col md:flex-row gap-4 md:gap-6 bg-white p-4 rounded-lg border shadow-sm text-gray-700 w-full max-w-6xl mx-auto"
      >
        <!-- กล่องที่ 1 -->
        <div class="w-full md:w-2/2">
          <label class="block font-semibold text-gray-700 mb-2"
            >ระดับการศึกษา</label
          >
          <select
            v-model="type"
            class="w-full border border-gray-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          >
            <option value="">กรุณาเลือกระดับการศึกษา</option>
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
        <div class="w-full md:w-2/2">
          <label class="block font-semibold text-gray-700 mb-2">
            ชื่อสถาบันการศึกษา
          </label>
          <div class="relative">
            <input
              v-model="school"
              type="text"
              placeholder="ค้นหาชื่อสถาบันการศึกษา"
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
              />
            </svg>
          </div>
        </div>

        <!-- กล่องที่ 3 -->
        <div class="w-full md:w-auto flex items-end">
          <button
            @click="reset"
            class="bg-[#F8B15D] hover:bg-[#FE7743] text-white px-6 py-3 rounded-md shadow flex items-center justify-center gap-2 transition-all font-medium w-full md:w-auto min-w-[8rem]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-6 flex-shrink-0"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                d="M20 8c-1.403-2.96-4.463-5-8-5a9 9 0 1 0 0 18a9 9 0 0 0 9-9m0-9v6h-6"
              />
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
import { getDegrees } from "@/services/apiService";
import { useRouter, useRoute } from "vue-router";

const type = ref("");
const school = ref("");
const degrees = ref([]);

const emit = defineEmits(["onSearch"]);

const router = useRouter();
const route = useRoute();

let timeout = null;

// Prefill school จาก URL ถ้ามี collegeId
onMounted(() => {
  if (route.query.collegeId) {
    school.value = decodeURIComponent(route.query.collegeId);
  } else {
    school.value = "";
  }
  fetchDegrees();
});

// ✅ ค้นหาอัตโนมัติเมื่อพิมพ์ + debounce
watch(school, (newVal) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit("onSearch", { type: type.value, school: newVal });
  }, 300);
});

// ✅ ค้นหาอัตโนมัติเมื่อเปลี่ยนระดับการศึกษา
watch(type, (newVal) => {
  emit("onSearch", { type: newVal, school: school.value });
});

// โหลดข้อมูล degrees และจัดเรียง
async function fetchDegrees() {
  try {
    const res = await getDegrees();
    const data = res.data?.data || [];

    const customOrder = [6, 5, 4];

    degrees.value = data.sort((a, b) => {
      const indexA = customOrder.indexOf(a.id);
      const indexB = customOrder.indexOf(b.id);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.id - b.id;
    });
  } catch (err) {
    console.error("Error fetching degrees:", err);
  }
}

// Reset และลบเฉพาะ collegeId ออกจาก URL
function reset() {
  type.value = "";
  school.value = "";
  emit("onSearch", { type: "", school: "" }); // ส่งไปให้ parent fetch ใหม่

  const newQuery = { ...route.query };
  delete newQuery.collegeId;
  router.replace({ query: newQuery });
}
</script>
