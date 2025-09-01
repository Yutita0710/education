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
          เพิ่มข้อมูลสถาบันการศึกษา
        </button>
      </div>

      <div
        class="overflow-y-auto md:overflow-y-hidden border border-gray-300 rounded-lg"
      >
        <table
          class="w-full border-collapse border border-gray-300 text-sm sm:text-base"
        >
          <thead>
            <tr class="bg-[#E2EDFC]">
              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[40px]"
              >
                กลุ่มสถาบัน
              </th>
              <th
                class="border px-2 py-[0.7rem] font-bold whitespace-nowrap w-[400px]"
              >
                ชื่อสถาบันการศึกษา
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
                สถานะการเผยแพร่
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
          <tbody>
            <tr
              v-for="item in colleges"
              :key="item.id"
              class="hover:bg-gray-50 text-gray-600"
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
                    item.is_published
                      ? 'bg-[#09C97F1A] text-[#09C97F]'
                      : 'bg-[#FB977D1A] text-[#FB977D]'
                  "
                  class="rounded-full px-3 py-1 text-xs readonly font-medium"
                >
                  {{ item.is_published === true ? "เผยแพร่" : "ไม่เผยแพร่" }}
                </span>
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
      :key="selectedCollegeDetail.id"
      :showModal="showCollegeDetailModal"
      :closeModal="closeCollegeDetailModal"
      :collegeId="selectedCollegeDetail.id"
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
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import PaginationBar from "@/components/PaginationBar.vue";
import {
  getCollegesPaginated,
  countCurriculum,
  countryList,
  provinceList,
} from "@/services/apiService";
import SearchCollegeAdmin from "@/components/SearchCollegeAdmin.vue";
import AddCollegeModal from "@/components/AddCollegeModal.vue";
import EditCollegeModal from "@/components/EditCollegeModal.vue";
import DetailCollegeModal from "@/components/DetailCollegeModal.vue";

const route = useRoute();
const router = useRouter();
const showCollegeModal = ref(false);
const showEditModal = ref(false);
const selectedCollege = ref({});
const DEFAULTS = {
  page: 1,
  limit: 10,
  search: "",
  sort: "id",
  order: "ASC",
  province: "",
  country: "",
  is_published: "", // "", "true"|"false"|"1"|"0" ก็จะถูกแปลงต่อภายหลัง
  status: "", // "", "0"|"1"
};

const state = ref({ ...DEFAULTS });

/** helper: แปลงค่าใด ๆ -> boolean | undefined */
function toBoolish(v) {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  if (v === false || v === "false" || v === 0 || v === "0") return false;
  return undefined; // หมายถึง "ไม่กรอง"
}

/** อ่านค่าจาก URL -> state (คงค่า raw ไว้ให้ URL สวย ๆ) */
function fromQuery(q) {
  return {
    page: Number(q.page ?? DEFAULTS.page),
    limit: Number(q.limit ?? DEFAULTS.limit),
    search: String(q.search ?? DEFAULTS.search),

    // ป้องกันสลับค่า: คุมให้อยู่ในโดเมนที่ถูก
    sort: String(q.sort ?? DEFAULTS.sort) || "id",
    order:
      String(q.order ?? DEFAULTS.order).toUpperCase() === "DESC"
        ? "DESC"
        : "ASC",

    province: String(q.province ?? DEFAULTS.province),
    country: String(q.country ?? DEFAULTS.country),

    // เก็บ “raw string” ไว้ใน state เพื่อสะท้อนบน URL เช่นเดิม
    // แต่ตอนยิง API จะไปแปลงเป็น boolean/number อีกที
    is_published: q.is_published !== undefined ? String(q.is_published) : "", // "", "true"|"false"|"1"|"0"
    status: q.status === "0" || q.status === "1" ? q.status : "",
  };
}

/** สร้าง query สำหรับ URL (อย่าทิ้ง false/0) */
function updateRoute(partial, { replace = false } = {}) {
  const next = { ...state.value, ...partial };
  const query = Object.fromEntries(
    Object.entries(next).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );
  replace ? router.replace({ query }) : router.push({ query });
}

/** แปลง state -> พารามิเตอร์ที่จะส่งเข้า API (ชนิดข้อมูลถูกต้อง) */
function toApiParams(s) {
  const out = {
    page: s.page,
    limit: s.limit,
    search: (s.search || "").trim(),
    // คุมไม่ให้สลับกัน
    sort: s.sort || "id",
    order: (s.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC",

    country: s.country || undefined,
    province: s.province || undefined,

    status: s.status === "" ? undefined : Number(s.status), // "0"|"1" -> 0|1
  };

  // is_published -> true/false/undefined
  const b = toBoolish(s.is_published);
  if (b !== undefined) out.is_published = b;

  // ลบค่าว่าง/undefined ออกจาก payload ที่จะส่ง
  return Object.fromEntries(
    Object.entries(out).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null
    )
  );
}

