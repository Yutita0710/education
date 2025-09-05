<template>
  <div class="block gap-[20px] p-6 space-y-4">
    <!-- Search Form -->
    <div class="w-auto">
      <SearchForm
  :initialFilters="searchFilters"
  @onSearch="handleSearch"
  @clear="clearSearch"
/>
    </div>

    <div class="w-auto md:px-10">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="loader">
          <div class="circle" v-for="i in 5" :key="i"></div>
        </div>
        <span class="ml-4 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>

      <!-- Data Table and Pagination -->
      <div v-else-if="hasData && hasInitialized">
        <DataTable :curriculums="tableData" :meta="meta" :isAdmin="true" :total="total" :loading="isLoading"
          @sort="handleSort" @refresh="refreshData" />

        <PaginationBar :current-page="currentPage" v-model:perPage="pageSize" :total="total" :max-visible="5"
          :loading="isLoading" @changePage="onPageChange" @changePerPage="onPageSizeChange" />

        <!-- Data Info -->
        <div class="mt-4 text-sm text-gray-500 text-center">
          แสดง {{ startItem }}-{{ endItem }} จาก {{ total }} รายการ
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>

        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ hasSearched ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่มีข้อมูลหลักสูตร' }}
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          {{ hasSearched
            ? 'ลองเปลี่ยนคำค้นหาหรือปรับเงื่อนไขการกรอง'
            : 'เริ่มต้นด้วยการเพิ่มหลักสูตรใหม่'
          }}
        </p>

        <button v-if="hasSearched" @click="clearSearch"
          class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          ล้างการค้นหา
        </button>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"></path>
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">เกิดข้อผิดพลาด</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button @click="retryFetch" class="text-sm text-red-800 underline mt-2 hover:text-red-900">
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import SearchForm from "../components/SearchForm.vue";
import DataTable from "../components/DataTable.vue";
import PaginationBar from "../components/PaginationBar.vue";
import { getEducationPaginated } from "@/services/apiService";

const route = useRoute();
const router = useRouter();

const ALWAYS_KEEP = new Set([
  "page",
  "limit",
  "college_active",
  "curriculum_active",
  "curriculum_published",
]);

const DEFAULT_QUERY_MIN = {
  page: "1",
  limit: "10",
  college_active: "1",
  curriculum_active: "1",
  curriculum_published: "true",
};


const STORAGE_KEY = "edu_list_state_v1";
const persistStateToStorage = () => {
  // เก็บเฉพาะพารามิเตอร์ที่เราสนใจ
  const toSave = cleanQueryParams({ ...state.value });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
};
const restoreStateFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};
// ========== Constants ==========
const DEFAULT_STATE = {
  page: 1,
  search: "",
  // รองรับทั้ง "" (ไม่มี) หรือชื่อคอลัมน์แบบสตริง แทนการบังคับเป็นเลข
  sort: "",
  order: "ASC",
  limit: 10,
  type: "",
  college_active: "1",
  curriculum_active: "1",
  degree_active: "",
  college_name: "",
  start_year: "",
  end_year: "",
  curriculum_published: true,
  meeting_resolution: "",
};

const normalizeQueryParam = (value) => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

const VALID_SORT_ORDERS = ["ASC", "DESC"];
const MIN_PAGE_SIZE = 5;
const MAX_PAGE_SIZE = 100;

// ========== Reactive State ==========
const state = ref({ ...DEFAULT_STATE });
const tableData = ref([]);
const meta = ref({ total: 0, current_page: 1, per_page: 10, last_page: 1 });
const isLoading = ref(false);
const error = ref(null);
const hasInitialized = ref(false);
const booting = ref(true);

// ========== Computed Properties ==========
const total = computed(() => meta.value?.total || 0);
const currentPage = computed(() => state.value.page);
const pageSize = computed({
  get: () => state.value.limit,
  set: (value) => {
    const newSize = Math.min(Math.max(value, MIN_PAGE_SIZE), MAX_PAGE_SIZE);
    if (newSize !== state.value.limit) {
      handlePageSizeChange(newSize);
    }
  }
});

const hasData = computed(() => tableData.value.length > 0);
const hasSearched = computed(() => {
  return !!(state.value.search ||
    state.value.college_name ||
    state.value.type ||
    state.value.start_year ||
    state.value.end_year ||
    state.value.college_active !== "1" ||
    state.value.curriculum_active !== "1" ||
    state.value.degree_active ||
    state.value.meeting_resolution);
});

const startItem = computed(() => {
  if (total.value === 0) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});

