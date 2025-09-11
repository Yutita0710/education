<template>
  <div class="p-6 text-gray-700 space-y-4">
    <div class="w-auto">
      <SearchCollegeAdmin @update:filters="onFiltersUpdate" />
    </div>
    <!-- ตาราง -->
    <div class="mb-8 sm:px-8 md:px-4 lg:px-4 xl:px-20">
      <div
        class="flex flex-col sm:flex-row justify-between items-center sm:items-center py-4"
      >
        <p class="text-lg font-bold mb-3 sm:mb-0">
          สถาบัน ({{
            Number(totalItems ?? 0).toLocaleString("th-TH-u-nu-latn")
          }}) รายการ
        </p>

        <button
          @click="showCollegeModal = true"
          class="inline-flex items-center gap-2 bg-[#0085DB] hover:bg-[#0072B1] text-white px-4 py-2 rounded-full shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clip-rule="evenodd"
            />
          </svg>
          เพิ่มข้อมูลสถาบัน
        </button>
      </div>

      <div
        class="overflow-y-auto md:overflow-y-hidden border border-gray-300 rounded-lg"
      >
        <table
          class="w-full border-collapse border border-gray-300 text-sm sm:text-base"
        >
          <thead>
            <tr class="bg-[#E2EDFC] font-bold">
              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[40px]"
              >
                กลุ่มสถาบัน
              </th>
              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[400px]"
              >
                ชื่อสถาบัน
              </th>
              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[200px]"
              >
                วิทยาเขต
              </th>

              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[100px]"
              >
                ประเทศ
              </th>
              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[100px]"
              >
                จังหวัด
              </th>
              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[50px]"
              >
                จำนวนหลักสูตร
              </th>

              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[50px]"
              >
                สถานะการใช้งาน
              </th>
              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[50px]"
              >
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody v-if="Array.isArray(colleges) && colleges.length > 0">
            <tr
              v-for="item in colleges"
              :key="item.id"
              :class="[
                'hover:bg-gray-50',
                item.active === 0 ? 'bg-gray-100 text-gray-300' : '',
              ]"
            >
              <td class="border px-2 py-1 text-center">
                {{ item.institute_group }}
              </td>
              <td class="border px-2 py-1 break-words">{{ item.name }}</td>
              <td class="border px-2 py-1 break-words">{{ item.campus }}</td>
              <td class="border px-2 py-1 break-words">
                {{ item.countryName }}
              </td>
              <td class="border px-2 py-1 break-words">
                {{ item.provinceName }}
              </td>
              <td
                class="border px-2 py-1 break-words cursor-pointer"
                @click="goToCurriculum(item.name)"
              >
                {{ item.curriculumCount || 0 }}
              </td>

              <td
                class="border px-2 py-1 text-center items-center justify-center"
              >
                <span
                  :class="
                    item.active
                      ? 'bg-[#09C97F1A] text-[#09C97F]'
                      : 'bg-[#FB977D1A] text-[#FB977D]'
                  "
                  class="rounded-full px-3 py-1 text-xs readonly font-medium"
                >
                  {{ item.active === 1 ? "ใช้งาน" : "ไม่ใช้งาน" }}
                </span>
              </td>
              <td class="border px-2 py-1">
                <div class="flex flex-row gap-2 items-center justify-center">
                  <!-- View Detail -->
                  <div class="relative inline-block group">
                    <button
                      @click.stop="openDetailCollegeModal(item)"
                      :aria-describedby="`tt-view-${item.id}`"
                      class="inline-flex items-center bg-[#0085DB] text-white w-10 h-10 rounded-full hover:bg-blue-500 transition justify-center"
                      type="button"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-7"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M4.5 12.5C7.5 6 16.5 6 19.5 12.5"
                            stroke="#ffff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16Z"
                            stroke="#ffff"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </g>
                      </svg>
                    </button>

                    <!-- tooltip -->
                    <div
                      :id="`tt-view-${item.id}`"
                      role="tooltip"
                      class="pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 invisible transition-opacity duration-200 group-hover:opacity-100 group-hover:visible"
                    >
                      View detail
                      <span
                        class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"
                      ></span>
                    </div>
                  </div>

                  <!-- Edit -->

                  <!-- Edit -->
                  <div class="relative inline-block group">
                    <button
                      @click.stop="openEditcollegeModal(item)"
                      :aria-describedby="`tt-edit-${item.id}`"
                      class="inline-flex items-center bg-[#F8B15D] text-white w-10 h-10 rounded-full hover:bg-orange-500 transition justify-center"
                      type="button"
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>

                    <!-- tooltip -->
                    <div
                      :id="`tt-edit-${item.id}`"
                      role="tooltip"
                      class="pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 invisible transition-opacity duration-200 group-hover:opacity-100 group-hover:visible"
                    >
                      Edit
                      <span
                        class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"
                      ></span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PaginationBar
        :current-page="state.page"
        v-model:perPage="state.limit"
        :per-page="state.limit"
        :total="totalItems"
        :max-visible="5"
        @changePage="onPageChange"
        @changePerPage="onPerPageChange"
      />
    </div>

    <!-- Add Modal -->
    <AddCollegeModal
      :showModal="showCollegeModal"
      :closeModal="closeCollegeModal"
      @close="closeCollegeModal"
    />

    <!-- Edit Modal - เพิ่มส่วนนี้ -->
    <EditCollegeModal
      :showModal="showEditModal"
      :selectedCollege="selectedCollege"
      @close="showEditModal = false"
      @saved="fetchData"
    />

    <!-- Detail Modal -->
    <DetailCollegeModal
      v-if="showCollegeDetailModal && selectedCollegeDetail"
      :key="selectedCollegeDetail?.id"
      :showModal="showCollegeDetailModal"
      :closeModal="closeCollegeDetailModal"
      :collegeId="selectedCollegeDetail?.id ?? null"
      @close="closeCollegeDetailModal"
    />
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
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getCollegesPaginated,
  countCurriculum,
  provinceList,   // ← ใช้ API provinces
  countryList,    // ← ใช้ API countries
} from "@/services/apiService";

