<template>
  <div class="p-6">
    <SearchForm @onSearch="handleSearch" />

    <div
      class="flex flex-row gap-4 justify-center xl:justify-end py-4 mb-8 px-4 sm:px-8 md:px-4 lg:px-4 xl:px-20"
    >
      <!-- ปุ่มเพิ่มข้อมูลหลักสูตร -->
      <button
        v-if="isAdmin"
        @click="showCurriculumModal = true"
        class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0085DB] text-white px-4 py-2 rounded-full shadow hover:bg-[#77c8fc] transition min-w-0"
      >
        <!-- icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-6 flex-shrink-0"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="whitespace-nowrap text-center">เพิ่มข้อมูลหลักสูตร</span>
      </button>

      <router-link
        :to="{ name: 'add-College' }"
        class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#FB977D] text-white px-6 py-2 rounded-full shadow hover:bg-[#DF6D2D] transition min-w-0"
      >
        <!-- icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="size-6 flex-shrink-0"
          viewBox="0 0 16 16"
        >
          <path
            d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7.256A4.5 4.5 0 0 0 12.5 8a4.5 4.5 0 0 0-3.59 1.787A.5.5 0 0 0 9 9.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .39-.187A4.5 4.5 0 0 0 8.027 12H6.5a.5.5 0 0 0-.5.5V16H3a1 1 0 0 1-1-1zm2 1.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m3 0v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5M4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"
          />
          <path
            d="M11.886 9.46c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"
          />
        </svg>
        <span class="whitespace-nowrap text-center">จัดการข้อมูลสถาบัน</span>
      </router-link>
    </div>
    <div
      v-if="tableData.length === 0 && !isLoading"
      class="text-center py-8 text-gray-500"
    >
      ไม่พบข้อมูล
    </div>
    <!-- Modal สำหรับเพิ่มข้อมูลสถานศึกษา
    <AddCollegeModal
      :showModal="showCollegeModal"
      :closeModal="closeCollegeModal"
      @close="closeCollegeModal"
    /> -->

    <!-- Modal สำหรับเพิ่มข้อมูลหลักสูตร -->
    <AddCurriculumModal
      :showModal="showCurriculumModal"
      :closeModal="closeCurriculumModal"
      @close="closeCurriculumModal"
    />

    <DataTable :data="tableData" @refreshData="fetchData" />
  </div>

  <!-- Loading Overlay -->
  <div v-if="isLoading" class="loading-overlay">
    <!-- From Uiverse.io by forgingdestiny -->
    <div class="loader">
      <div class="circle" tabindex="0"></div>
      <div class="circle" tabindex="0"></div>
      <div class="circle" tabindex="0"></div>
      <div class="circle" tabindex="0"></div>
      <div class="circle" tabindex="0"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getEducationList } from "@/services/apiService";
import SearchForm from "@/components/SearchForm.vue";
import DataTable from "@/components/DataTable.vue";
// import AddCollegeModal from "@/components/AddCollegeModal.vue";
import AddCurriculumModal from "@/components/AddCurriculumModal.vue";

const tableData = ref([]);
const currentPage = ref(1);
const type = ref("");
const college_name = ref(""); // ✅ ใช้ตัวนี้เป็น search หลัก
const isAdmin = !!localStorage.getItem("token");
const showCurriculumModal = ref(false);
// const showCollegeModal = ref(false);
const isLoading = ref(false);

async function fetchData() {
  try {
    isLoading.value = true;
    const typeParam =
      type.value && !isNaN(type.value) ? Number(type.value) : "";

    const params = {
      page: currentPage.value,
      sort: 0,
      order: "ASC",
      college_name: college_name.value.trim() || "", // ✅ ค้นหาจาก college_name
      type: typeParam,
      college_active: "",
      curriculum_active: "",
      degree_active: "",
      limit: "",
    };

    const res = await getEducationList(params);
    console.log("res", res);

    tableData.value = res.data?.data?.groups || [];
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    isLoading.value = false;
  }
}

function handleSearch(filters) {
  type.value = filters.type;
  college_name.value = filters.school || ""; // ✅ เก็บค่ามาใส่ college_name
  currentPage.value = 1;
  fetchData();
}

function closeCurriculumModal() {
  showCurriculumModal.value = false;
  fetchData();
}

onMounted(() => {
  fetchData();
});
</script>


<style scoped>
/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* From Uiverse.io by forgingdestiny */
/* Container for the loader */
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10em;
}

/* Circle elements */
.circle {
  width: 1em;
  height: 1em;
  margin: 0 0.25em;
  border-radius: 50%;
  background-color: #a8d5e2;
  animation: wave 1.5s infinite ease-in-out;
  transition: background-color 0.3s ease;
}

/* Animation */
@keyframes wave {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-1em);
  }
}

/* Delay for each circle */
.circle:nth-child(1) {
  animation-delay: 0s;
}

.circle:nth-child(2) {
  animation-delay: 0.2s;
}

.circle:nth-child(3) {
  animation-delay: 0.4s;
}

.circle:nth-child(4) {
  animation-delay: 0.6s;
}

.circle:nth-child(5) {
  animation-delay: 0.8s;
}
</style>