const endItem = computed(() => {
  const end = currentPage.value * pageSize.value;
  return Math.min(end, total.value);
});

const searchFilters = computed(() => ({
  search: state.value.search,
  type: state.value.type,
  college_name: state.value.college_name,
  start_year: state.value.start_year,
  end_year: state.value.end_year,
  college_active: state.value.college_active,
  curriculum_active: state.value.curriculum_active,
  degree_active: state.value.degree_active,
  curriculum_published: state.value.curriculum_published,
  meeting_resolution: state.value.meeting_resolution,
}));

// ========== Utility Functions ==========
const validateAndParseInt = (value, defaultValue, min = 1, max = Infinity) => {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return defaultValue;
  }
  return parsed;
};

// อ่าน int จาก query: ถ้า key ไม่มี ให้คงค่าเดิมใน state (กันเด้งกลับ 1)
const readIntFromQuery = (q, key, min, max, fallback) => {
  if (Object.prototype.hasOwnProperty.call(q, key)) {
    const parsed = parseInt(q[key], 10);
    if (Number.isFinite(parsed) && parsed >= min && parsed <= max) return parsed;
    return fallback;
  }
  return state.value[key] ?? fallback;
};

const validateString = (value, allowedValues = null) => {
  const str = String(normalizeQueryParam(value)).trim();
  if (allowedValues && !allowedValues.includes(str)) {
    return allowedValues[0] || "";
  }
  return str;
};

const isStateDefault = () => {
  return Object.keys(DEFAULT_STATE).every(key => {
    return state.value[key] === DEFAULT_STATE[key];
  });
};

// เอา special case ของ page=1 ออกไปเลย
const cleanQueryParams = (params) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === "" || value == null) continue;

    // คง page/limit เสมอ
    if (ALWAYS_KEEP.has(key)) {
      cleaned[key] = String(value);
      continue;
    }
    if (value !== DEFAULT_STATE[key]) {
      cleaned[key] = String(value);
    }
  }
  return cleaned;
};



// ========== State Management ==========
const syncStateFromQuery = () => {
  const query = route.query;
  const qSort = normalizeQueryParam(query.sort);
  const sortIsNumeric = /^\d+$/.test(qSort);
  state.value = {
    page: readIntFromQuery(query, "page", 1, Infinity, 1),
    search: validateString(query.search),
    sort: sortIsNumeric ? validateAndParseInt(qSort, 0, 0) : validateString(qSort),
    order: Object.prototype.hasOwnProperty.call(query, "order")
      ? validateString(query.order, VALID_SORT_ORDERS)
      : state.value.order || "ASC",
    limit: readIntFromQuery(query, "limit", MIN_PAGE_SIZE, MAX_PAGE_SIZE, 10),
    type: validateString(query.type),
    college_active: validateString(query.college_active) || "1",
    curriculum_active: validateString(query.curriculum_active) || "1",
    degree_active: validateString(query.degree_active),
    college_name: validateString(query.college_name),
    start_year: validateString(query.start_year),
    end_year: validateString(query.end_year),
    curriculum_published: normalizeQueryParam(query.curriculum_published) === "false" ? false : true,
    meeting_resolution: validateString(query.meeting_resolution),
  };
  meta.value = {
    ...meta.value,
    current_page: state.value.page,
    per_page: state.value.limit,
  };
};

const updateUrlQuery = (params = {}) => {
  const newState = { ...state.value, ...params };
  const cleanedQuery = cleanQueryParams(newState);

  // Only update if query actually changed
  const currentQuery = JSON.stringify(route.query);
  const newQuery = JSON.stringify(cleanedQuery);

  if (currentQuery !== newQuery) {
    router.replace({
      path: route.path,
      query: cleanedQuery
    });

    persistStateToStorage();
  }
};