import SearchCollegeAdmin from "@/components/SearchCollegeAdmin.vue";
import PaginationBar from "@/components/PaginationBar.vue";
import AddCollegeModal from "@/components/AddCollegeModal.vue";
import EditCollegeModal from "@/components/EditCollegeModal.vue";
import DetailCollegeModal from "@/components/DetailCollegeModal.vue";

const route = useRoute();
const router = useRouter();

/** ---------- master maps (ประเทศ/จังหวัด) ---------- */
const countriesRef = ref({ byId: new Map() });
const provincesRef = ref({ byId: new Map() });
const mastersLoaded = ref(false);

function seedIdNameMap(target, list = []) {
  for (const it of list) {
    // รองรับหลายรูปแบบ field ของ API
    const id =
      it?.id ?? it?.country_id ?? it?.province_id ?? it?.value ?? it?.code ?? it?.pk;
    const name =
      it?.name_th ?? it?.thai_name ?? it?.nameTh ?? it?.name ?? it?.label ?? it?.title;
    if (id != null && name) {
      const keyNum = Number(id);
      target.set(Number.isFinite(keyNum) ? keyNum : String(id), String(name));
    }
  }
}

async function loadMastersOnce() {
  if (mastersLoaded.value) return;
  try {
    const [provRes, countryRes] = await Promise.all([provinceList(), countryList()]);
    const provinces = provRes?.data?.data ?? provRes?.data ?? [];
    const countries = countryRes?.data?.data ?? countryRes?.data ?? [];
    provincesRef.value.byId.clear();
    countriesRef.value.byId.clear();
    seedIdNameMap(provincesRef.value.byId, provinces);
    seedIdNameMap(countriesRef.value.byId, countries);
  } finally {
    mastersLoaded.value = true; // ป้องกันโหลดซ้ำ แม้ error จะ fallback เป็นค่าว่าง
  }
}

/** ---------- counts (จาก /education/countCurriculums) ---------- */
const countsRef = ref({ byId: new Map(), byName: new Map() });
const countsLoaded = ref(false);

function normalizeNameKey(s) {
  return String(s ?? "").trim().toLowerCase();
}
function hydrateCounts(list = []) {
  countsRef.value.byId.clear();
  countsRef.value.byName.clear();
  for (const it of list) {
    const id = Number(it?.college_id);
    const name = normalizeNameKey(it?.college_name);
    const count = Number(it?.curriculum_count);
    const safe = Number.isFinite(count) ? count : 0;
    if (Number.isFinite(id)) countsRef.value.byId.set(id, safe);
    if (name) countsRef.value.byName.set(name, safe);
  }
  countsLoaded.value = true;
}

