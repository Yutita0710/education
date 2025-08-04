<template>
  <div class="p-6">
    <SearchForm @onSearch="handleSearch" />
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end py-4">
      <router-link
        v-if="isAdmin"
        to="/admin/curriculum/add"
        class="inline-flex items-center gap-2 bg-[#0085DB] text-white px-4 py-2 rounded-full shadow hover:bg-[#77c8fc] transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        เพิ่มข้อมูลหลักสูตร
      </router-link>
      <router-link
        v-if="isAdmin"
        to="/admin/college/add"
        class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        เพิ่มข้อมูลสถานศึกษา
      </router-link>
    </div>
    <DataTable :data="tableData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getEducationList } from "@/services/apiService";
import SearchForm from "@/components/SearchForm.vue";
import DataTable from "@/components/DataTable.vue";

const tableData = ref([]);
const currentPage = ref(1);
const type = ref("");
const search = ref("");
const isAdmin = localStorage.getItem("token") ? true : false;

async function fetchData() {
  try {

    const typeParam =
      type.value && !isNaN(type.value) ? Number(type.value) : "";

    const params = {
      page: currentPage.value,
      sort: 0,
      order: "ASC",
      type: typeParam,
      search: search.value.trim(),
    };

    const res = await getEducationList(params);
    tableData.value = res.data?.data?.groups || [];
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

function handleSearch(filters) {
  type.value = filters.type;
  search.value = filters.school;
  currentPage.value = 1;
  fetchData();
}

onMounted(() => {
  fetchData();
});
</script>