// ========== Data Fetching ==========
const fetchData = async () => {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    error.value = null;

    const filters = {
      sort: state.value.sort,
      order: state.value.order,
      search: state.value.search.trim(),
      college_name: state.value.college_name.trim(),
      college_active: state.value.college_active,
      curriculum_active: state.value.curriculum_active,
      degree_active: state.value.degree_active,
      start_year: state.value.start_year,
      end_year: state.value.end_year,
      curriculum_published: state.value.curriculum_published,
      meeting_resolution: state.value.meeting_resolution,
      type: state.value.type,
    };

    const response = await getEducationPaginated(
      state.value.page,
      state.value.limit,
      filters
    );

    if (!response?.data) {
      throw new Error("ไม่ได้รับข้อมูลจากเซิร์ฟเวอร์");
    }

    const { data: rows = [], meta: metaData = {} } = response.data;

    tableData.value = rows;
    meta.value = {
      total: Number(metaData.total) || 0,
      current_page: state.value.page,
      per_page: Number(metaData.per_page) || state.value.limit,
      last_page: Number(metaData.last_page) || Math.max(1, Math.ceil(
        (Number(metaData.total) || 0) / (Number(metaData.per_page) || state.value.limit)
      )),
    };

    // Handle page overflow
    if (hasInitialized.value && state.value.page > meta.value.last_page && meta.value.last_page > 0) {
      await nextTick();
      updateUrlQuery({ page: meta.value.last_page });
      return;
    }

    // Update URL if needed (only on initial load or when no query params exist)
    if (!hasInitialized.value && !Object.keys(route.query).length && !isStateDefault()) {
      updateUrlQuery();
    }

  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
    tableData.value = [];
    meta.value = { total: 0, current_page: 1, per_page: state.value.limit, last_page: 1 };
  } finally {
    isLoading.value = false;
    hasInitialized.value = true;
  }
};

const refreshData = () => {
  fetchData();
};

const retryFetch = () => {
  error.value = null;
  fetchData();
};

// ========== Event Handlers ==========
const onPageChange = (page) => {
  if (booting.value || !hasInitialized.value || isLoading.value) return;
  if (page !== state.value.page && page >= 1 && page <= meta.value.last_page) {
    const cleaned = cleanQueryParams({ ...state.value, page });
    router.push({ path: route.path, query: cleaned });
    persistStateToStorage();
  }
};




const onPageSizeChange = (newSize) => {
  if (booting.value || !hasInitialized.value || isLoading.value) return;
  handlePageSizeChange(newSize);
};

const handlePageSizeChange = (newSize) => {
  const validSize = Math.min(Math.max(newSize, MIN_PAGE_SIZE), MAX_PAGE_SIZE);
  if (validSize === state.value.limit) return;

  // --- เลือกโหมดคงหน้าเดิม หรือยึด index เดิม ---
  // โหมด A: คงหน้าเดิมไว้ (ส่วนใหญ่คนใช้งานจะคุ้นกว่า)
  const newPage = state.value.page;
  // โหมด B: ยึด index เดิม (ถ้าชอบแบบเดิม ให้ใช้สูตรด้านล่างแทน)
  // const currentFirstIndex = (state.value.page - 1) * state.value.limit;
  // const newPage = Math.max(1, Math.floor(currentFirstIndex / validSize) + 1);
  // optimistic เปลี่ยน state ก่อน เพื่อลดอาการ “สลับกลับ”
  state.value.limit = validSize;
  state.value.page = newPage;

  // อัปเดต query ทีเดียว (ทั้ง limit และ page) เพื่อกัน watcher เด้งไปเด้งมา
  updateUrlQuery({
    limit: validSize,
    page: newPage,
  });

  // (ไม่ต้อง fetch ทันที ปล่อยให้ watcher ทำงาน แล้ว persist ลง storage อัตโนมัติ)
};


const handleSort = ({ column, order }) => {
  if (booting.value || !hasInitialized.value || isLoading.value) return;
  updateUrlQuery({
    sort: column,
    order: (order ?? "ASC").toUpperCase(),
    page: 1 // Reset to first page when sorting
  });
};
const areFiltersMeaningfullyChanged = (next, curr) => {
  // เปรียบเทียบเฉพาะฟิลเตอร์ (ไม่รวม page/limit/order/sort)
  const keys = [
    "search", "type", "college_name", "start_year", "end_year",
    "college_active", "curriculum_active", "degree_active",
    "curriculum_published", "meeting_resolution"
  ];
  return keys.some(k => String(next[k] ?? "") !== String(curr[k] ?? ""));
};

