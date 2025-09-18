<template>
  <div class="block gap-[20px] p-6 space-y-4">
    <!-- Search Form -->
    <div class="w-auto">
      <SearchForm
        ref="searchFormRef"
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
      </div>

      <!-- Data Table and Pagination -->
      <div v-else-if="hasData && hasInitialized">
        <DataTable
          :curriculums="tableData"
          :meta="meta"
          :isAdmin="true"
          :total="total"
          :loading="isLoading"
          :sort="state.sort"
          :order="state.order"
          @sort="handleSort"
          @refresh="refreshData"
        />

        <PaginationBar
          :current-page="currentPage"
          v-model:perPage="pageSize"
          :total="total"
          :max-visible="5"
          :loading="isLoading"
          @changePage="onPageChange"
          @changePerPage="onPageSizeChange"
        />
      </div>
      <div
        v-else-if="!isLoading"
        class="flex flex-col items-center justify-center py-8 text-gray-500"
      >
        <!-- ไอคอน -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-12 h-12 mb-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008H14.25V9.75zM12 15.75c1.5 0 2.25-.75 2.25-.75M12 3.75a8.25 8.25 0 1 0 0 16.5a8.25 8.25 0 0 0 0-16.5z"
          />
        </svg>

        <!-- ข้อความ -->
        <p class="text-lg font-medium">ไม่พบข้อมูลหลักสูตร</p>
        <p class="text-sm text-gray-400">
          กรุณาลองเปลี่ยนคำค้นหาหรือเพิ่มข้อมูลใหม่
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getEducationPaginated } from '@/services/apiService'
import PaginationBar from '@/components/PaginationBar.vue'
import DataTable from '@/components/DataTable.vue'
import SearchForm from '@/components/SearchForm.vue' /* หรือ SearchFormAdmin ถ้าใช้ตัวแอดมิน */

const route = useRoute();
const router = useRouter();
const searchFormRef = ref(null);

const DEFAULT_STATE = {
  page: 1,
  search: "",
  sort: "", // ✅ ใช้ชื่อคอลัมน์
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

const MIN_PAGE_SIZE = 5;
const MAX_PAGE_SIZE = 100;
const SORT_MAP_FROM_INDEX = {
  0: "college_name",
  1: "name",
  2: "degree_name",
  3: "start_year",
  4: "end_year",
};
const ALLOWED_SORT = new Set(Object.values(SORT_MAP_FROM_INDEX));
// state
const state = ref({ ...DEFAULT_STATE });
const tableData = ref([]);
const meta = ref({ total: 0, current_page: 1, per_page: 10, last_page: 1 });
const isLoading = ref(false);
const error = ref(null);
const hasInitialized = ref(false);
const booting = ref(true);
const wroteQuery = ref(false);

// computed
const total = computed(() => meta.value?.total || 0);
const currentPage = computed(() => state.value.page);
const pageSize = computed({
  get: () => state.value.limit,
  set: (value) => handlePageSizeChange(value),
});
const hasData = computed(() => tableData.value.length > 0);

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

function normalizeQueryParam(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function validateAndParseInt(value, def, min = 1, max = Infinity) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < min || n > max) return def;
  return n;
}

function validateString(value, allowed = null) {
  const s = String(normalizeQueryParam(value)).trim();
  if (allowed && !allowed.includes(s)) return allowed[0] || "";
  return s;
}

function readIntFromQuery(q, key, min, max, fallback) {
  if (Object.prototype.hasOwnProperty.call(q, key)) {
    const parsed = parseInt(q[key], 10);
    if (Number.isFinite(parsed) && parsed >= min && parsed <= max)
      return parsed;
    return fallback;
  }
  return state.value[key] ?? fallback;
}

function readStrFromQuery(q, key, fallback = "") {
  if (Object.prototype.hasOwnProperty.call(q, key))
    return validateString(q[key]);
  return state.value?.[key] ?? fallback;
}