/** ✅ ค่ามาตรฐาน (sort = field, order = direction) */
const DEFAULTS = {
  page: 1,
  limit: 10,
  sort: "id",
  order: "ASC",
  search: "",
  country: "",
  province: "",
  status: "",
};

/** ---------- state ที่ sync กับ URL ---------- */
const state = reactive({ ...DEFAULTS });

/** ---------- ตาราง + meta ---------- */
const isLoading = ref(false);
const rows = ref([]);
const meta = ref({
  total: 0,
  per_page: DEFAULTS.limit,
  current_page: DEFAULTS.page,
  last_page: 1,
});

const colleges = computed(() => rows.value);
const totalItems = computed(() => Number(meta.value?.total ?? rows.value.length));

/** ---------- modal & selections ---------- */
const showCollegeModal = ref(false);
const showEditModal = ref(false);
const showCollegeDetailModal = ref(false);
const selectedCollege = ref(null);
const selectedCollegeDetail = ref(null);

/** ---------- utils ---------- */
const toInt = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};
const toOpt = (v) => {
  if (v == null) return "";
  const s = String(v).trim();
  return s === "" || s.toLowerCase() === "undefined" || s.toLowerCase() === "null"
    ? ""
    : s;
};
const isNumericId = (v) =>
  typeof v === "number" || (typeof v === "string" && /^\d+$/.test(v.trim()));

/** ---------- URL -> state ---------- */
function syncFromUrl() {
  const q = route.query;
  state.page = toInt(q.page, DEFAULTS.page);
  state.limit = toInt(q.limit, DEFAULTS.limit);
  state.sort = toOpt(q.sort) || DEFAULTS.sort;
  state.order = toOpt(q.order) || DEFAULTS.order;
  state.search = toOpt(q.search) || DEFAULTS.search;
  state.country = toOpt(q.country) || DEFAULTS.country;
  state.province = toOpt(q.province) || DEFAULTS.province;
  state.status = toOpt(q.status) || DEFAULTS.status;
}

/** ---------- state -> query ---------- */
function buildQuery(partial = {}) {
  const s = { ...state, ...partial };
  const allDefault =
    s.page === DEFAULTS.page &&
    s.limit === DEFAULTS.limit &&
    s.sort === DEFAULTS.sort &&
    s.order === DEFAULTS.order &&
    (s.search || "") === "" &&
    (s.country || "") === "" &&
    (s.province || "") === "" &&
    (s.status || "") === "";
  if (allDefault) return {};
  const q = {};
  if (s.page !== DEFAULTS.page) q.page = s.page;
  q.limit = s.limit;
  if (s.sort !== DEFAULTS.sort) q.sort = s.sort;
  if (s.order !== DEFAULTS.order) q.order = s.order;
  if (s.search) q.search = s.search;
  if (s.country) q.country = s.country;
  if (s.province) q.province = s.province;
  if (s.status !== "") q.status = s.status;
  return q;
}
async function pushQuery(partial = {}) {
  await router.replace({ query: buildQuery(partial) });
}

/** ---------- ช่วยแปลง id → ชื่อ ผ่าน Map ---------- */
function resolveName(raw, mapRef) {
  if (raw == null) return "";
  if (typeof raw === "object") {
    return raw.name_th ?? raw.nameTh ?? raw.name ?? raw.label ?? "";
  }
  if (isNumericId(raw)) {
    const keyNum = Number(raw);
    const keyStr = String(raw);
    return mapRef.byId.get(keyNum) ?? mapRef.byId.get(keyStr) ?? "";
  }
  return String(raw);
}