const handleSearch = (filters = {}) => {
  if (booting.value || !hasInitialized.value || isLoading.value) return;

  // สร้าง next จาก state ปัจจุบัน + filters (แทนการยัด default เอง)
  const next = {
    ...state.value,
    search: filters.search ?? state.value.search ?? "",
    type: filters.type ?? state.value.type ?? "",
    college_name: (filters.college_name ?? filters.school ?? state.value.college_name ?? ""),
    start_year: (filters.startYear ?? filters.start_year ?? state.value.start_year ?? ""),
    end_year: (filters.endYear ?? filters.end_year ?? state.value.end_year ?? ""),
    college_active: filters.college_active ?? state.value.college_active ?? "1",
    curriculum_active: filters.curriculum_active ?? state.value.curriculum_active ?? "1",
    degree_active: filters.degree_active ?? state.value.degree_active ?? "",
    curriculum_published: (filters.curriculum_published ?? state.value.curriculum_published ?? true),
    meeting_resolution: filters.meeting_resolution ?? state.value.meeting_resolution ?? ""
  };

  // รีเซ็ตเป็นหน้า 1 เฉพาะเมื่อฟิลเตอร์เปลี่ยน “จริง”
  if (areFiltersMeaningfullyChanged(next, state.value)) {
    next.page = 1;
  }

  const cleanedParams = cleanQueryParams(next);

  // ถ้า query ที่จะอัปเดตไม่ต่างจากปัจจุบัน ก็ไม่ต้อง replace
  if (JSON.stringify(route.query) === JSON.stringify(cleanedParams)) return;

  updateUrlQuery(cleanedParams);
};

const applyDefaultsToState = () => {
  state.value = { ...DEFAULT_STATE };
  meta.value = {
    ...meta.value,
    current_page: DEFAULT_STATE.page,
    per_page: DEFAULT_STATE.limit,
  };
  tableData.value = [];
  error.value = null;
};

const clearSearch = async () => {
  // 1) กัน watcher/boot race
  booting.value = true;

  // 2) รีเซ็ตในหน่วยความจำก่อน
  applyDefaultsToState();

  // 3) เขียน URL ให้เป็นค่า default ที่ “ต้องคงไว้” เสมอ
  await router.replace({ path: route.path, query: { ...DEFAULT_QUERY_MIN } });

  // 4) เขียน localStorage ให้เป็นค่า default เดิม
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_QUERY_MIN));

  // 5) รอให้ route/query เสถียรก่อน แล้วค่อย sync + fetch
  await nextTick();
  syncStateFromQuery();       // อ่านจาก query ที่เพิ่ง replace
  hasInitialized.value = true; // กัน guard อื่น ๆ
  await fetchData();

  // 6) ปลดล็อก watcher ได้
  booting.value = false;
};

// ========== Lifecycle ==========
onMounted(async () => {
  syncStateFromQuery();

  // If no query params and state is default, set default query
  // ถ้าไม่มี query เลย → ลองกู้จาก localStorage
  if (!Object.keys(route.query).length) {
    const restored = restoreStateFromStorage();
    if (restored && Object.keys(restored).length) {
      // ป้องกันลูป: replace เฉพาะเมื่อแตกต่างจริง ๆ
      const currentQuery = JSON.stringify(route.query);
      const newQuery = JSON.stringify(restored);
      if (currentQuery !== newQuery) {
        router.replace({ path: route.path, query: restored });
        // ปล่อยให้ watcher ทำงาน → แล้วค่อย fetch
        // ยังถือว่า booting อยู่จน watcher/fetch รอบแรกเสร็จ
        return;
      }
    }
  }
  // มี query อยู่แล้ว หรือไม่มีอะไรให้กู้ → fetch ได้เลย
  await fetchData();
  booting.value = false;
});

// Watch for route query changes
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    // Avoid infinite loops
    if (JSON.stringify(newQuery) === JSON.stringify(oldQuery)) return;

    // กัน case: page หายชั่วคราวระหว่างบูต → เติมคืนค่าที่เรารู้อยู่ (state.page)
    if (booting.value && !Object.prototype.hasOwnProperty.call(newQuery, "page")) {
      router.replace({
        path: route.path,
        query: { ...newQuery, page: String(state.value.page || 1) }
      });
      return; // รอรอบต่อไป
    }

    syncStateFromQuery();
    persistStateToStorage();
    await fetchData();
    if (booting.value) booting.value = false;
  },
  { deep: true }
);
</script>

<style scoped>
/* Loading Animation */
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle {
  width: 0.75rem;
  height: 0.75rem;
  margin: 0 0.25rem;
  border-radius: 50%;
  background-color: #3b82f6;
  animation: wave 1.4s infinite ease-in-out;
}

@keyframes wave {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-0.75rem);
  }
}

.circle:nth-child(1) {
  animation-delay: 0s;
}

.circle:nth-child(2) {
  animation-delay: 0.1s;
}

.circle:nth-child(3) {
  animation-delay: 0.2s;
}

.circle:nth-child(4) {
  animation-delay: 0.3s;
}

.circle:nth-child(5) {
  animation-delay: 0.4s;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .block {
    padding: 1rem;
  }

  .md\:px-10 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>