function syncStateFromQuery() {
  const q = route.query;
  const qSort = normalizeQueryParam(q.sort);
  const sortIsNumeric = /^\d+$/.test(qSort);
  const sortKey = sortIsNumeric
    ? SORT_MAP_FROM_INDEX[Number(qSort)] ?? ""
    : (() => {
        const s = readStrFromQuery(q, "sort", "");
        return ALLOWED_SORT.has(s) ? s : "";
      })();
  state.value = {
    page: readIntFromQuery(q, "page", 1, Infinity, 1),
    search: readStrFromQuery(q, "search", ""),
    sort: sortKey,
    order: Object.prototype.hasOwnProperty.call(q, "order")
      ? validateString(q.order, ["ASC", "DESC"])
      : state.value.order || "ASC",
    limit: readIntFromQuery(
      q,
      "limit",
      MIN_PAGE_SIZE,
      MAX_PAGE_SIZE,
      DEFAULT_STATE.limit
    ),
    type: readStrFromQuery(q, "type", ""),
    college_active: readStrFromQuery(q, "college_active", "1") || "1",
    curriculum_active: readStrFromQuery(q, "curriculum_active", "1") || "1",
    degree_active: readStrFromQuery(q, "degree_active", ""),
    college_name: readStrFromQuery(q, "college_name", ""),
    start_year: readStrFromQuery(q, "start_year", ""),
    end_year: readStrFromQuery(q, "end_year", ""),
    curriculum_published: Object.prototype.hasOwnProperty.call(
      q,
      "curriculum_published"
    )
      ? normalizeQueryParam(q.curriculum_published) !== "false"
      : state.value.curriculum_published,
    meeting_resolution: readStrFromQuery(q, "meeting_resolution", ""),
  };
  meta.value = {
    ...meta.value,
    current_page: state.value.page,
    per_page: state.value.limit,
  };
  wroteQuery.value = Number(state.value.page) > 1;
}

function buildPagingQuery(page = state.value.page) {
  const q = buildQueryForUrl({ ...state.value });
  q.page = String(page); // ใส่หน้า
  if (!q.limit) q.limit = String(state.value.limit ?? DEFAULT_STATE.limit);
  return q;
}

