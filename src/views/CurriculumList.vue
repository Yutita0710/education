<template>
  <div class="p-6">
    <SearchForm @onSearch="handleSearch" />
    <div v-if="tableData.length === 0 && !isLoading" class="text-center py-8 text-gray-500">
      ไม่พบข้อมูล
    </div>
    <DataTable :data="tableData" />
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
import SearchForm from "../components/SearchForm.vue";
import DataTable from "../components/DataTable.vue";
import { getEducationList } from "@/services/apiService";

const tableData = ref([]);
const currentPage = ref(1);
const type = ref("");
const college_name = ref("");
const isLoading = ref(false);
const limit = ref("");

async function fetchData() {
  try {
    isLoading.value = true;

    const params = {
      page: currentPage.value,
      sort: 0,
      order: "ASC",
      college_name: college_name.value.trim() || "", // ว่าง → ""
      type: type.value !== "" ? Number(type.value) : "",
      college_active: "1",
      curriculum_active: "1",
      degree_active: "", // ถ้าไม่ต้องการกำหนด = ""
      limit: limit.value ? Number(limit.value) : "",
    };

    const res = await getEducationList(params);
    // console.log("res", res);

    const filteredGroups = (res.data?.data?.groups || [])
      .filter((group) => group.degree?.active === 1)
      .map((group) => ({
        ...group,
        items: group.items?.filter((item) => item.active === 1) || [],
      }))
      .filter((group) => group.items.length > 0);

    tableData.value = filteredGroups || [];
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    isLoading.value = false;
  }
}

function handleSearch(filters) {
  type.value = filters.type;
  college_name.value = filters.school;
  currentPage.value = 1;
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