/** ---------- mapCollege ---------- */
function mapCollege(c = {}, counts = countsRef.value) {
  const countryRaw = c.countryName ?? c.country_name ?? c.country;
  const provinceRaw = c.provinceName ?? c.province_name ?? c.province;

  const countryName = resolveName(countryRaw, countriesRef.value);
  const provinceName = resolveName(provinceRaw, provincesRef.value);

  const id = Number(c.id ?? c.college_id ?? c.collegeId);
  const nameKey = normalizeNameKey(c.name ?? c.college_name ?? "");

  // ใช้จำนวนจาก countCurriculum ก่อน ถ้ามี
  const fromCountApi =
    (Number.isFinite(id) ? counts.byId.get(id) : undefined) ??
    (nameKey ? counts.byName.get(nameKey) : undefined);

  const candidate =
    (typeof fromCountApi === "number" ? fromCountApi : undefined) ??
    Number(
      c.curriculumCount ??
        c.curriculum_count ??
        c.curriculums_count ??
        (Array.isArray(c.curriculums) ? c.curriculums.length : undefined)
    );

  const curriculumCount =
    typeof candidate === "number" && Number.isFinite(candidate) ? candidate : 0;

  return {
    ...c,
    countryName: countryName || " ",  // กันคอลัมน์หด
    provinceName: provinceName || " ",
    curriculumCount,
  };
}

/** ---------- โหลดข้อมูล ---------- */
let lastReqId = 0;
async function fetchData() {
  const reqId = ++lastReqId;
  try {
    isLoading.value = true;

    // โหลด master (ประเทศ/จังหวัด) และ countCurriculum ให้พร้อมก่อน
    if (!mastersLoaded.value) {
      await loadMastersOnce();
    }
    if (!countsLoaded.value) {
      try {
        const cnt = await countCurriculum();
        hydrateCounts(cnt?.data?.data ?? cnt?.data ?? []);
      } catch {
        // ถ้า error ก็ปล่อยให้ fallback = 0
      }
    }

    const params = {
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      order: state.order,
      search: state.search || undefined,
      country: state.country || undefined,
      province: state.province || undefined,
      status: state.status === "" ? undefined : Number(state.status),
    };

    const res = await getCollegesPaginated(params);
    if (reqId !== lastReqId) return;

    const dataRows = res?.data?.data ?? res?.data ?? [];
    rows.value = dataRows.map((c) => mapCollege(c));

    const m = res?.data?.meta ?? {};
    meta.value = {
      total: Number(m.total ?? 0),
      per_page: Number(m.per_page ?? state.limit),
      current_page: Number(m.current_page ?? state.page),
      last_page:
        Number(m.last_page) ||
        Math.max(
          1,
          Math.ceil(
            (Number(m.total ?? 0) || 0) / (Number(m.per_page ?? state.limit) || 1)
          )
        ),
    };

    if (state.page > meta.value.last_page) {
      pushQuery({ page: meta.value.last_page || 1 });
    }
  } finally {
    if (reqId === lastReqId) isLoading.value = false;
  }
}

/** ---------- filters ---------- */
function normalizeFilterFromPayload(payload = {}) {
  return {
    search: (payload.search ?? "").trim(),
    country: payload.country ?? "",
    province: payload.province ?? "",
    status: payload.status ?? "",
  };
}
function currentFiltersFromUrl() {
  const q = route.query;
  return {
    search: (q.search ?? "").toString(),
    country: (q.country ?? "").toString(),
    province: (q.province ?? "").toString(),
    status: (q.status ?? "").toString(),
  };
}
function shallowEqual(a, b) {
  const keys = ["search", "country", "province", "status"];
  return keys.every((k) => String(a[k]) === String(b[k]));
}
function onFiltersUpdate(payload) {
  const nextFilters = normalizeFilterFromPayload(payload);
  const curFilters = currentFiltersFromUrl();
  if (shallowEqual(nextFilters, curFilters)) return;
  pushQuery({ page: 1, ...nextFilters });
}

/** ---------- handlers ---------- */
function onPageChange(page) { pushQuery({ page }); }
function onPerPageChange(perPage) { pushQuery({ page: 1, limit: perPage }); }
function openEditcollegeModal(item) { selectedCollege.value = item; showEditModal.value = true; }
function openDetailCollegeModal(item) { selectedCollegeDetail.value = item; showCollegeDetailModal.value = true; }
function closeCollegeModal() { showCollegeModal.value = false; }
function closeCollegeDetailModal() { showCollegeDetailModal.value = false; selectedCollegeDetail.value = null; }
function goToCurriculum(collegeName) { router.push({ path: "/education", query: { college_name: collegeName, page: 1 } }); }

/** ---------- lifecycle ---------- */
watch(
  () => route.fullPath,
  () => {
    syncFromUrl();
    fetchData();
  },
  { immediate: true }
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
