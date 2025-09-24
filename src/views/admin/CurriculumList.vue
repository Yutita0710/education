<template>
  <div class="block gap-[20px] p-6 space-y-4">
    <!-- Search Form -->
    <div class="w-auto">
      <SearchFormAdmin @onSearch="handleSearch" @clear="clearSearch" />
    </div>
    <AddCurriculumModal
      :showModal="showCurriculumModal"
      :closeModal="closeCurriculumModal"
      @close="closeCurriculumModal"
    />
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
    </div>
    <div class="w-auto md:px-10">
      <!-- ✅ แสดง DataTable และ Pagination เฉพาะเมื่อมีข้อมูล -->
      <div v-if="tableData.length > 0">
        <DataTableAdmin
          :curriculums="tableData"
          :meta="meta"
          :total="total"
          @refreshData="fetchData"
        />

        <PaginationBar
          :current-page="currentPage"
          v-model:perPage="pageSize"
          :total="total"
          :max-visible="5"
          @changePage="onPageChange"
        />
      </div>

      <!-- ✅ แสดงข้อความกรณีไม่มีข้อมูล -->
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

  <DetailCurriculumModal
    :key="detailCurriculum?.id ?? (showDetailModal ? 'open' : 'closed')"
    :showModal="showDetailModal"
    :curriculum="detailCurriculum"
    :closeModal="closeDetailModal"
    @refresh-data="fetchData"
  />

  <EditCurriculumModal
    v-if="showEditModal"
    :key="editingCurriculum?.id ?? 'new'"
    :showModal="showEditModal"
    :curriculum="editingCurriculum"
    :closeModal="closeEditModal"
    @refresh-data="handleEditSaved"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getEducationPaginated } from "@/services/apiService";
import { computed } from "vue";
import SearchFormAdmin from "@/components/SearchFormAdmin.vue";
import AddCurriculumModal from "@/components/AddCurriculumModal.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import DataTableAdmin from "@/components/DataTableAdmin.vue";
import DetailCurriculumModal from "@/components/DetailCurriculumModal.vue";
import EditCurriculumModal from "@/components/EditCurriculumModal.vue";

const isAdmin = !!localStorage.getItem("token");
const route = useRoute();
const router = useRouter();
const currentPage = computed(() => Number(state.value.page) || 1);
const isPristineUrl = ref(Object.keys(route.query || {}).length === 0);
let ignoreNextRouteSync = false;
const showCurriculumModal = ref(false);
// ---------- state หลัก (ผูกกับ URL) ----------
const state = ref({
  page: 1,
  search: "",
  sort: 0, // ใช้เลข (สะดวกกับ backend)
  order: "ASC",
  limit: 10,
  type: "", // degreeId หรือ filter
  college_active: "",
  curriculum_active: "",
  degree_active: "",
  college_name: "",
  start_year: "",
  end_year: "",
  curriculum_published: "", // '', 'true', 'false'
  meeting_resolution: "",
});

// ---------- ตาราง + meta ----------
const tableData = ref([]);
const total = computed(() => meta.value?.total ?? tableData.value.length);
const meta = ref({
  total: 0,
  current_page: 1,
  per_page: 10,
  last_page: 1,
});
const isLoading = ref(false);
let reqSeq = 0;

// pageSize (ผูกกับ PaginationBar)
const pageSize = computed({
  get: () => Number(state.value.limit) || 10,
  set: (val) => onPageSizeChange(val),
});

function onPageSizeChange(newSize) {
  // กันยิงตั้งแต่ mount/โหลด
  if (isLoading.value) return;
  const n = Number(newSize);
  if (!Number.isFinite(n)) return;
  if (n === state.value.limit) return;
  // มี action ผู้ใช้แล้ว
  isPristineUrl.value = false;
  // เปลี่ยน limit แล้วรีเซ็ตไปหน้า 1
  state.value.limit = n;
  state.value.page = 1;
  pushQuery({ limit: n, page: 1 });
}
// ---------- utils ----------
const toInt = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

// แปลงค่า option: null/undefined/"undefined"/"null"/"" -> ""
const toOpt = (v) => {
  if (v == null) return "";
  const s = String(v).trim();
  return s === "" ||
    s.toLowerCase() === "undefined" ||
    s.toLowerCase() === "null"
    ? ""
    : s;
};

const clean = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === "" || v == null) continue; // ตัดค่าว่างออกจาก URL
    out[k] = String(v);
  }
  return out;
};

const showDetailModal = ref(false);
const detailCurriculum = ref(null); // <- ใช้กับ DetailCurriculumModal

const showEditModal = ref(false);
const editingCurriculum = ref(null); // <- ใช้กับ EditCurriculumModal
const selectedCurriculum = ref(null);
// เปิดรายละเอียด
function openDetail(row) {
  detailCurriculum.value = { ...(row || {}) };
  showDetailModal.value = true;
}