// ---------- fetch ----------
const isLoading = ref(false);
const colleges = ref([]);
const totalItems = ref(0);
const totalPages = ref(1);
async function fetchData() {
  isLoading.value = true;
  try {
    const apiParams = toApiParams(state.value);

    // ✅ ดึง college + curriculum count พร้อมกัน
    const [res, countRes, countryRes, provinceRes] = await Promise.all([
      getCollegesPaginated(apiParams.page, apiParams.limit, apiParams),
      countCurriculum(apiParams),
      countryList(), // ⬅️ ดึงประเทศเพิ่มเข้ามา
      provinceList(), // ⬅️ ดึงจังหวัดเพิ่มเข้ามา
    ]);

    // ---- จัดการ college list ----
    const payload = res?.data ?? {};
    const list = Array.isArray(payload.data) ? payload.data : [];
    const meta = payload.meta ?? {};

    totalItems.value = Number(meta.total) || 0;
    totalPages.value =
      Number(meta.last_page) ||
      Math.max(1, Math.ceil(totalItems.value / (state.value.limit || 10)));

    // ---- จัดการจำนวนหลักสูตร ----
    const countsArr = countRes?.data?.data ?? countRes?.data ?? [];

    /** @type {Record<number, number>} */
    const countsMap = {};
    for (const cur of countsArr) {
      const id = Number(cur.college_id ?? cur.id);
      const cnt = Number(cur.curriculum_count ?? cur.count ?? 0);
      if (Number.isFinite(id)) countsMap[id] = Number.isFinite(cnt) ? cnt : 0;
    }
    // console.log("Counts Map by college_id:", countsMap);
    // ------- Countries -> Map(id -> name) -------
    const countries = (countryRes?.data ?? []).map((c) => ({
      id: String(c.id ?? c.country_id ?? c.code),
      // รองรับหลาย key ของชื่อประเทศ
      name: (
        c.name ??
        c.name_th ??
        c.en_name ??
        c.country_name ??
        c.code ??
        ""
      ).trim(),
    }));
    const countryMap = new Map(countries.map((c) => [c.id, c.name]));
    const resolveCountryName = (v) => {
      if (v === null || v === undefined || v === "") return "";
      const key = String(v).trim();
      return countryMap.get(key) ?? key; // ถ้าไม่ตรง id ใน map ให้แสดงค่าที่มาจาก API ตรง ๆ
    };

    // ------- Provinces -> Map(id -> name) -------
    const provinces = (provinceRes?.data ?? []).map((p) => ({
      id: String(p.id ?? p.province_id),
      // เลือกชื่อไทยก่อน ถ้าไม่มีค่อย fallback อังกฤษ/ชื่อทั่วไป
      name: (p.name_th ?? p.name_en ?? p.province_name ?? p.name ?? "").trim(),
    }));
    const provinceMap = new Map(provinces.map((p) => [p.id, p.name]));

    const resolveProvinceName = (v) => {
      // v อาจเป็น "1" (ไทย -> id เป็น string/number) หรือเป็น free-text (ต่างประเทศ)
      if (v === null || v === undefined || v === "") return "";
      const key = String(v).trim();
      return provinceMap.get(key) ?? key; // ไม่พบ id ใน map → แสดง free-text ตามที่เก็บมา
    };
    // ---- ประกอบรายการสำหรับตาราง (flatten parent + children) ----
    colleges.value = list.map((item) => {
      const idNum = Number(item.id);
      return {
        ...item,
        // ✅ ใช้ id ของแถวนั้นแม่น ๆ
        curriculumCount: Number.isFinite(idNum) ? countsMap[idNum] ?? 0 : 0,
        countryName: resolveCountryName(item.country),
        provinceName: resolveProvinceName(item.province),
      };
    });
  } catch (e) {
    console.error("fetchData error:", e);
    colleges.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  state.value = fromQuery(route.query);
  fetchData();
});

watch(
  () => route.query,
  (q) => {
    state.value = fromQuery(q);
    fetchData(); // ดึงใหม่อัตโนมัติทุกครั้งที่ URL เปลี่ยน
  }
);

// ---------- รับค่าจากลูก (SearchCollegeAdmin.vue) ----------
function onFiltersUpdate(payload) {
  // payload เป็น “raw” (เช่น is_published อาจเป็น true/false หรือ "")
  // เราจะเก็บลง URL แบบ raw ก่อน แล้วค่อยแปลงตอน fetch
  updateRoute({ ...payload }, { replace: true });
}

// ---------- pagination ----------
function onPageChange(newPage) {
  updateRoute({ page: newPage });
}
function onPerPageChange(newLimit) {
  updateRoute({ limit: newLimit, page: 1 });
}

// ---------- modal ----------
function closeEditModal() {
  showEditModal.value = false;
  selectedCollege.value = {};
  fetchData(); // รีโหลดข้อมูลหลังจากแก้ไข
}

function closeCollegeModal() {
  showCollegeModal.value = false;
  fetchData();
} // closeCollegeModal

function openEditcollegeModal(item) {
  console.log("Opening edit modal for:", item);
  selectedCollege.value = { ...item }; // ✅ ใช้ตัวแปรนี้แทน selectedCurriculum
  showEditModal.value = true;
}

// ---------- Detail Modal ----------
const showCollegeDetailModal = ref(false);
const selectedCollegeDetail = ref({});

function openDetailCollegeModal(item) {
  if (!item || !item.id) {
    console.warn("openDetailCollegeModal: item ไม่มี id", item);
    return;
  }
  selectedCollegeDetail.value = { id: item.id };
  showCollegeDetailModal.value = true;
}

function closeCollegeDetailModal() {
  showCollegeDetailModal.value = false;
  selectedCollegeDetail.value = {};
}
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
