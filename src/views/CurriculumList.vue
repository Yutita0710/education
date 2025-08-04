<template>
  <div class="p-6">
    <SearchForm @onSearch="handleSearch" />
    <DataTable :data="tableData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SearchForm from "../components/SearchForm.vue";
import DataTable from "../components/DataTable.vue";
import { getEducationList } from "@/services/apiService";

const tableData = ref([]);
const currentPage = ref(1);
const type = ref("");
const search = ref("");

async function fetchData() {
  try {
    const typeParam = type.value && !isNaN(type.value) ? Number(type.value) : "";

    const params = {
      page: currentPage.value,
      sort: 0,
      order: "ASC",
      type: typeParam,
      search: search.value.trim()
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