function closeDetailModal() {
  // <- ชื่อต้องตรงกับ :closeModal
  showDetailModal.value = false;
  detailCurriculum.value = null;
}

function openEditFromDetail(row) {
  // <- ถูกเรียกจาก @request-edit ของ Detail
  showDetailModal.value = false; // ปิด detail ก่อน
  editingCurriculum.value = { ...(row || detailCurriculum.value || {}) };
  showEditModal.value = true;
}

function closeEditModal() {
  // <- ชื่อต้องตรงกับ :closeModal
  showEditModal.value = false;
  editingCurriculum.value = null;
}

// เมื่อ Edit บันทึกเสร็จ -> ปิด Edit -> รวมข้อมูล/หรือดึงใหม่ -> เปิด Detail
async function handleEditSaved(e) {
  showEditModal.value = false;

  const id =
    e?.id ?? editingCurriculum.value?.id ?? detailCurriculum.value?.id ?? null;

  editingCurriculum.value = null;

  // ถ้ามี service ดึง detail ให้ใช้ (ไม่มีก็รวม payload กลับ)
  // const { data } = await getEducationById(id);
  // detailCurriculum.value = data?.data ?? data ?? { ...(detailCurriculum.value||{}), ...(e?.atch||{}), id };

  detailCurriculum.value = {
    ...(detailCurriculum.value || {}),
    ...(e?.atch || {}),
    id,
  };

  showDetailModal.value = true;

  // รีเฟรชตารางด้านล่างด้วยถ้าต้องการ
  fetchData();
}

function syncStateFromQuery() {
  const q = route.query;
  state.value.page = toInt(q.page, 1);
  state.value.search = toOpt(q.search);
  state.value.sort = toInt(q.sort, 0);
  state.value.order =
    String(q.order || "").toUpperCase() === "DESC" ? "DESC" : "ASC";
  state.value.limit = toInt(q.limit, 10);

  state.value.type = toOpt(q.type);
  state.value.college_active = toOpt(q.college_active) || "";
  state.value.curriculum_active = toOpt(q.curriculum_active) || "";
  state.value.degree_active = toOpt(q.degree_active);
  state.value.college_name = toOpt(q.college_name);

  state.value.start_year = toOpt(q.start_year);
  state.value.end_year = toOpt(q.end_year);
  state.value.curriculum_published = toOpt(q.curriculum_published); // <-- จะไม่เป็น "undefined" แล้ว
  state.value.meeting_resolution = toOpt(q.meeting_resolution); // <--
}

function buildFullQuery(partial = {}) {
  const s = { ...state.value, ...partial };
  const out = {
    page: s.page,
    search: toOpt(s.search),
    sort: s.sort,
    order: s.order,
    limit: s.limit,
    type: toOpt(s.type),
    college_active: toOpt(s.college_active),
    curriculum_active: toOpt(s.curriculum_active),
    degree_active: toOpt(s.degree_active),
    college_name: toOpt(s.college_name),
    start_year: toOpt(s.start_year),
    end_year: toOpt(s.end_year),
    curriculum_published: toOpt(s.curriculum_published),
    meeting_resolution: toOpt(s.meeting_resolution),
  };
  if (isPristineUrl.value) {
    delete out.page;
    delete out.limit;
  }
  return out;
}

async function pushQuery(partial) {
  await writeUrl(clean(buildFullQuery(partial)));
}

const toBoolish = (v) => {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  if (v === false || v === "false" || v === 0 || v === "0") return false;
  return "";
};

 function hasOnlyDefaultPageLimit(q = route.query) {
   const hasPageOrLimit = Object.prototype.hasOwnProperty.call(q, 'page') ||
                          Object.prototype.hasOwnProperty.call(q, 'limit');
   if (!hasPageOrLimit) return false; // ถ้าไม่มี page/limit ก็ไม่ต้อง sanitize
   const page = String(q.page ?? "");
   const limit = String(q.limit ?? "");
   const onlyDefault =
     (page === "" || page === "1") && (limit === "" || limit === "10");
   const others = Object.keys(q).filter((k) => !["page", "limit"].includes(k));
   return onlyDefault && others.length === 0;
 }