// fetch
let fetchSeq = 0;
async function fetchData() {
  if (isLoading.value) return;
  const seq = ++fetchSeq;
  try {
    isLoading.value = true;
    error.value = null;

    const sortKey = ALLOWED_SORT.has(String(state.value.sort))
      ? String(state.value.sort)
      : "";
    const filters = {
      sort: sortKey || undefined,
      order: sortKey ? state.value.order : undefined,
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

    // NOTE: ใช้ลายเซ็นตามโปรเจกต์ของคุณ (page, limit, filters)
    const response = await getEducationPaginated(
      state.value.page,
      state.value.limit,
      filters
    );
    if (!response?.data) throw new Error("ไม่ได้รับข้อมูลจากเซิร์ฟเวอร์");
    if (seq !== fetchSeq) return;
// console.log("response.data", response.data);
    const { data: rows = [], meta: metaData = {} } = response.data || {};
    tableData.value = rows;
    meta.value = {
      total: Number(metaData.total) || 0,
      current_page: state.value.page,
      per_page: Number(metaData.per_page) || state.value.limit,
      last_page:
        Number(metaData.last_page) ||
        Math.max(
          1,
          Math.ceil(
            (Number(metaData.total) || 0) /
              (Number(metaData.per_page) || state.value.limit)
          )
        ),
    };

    // page overflow → เด้งกลับหน้าสุดท้าย
    if (
      hasInitialized.value &&
      state.value.page > meta.value.last_page &&
      meta.value.last_page > 0
    ) {
      await nextTick();
      state.value.page = meta.value.last_page;
      router.replace({ path: route.path, query: buildPagingQuery(state.value.page) });
      return;
    }
  } catch (err) {
    if (seq !== fetchSeq) return;
    console.error("Error fetching data:", err);
    error.value = err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
    tableData.value = [];
    meta.value = {
      total: 0,
      current_page: 1,
      per_page: state.value.limit,
      last_page: 1,
    };
  } finally {
    isLoading.value = false;
    hasInitialized.value = true;
  }
}

const refreshData = () => fetchData();

// handlers
const onPageChange = (page) => {
  if (booting.value || !hasInitialized.value || isLoading.value) return;
  if (page !== state.value.page && page >= 1 && page <= meta.value.last_page) {
    wroteQuery.value = true;
    state.value.page = page;
    router.push({ path: route.path, query: buildPagingQuery(page) });
  }
};

function handlePageSizeChange(newSize) {
  const size = Math.min(Math.max(newSize, MIN_PAGE_SIZE), MAX_PAGE_SIZE);
  if (size === state.value.limit) return;
  state.value.limit = size;
  state.value.page = 1;
  wroteQuery.value = true;
  router.replace({ path: route.path, query: buildPagingQuery(1) });
}

const onPageSizeChange = (v) => {
  if (booting.value || !hasInitialized.value || isLoading.value) return;
  handlePageSizeChange(v);
};

const handleSort = ({ column, order }) => {
  if (booting.value || !hasInitialized.value || isLoading.value) return;
  const nextOrder = (order ?? "ASC").toUpperCase();
  if (state.value.sort === column && state.value.order === nextOrder) return;

  state.value.sort = column;
  state.value.order = nextOrder;
  state.value.page = 1;
  wroteQuery.value = true;
  const q = buildQueryForUrl(state.value);
  router.replace({ path: route.path, query: q });
};

function areFiltersMeaningfullyChanged(next, curr) {
  const keys = [
    "search",
    "type",
    "college_name",
    "start_year",
    "end_year",
    "college_active",
    "curriculum_active",
    "degree_active",
    "curriculum_published",
    "meeting_resolution",
  ];
  return keys.some((k) => String(next[k] ?? "") !== String(curr[k] ?? ""));
}

const handleSearch = (filters = {}) => {
  if (booting.value || !hasInitialized.value || isLoading.value) return;
  const next = {
    ...state.value,
    search: filters.search ?? state.value.search ?? "",
    type: filters.type ?? state.value.type ?? "",
    college_name:
      filters.college_name ?? filters.school ?? state.value.college_name ?? "",
    start_year:
      filters.startYear ?? filters.start_year ?? state.value.start_year ?? "",
    end_year: filters.endYear ?? filters.end_year ?? state.value.end_year ?? "",
    college_active: filters.college_active ?? state.value.college_active ?? "1",
    curriculum_active:
      filters.curriculum_active ?? state.value.curriculum_active ?? "1",
    degree_active: filters.degree_active ?? state.value.degree_active ?? "",
    curriculum_published:
      filters.curriculum_published ?? state.value.curriculum_published ?? true,
    meeting_resolution:
      filters.meeting_resolution ?? state.value.meeting_resolution ?? "",
  };
  const changed = areFiltersMeaningfullyChanged(next, state.value);
  if (!changed) return;
  state.value = { ...next, page: 1 }; // ให้ UI sync กับสิ่งที่กรอก
  wroteQuery.value = true;
  // เขียนฟิลเตอร์ลง URL (page=1 จะไม่ใส่ page ก็ได้ แต่เราคง limit/sort ที่จำเป็น)
  const q = buildQueryForUrl(state.value);
  router.replace({ path: route.path, query: q });
};

// สร้าง query จาก state ปัจจุบัน (กรองค่าเริ่มต้น/ค่าว่างออก)
function buildQueryForUrl(s = state.value) {
  const q = {};
  const add = (k, v) => {
    if (v === undefined || v === null) return;
    const vv = String(v);
    if (vv !== "" && vv !== String(DEFAULT_STATE[k])) q[k] = vv;
  };
  // ฟิลเตอร์หลัก
  add("search", s.search);
  add("type", s.type);
  add("college_name", s.college_name);
  add("start_year", s.start_year);
  add("end_year", s.end_year);
  add("college_active", s.college_active);
  add("curriculum_active", s.curriculum_active);
  add("degree_active", s.degree_active);
  if (s.curriculum_published !== DEFAULT_STATE.curriculum_published) {
    q.curriculum_published = String(s.curriculum_published);
  }
  add("meeting_resolution", s.meeting_resolution);
  // sort/order
  if (s.sort) {
    q.sort = String(s.sort);
    if (String(s.order).toUpperCase() !== DEFAULT_STATE.order) {
      q.order = String(s.order).toUpperCase();
    }
  }
  // limit (ถ้าเปลี่ยนจากดีฟอลต์)
  if (Number(s.limit) !== DEFAULT_STATE.limit) q.limit = String(s.limit);
  return q;
}

// lifecycle
onMounted(async () => {
  syncStateFromQuery();
  await fetchData();
  booting.value = false;
});

// sync เมื่อ query เปลี่ยน (เช่น คลิกหน้า)
let ignoreNextRouteSync = false;

watch(
  () => route.query,
  async (n, o) => {
    if (ignoreNextRouteSync) {
      ignoreNextRouteSync = false; // ข้ามซิงค์ครั้งเดียว
      return;
    }
    if (JSON.stringify(n) === JSON.stringify(o)) return;
    syncStateFromQuery();
    await fetchData();
    if (booting.value) booting.value = false;
  },
  { deep: true }
);

const clearSearch = () => {
  searchFormRef.value?.reset();
  state.value = { ...DEFAULT_STATE };

  // เคลียร์ URL โดยไม่ให้ watcher ยิง fetch ซ้ำ
  ignoreNextRouteSync = true;
  router.replace({ path: route.path, query: {} }).catch(() => {});

  // ยิงโหลดรอบเดียว
  fetchData();
};
</script>

<style scoped>
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
</style>