function writeUrl(query) {
  // เขียน URL เฉพาะหลังมี action ผู้ใช้เท่านั้น
  if (isPristineUrl.value) return;
  return router.replace({ query });
}
// ---------- โหลดข้อมูล ----------
async function fetchData() {
  try {
    isLoading.value = true;
    const mySeq = ++reqSeq;
    const filters = {
      sort: state.value.sort,
      order: state.value.order,
      search: toOpt(state.value.search),
      college_name: toOpt(state.value.college_name),
      college_active: toOpt(state.value.college_active),
      curriculum_active: toOpt(state.value.curriculum_active),
      degree_active: toOpt(state.value.degree_active),
      start_year: toOpt(state.value.start_year),
      end_year: toOpt(state.value.end_year),
      curriculum_published: toBoolish(state.value.curriculum_published),
      meeting_resolution: toOpt(state.value.meeting_resolution),
      type: toOpt(state.value.type),
    };

    // console.log("👉 filters:", filters);
    // console.log(
    //   "👉 fetchData page/limit:",
    //   state.value.page,
    //   state.value.limit,
    //   filters
    // );
    // ❗️ถ้า service ของคุณเป็น (page, limit, filters) ให้ใช้บรรทัดนี้แทน:
    const res = await getEducationPaginated(
      state.value.page,
      state.value.limit,
      filters
    );
    // console.log(res);
    if (mySeq !== reqSeq) return;
    const rows = res?.data?.data ?? [];
    const m = res?.data?.meta ?? {};

    tableData.value = rows;
    meta.value = {
      total: Number(m.total ?? 0),
      current_page: Number(m.current_page ?? state.value.page),
      per_page: Number(m.per_page ?? state.value.limit),
      last_page:
        Number(m.last_page) ||
        Math.max(
          1,
          Math.ceil(
            Number(m.total ?? 0) / Number(m.per_page ?? state.value.limit)
          )
        ),
    };

    // ถ้าหน้าปัจจุบันเกินหน้าสุดท้ายหลังกรอง → เด้งกลับหน้าสุดท้าย
    if (state.value.page > meta.value.last_page) {
      pushQuery({ page: meta.value.last_page || 1 });
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    isLoading.value = false;
  }
}

// ---------- handlers ----------
function onPageChange(page) {
  isPristineUrl.value = false; // ผู้ใช้เปลี่ยนหน้าแล้ว
  pushQuery({ page });
}

function handleSearch(f = {}) {
  // รับ payload จาก <SearchForm /> (รองรับหลายคีย์ชื่อ)
  isPristineUrl.value = false;
  pushQuery({
    page: 1,
    type: f.type ?? state.value.type,
    search: f.search ?? state.value.search,
    college_name: f.college_name ?? f.school ?? state.value.college_name,
    sort: f.sort ?? state.value.sort,
    order: f.order ?? state.value.order,
    limit: f.limit ?? state.value.limit,
    start_year: f.startYear ?? f.start_year ?? state.value.start_year,
    end_year: f.endYear ?? f.end_year ?? state.value.end_year,
    curriculum_published:
      f.curriculum_published ?? state.value.curriculum_published,
    meeting_resolution: f.meeting_resolution ?? state.value.meeting_resolution,
    college_active: f.college_active ?? state.value.college_active,
    curriculum_active: f.curriculum_active ?? state.value.curriculum_active,
    degree_active: f.degree_active ?? state.value.degree_active,
  });
}

function clearSearch() {
  // กลับสู่สภาพ "ยังไม่เคยมี action"
  isPristineUrl.value = true;
  ignoreNextRouteSync = true;

  // ล้าง query + คง path ที่ถูกต้อง (/education/admin/curriculum)
  router.replace({ name: "admin-curriculum", query: {} }).catch(() => {});

  // รีเซ็ต state เริ่มต้น
  state.value = {
    ...state.value,
    page: 1,
    limit: 10,
    search: "",
    sort: 0,
    order: "ASC",
    type: "",
    college_active: "",
    curriculum_active: "",
    degree_active: "",
    college_name: "",
    start_year: "",
    end_year: "",
    curriculum_published: "",
    meeting_resolution: "",
  };

  // โหลดข้อมูลรอบเดียว (watch จะไม่ยิงซ้ำเพราะ ignoreNextRouteSync = true)
  fetchData();
}

// ---------- lifecycle ----------

function closeCurriculumModal() {
  showCurriculumModal.value = false;
  fetchData();
}

// เปลี่ยน URL (รวม back/forward) → sync + fetch
watch(
  () => route.query,
  (q, o) => {
    if (ignoreNextRouteSync) {
      ignoreNextRouteSync = false;
      return;
    }
   // 1) ซิงก์และโหลดก่อนเสมอ
   syncStateFromQuery();
   fetchData();

   // 2) ถ้าหน้าเพิ่งเปิด (pristine) และมี page/limit โผล่มาแบบค่าเริ่มต้นจริง ๆ ค่อยล้าง URL
   if (isPristineUrl.value && hasOnlyDefaultPageLimit(q)) {
     ignoreNextRouteSync = true;
     router.replace({ name: "admin-curriculum", query: {} }).catch(() => {});
   }
  },
  { immediate: true, deep: true }
);

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
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10em;
}
.circle {
  width: 1em;
  height: 1em;
  margin: 0 0.25em;
  border-radius: 50%;
  background-color: #a8d5e2;
  animation: wave 1.5s infinite ease-in-out;
  transition: background-color 0.3s ease;
}
@keyframes wave {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1em);
  }
}
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
