<template>
  <div class="relative text-[#111C2D]/80">
    <!-- Header -->
    <header
      class="bg-custom-gradient px-4 py-10 rounded-2xl mb-8 md:mb-20 flex flex-col items-center text-center shadow-md md:h-[21rem] z-10"
    >
      <img
        class="mx-auto h-20 md:h-28 mt-2"
        src="../assets/img/tfac.ico"
        alt=""
      />
      <h1
        class="text-[#111C2D]/80 text-lg md:text-3xl font-bold drop-shadow-sm mt-4"
      >
        หลักสูตรที่ผ่านการรับรองจากสภาวิชาชีพบัญชี
      </h1>
    </header>

    <!-- Filter Section -->
    <div
      class="bg-white rounded-[1.4rem] border shadow-lg px-4 py-4 md:px-6 md:py-5 w-full h-auto md:-mt-[8rem] md:w-[90%] mt-0 mx-auto text-[#111C2D]/80"
    >
      <!-- <div
      class="bg-white rounded-[1.4rem] border shadow-lg px-4 py-4 md:px-6 md:py-5 w-full h-auto md:w-[90%] mt-0 mx-auto text-[#111C2D]/80"
    > -->
      <div class="">
        <div class="order-1 w-full min-w-0">
          <div
            class="relative w-full rounded-lg border flex items-center px-3 py-[0.7rem] space-x-2"
          >
            <svg
              class="w-5 h-5 text-gray-400 flex-shrink-0"
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
            <input
              v-model="search"
              type="text"
              placeholder="ค้นหาชื่อสถาบัน/ชื่อหลักสูตร/หลักสูตร"
              class="flex-1 min-w-0 bg-transparent placeholder-gray-400 text-gray-900 outline-none"
            />
          </div>
        </div>
        <div class="order-2 w-full min-w-0 mt-3">
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-center mb-3"
          >
            <Listbox
              v-model="selected"
              as="div"
              class="relative w-full rounded-lg border"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-[0.7rem]"
              >
                <span class="truncate">{{
                  selected?.name || "แสดงระดับการศึกษาทั้งหมด"
                }}</span>
                <ChevronUpDownIcon
                  class="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                />
              </ListboxButton>

              <ListboxOptions
                class="absolute z-20 mt-2 max-h-60 w-full md:w-[18rem] overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 left-0"
              >
                <ListboxOption
                  v-for="degree in degrees"
                  :key="degree.id"
                  :value="degree"
                  class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                >
                  <span class="block truncate">{{ degree.name }}</span>
                  <span
                    v-if="selected?.id === degree.id && selected.id !== ''"
                    class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                  >
                    <CheckIcon class="w-5 h-5" aria-hidden="true" />
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </Listbox>
            <v-select
              v-model="selectedStartYear"
              :options="startyears"
              label="name"
              :searchable="true"
              :clearable="false"
              placeholder="แสดงปีที่เริ่มต้นทั้งหมด"
            />
            <v-select
              v-model="selectedEndYear"
              :options="endyears"
              label="name"
              :searchable="true"
              :clearable="false"
              placeholder="แสดงปีที่สิ้นสุดทั้งหมด"
              :disabled="loadingYears"
            />
            <Listbox
              v-model="curriculum_published"
              as="div"
              class="relative w-full rounded-lg border"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-[0.7rem]"
              >
                <span class="truncate">{{
                  curriculum_published?.name || "สถานะการเผยแพร่"
                }}</span>
                <ChevronUpDownIcon
                  class="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                class="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 left-0"
              >
                <ListboxOption
                  v-for="item in published"
                  :key="String(item.id)"
                  :value="item"
                  class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                >
                  <span class="block truncate">{{ item.name }}</span>
                  <span
                    v-if="curriculum_published?.id === item.id"
                    class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                  >
                    <CheckIcon class="w-5 h-5" aria-hidden="true" />
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </Listbox>
            <Listbox
              v-model="status"
              as="div"
              class="relative w-full rounded-lg border"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-[0.7rem]"
              >
                <span class="truncate">{{
                  status?.name || "สถานะการใช้งาน"
                }}</span>
                <ChevronUpDownIcon
                  class="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                class="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 left-0"
              >
                <ListboxOption
                  v-for="item in status_curriculum"
                  :key="String(item.id)"
                  :value="item"
                  class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                >
                  <span class="block truncate">{{ item.name }}</span>
                  <span
                    v-if="status?.id === item.id"
                    class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                  >
                    <CheckIcon class="w-5 h-5" aria-hidden="true" />
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </Listbox>
          </div>
          <div class="flex justify-center">
            <button
              @click="reset"
              class="shrink-0 bg-[#F8B15D] hover:bg-[#FE7743] text-white px-6 py-3 rounded-full shadow font-medium inline-flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="size-5"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  d="M20 8c-1.403-2.96-4.463-5-8-5a9 9 0 1 0 0 18a9 9 0 0 0 9-9m0-9v6h-6"
                />
              </svg>
              ล้างค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { getallYears, getDegrees } from "@/services/apiService";
import { useRouter, useRoute } from "vue-router";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/vue/24/solid";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const emit = defineEmits(["onSearch", "clear"]);
const router = useRouter();
const route = useRoute();

const hydrated = ref(false);

const search = ref("");

// ===== ปี พ.ศ. จาก API =====
const START_DEFAULT = { id: "", name: "แสดงปีที่เริ่มต้นทั้งหมด" };
const END_DEFAULT = { id: "", name: "แสดงปีที่สิ้นสุดทั้งหมด" };

const loadingYears = ref(false);
const yearsError = ref("");

const startYearList = ref([]); // number[]
const endYearList = ref([]); // number[]

const toOptions = (years) =>
  years.map((be) => ({ id: Number(be), name: String(be) }));
const only4digits = (y) =>
  typeof y === "number" && Number.isFinite(y) && y.toString().length === 4;

const selectedStartYear = ref(START_DEFAULT);
const selectedEndYear = ref(END_DEFAULT);

async function fetchYears() {
  loadingYears.value = true;
  yearsError.value = "";
  try {
    const { data } = await getallYears();
    const payload = data?.data ?? data ?? {};
    const start = Array.isArray(payload.startYears) ? payload.startYears : [];
    const end = Array.isArray(payload.endYears) ? payload.endYears : [];

    startYearList.value = start.filter(only4digits).sort((a, b) => b - a);
    endYearList.value = end.filter(only4digits).sort((a, b) => b - a);

    // options เปลี่ยน -> ใช้ placeholder "อ็อบเจ็กต์เดิม"
    selectedStartYear.value = START_DEFAULT;
    selectedEndYear.value = END_DEFAULT;
  } catch (e) {
    yearsError.value = e?.message || "โหลดปีไม่สำเร็จ";
  } finally {
    loadingYears.value = false;
  }
}

const startyears = computed(() => {
  const sorted = [...startYearList.value].sort((a, b) => b - a); // มาก -> น้อย
  return [START_DEFAULT, ...toOptions(sorted)];
});

const endyears = computed(() => {
  const fromBE =
    selectedStartYear.value?.id === ""
      ? null
      : Number(selectedStartYear.value.id);

  const filtered =
    fromBE == null
      ? endYearList.value
      : endYearList.value.filter((y) => y >= fromBE);

  const sorted = [...filtered].sort((a, b) => b - a); // มาก -> น้อย
  return [END_DEFAULT, ...toOptions(sorted)];
});

// ถ้า start > end -> reset end
watch(selectedStartYear, (nv) => {
  const s = nv?.id === "" ? null : Number(nv.id);
  const e =
    selectedEndYear.value?.id === "" ? null : Number(selectedEndYear.value.id);
  if (s != null && e != null && e < s) selectedEndYear.value = END_DEFAULT;
});

// ===== helpers =====
function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) && String(v ?? "").trim() !== "" ? n : null;
}

// ---------- ตัวกรองอื่น ----------
const degrees = ref([]);
const selected = ref(null);

const curriculum_published = ref(null); // { id: boolean|null, name: string } | null
const status = ref(null); // { id: boolean|null, name: string } | null

const published = [
  { id: true, name: "เผยแพร่" },
  { id: false, name: "ไม่เผยแพร่" },
];

const status_curriculum = [
  { id: "1", name: "ใช้งาน" },
  { id: "0", name: "ไม่ใช้งาน" },
];

// ยิงค้นหา
function emitSearch() {
  emit("onSearch", {
    type: selected.value?.id ?? "",
    search: (search.value || "").trim(),
    startYear: selectedStartYear.value?.id ?? "",
    endYear: selectedEndYear.value?.id ?? "",
    curriculum_published:
      curriculum_published.value?.id === null
        ? ""
        : String(curriculum_published.value?.id),
    curriculum_active:
      status.value?.id === null ? "" : String(status.value?.id),
  });
}

// debounce ช่องค้นหา
let typingTimer = null;
watch(
  () => search.value,
  () => {
    if (!hydrated.value) return;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(emitSearch, 300);
  }
);

// เปลี่ยนตัวกรองอื่น ๆ ให้ยิงทันที
watch(
  [selected, selectedStartYear, selectedEndYear, curriculum_published, status],
  () => {
    if (!hydrated.value) return;
    emitSearch();
  }
);

// โหลด degree + map จาก URL (?type=)
async function fetchDegrees() {
  try {
    const res = await getDegrees();
    const data = res.data?.data || [];
    const customOrder = [6, 5, 4];
    degrees.value = data.sort((a, b) => {
      const ia = customOrder.indexOf(a.id);
      const ib = customOrder.indexOf(b.id);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.id - b.id;
    });

    const typeFromUrl = safeNum(route.query.type);
    if (typeFromUrl != null) {
      const found = degrees.value.find((d) => d.id === typeFromUrl);
      if (found) selected.value = found;
    }
  } catch (err) {
    console.error("Error fetching degrees:", err);
  }
}

// เติมค่าจาก URL (เรียกหลัง options พร้อมแล้ว)
function prefillFromUrl() {
  if (route.query.collegeId) {
    search.value = decodeURIComponent(String(route.query.collegeId));
  } else {
    search.value = String(route.query.search ?? "");
  }

  const sy = safeNum(route.query.startYear ?? route.query.start_year);
  const ey = safeNum(route.query.endYear ?? route.query.end_year);

  if (sy != null) {
    const opt = startyears.value.find((o) => Number(o.id) === sy);
    if (opt) selectedStartYear.value = opt;
  }
  if (ey != null) {
    const opt = endyears.value.find((o) => Number(o.id) === ey);
    if (opt) selectedEndYear.value = opt;
  }

  if (typeof route.query.curriculum_published !== "undefined") {
    const qv = String(route.query.curriculum_published).trim().toLowerCase();
    if (qv === "true" || qv === "false") {
      const boolVal = qv === "true";
      const opt = published.find((p) => p.id === boolVal);
      if (opt) curriculum_published.value = opt;
    } else {
      curriculum_published.value = null;
    }
  }

  // ✅ เติม “สถานะหลักสูตร” จาก URL ('1' / '0')
  if (typeof route.query.curriculum_active !== "undefined") {
    const qa = String(route.query.curriculum_active);
    const opt = status_curriculum.find((s) => String(s.id) === qa);
    status.value = opt ?? null;
  }
}

// ล้างค่า
function reset() {
  // เคลียร์ค่าบนฟอร์ม
  hydrated.value = false;
  search.value = "";
  selected.value = null;
  selectedStartYear.value = START_DEFAULT;
  selectedEndYear.value = END_DEFAULT;
  curriculum_published.value = null;
  status.value = null;

  // ✅ แจ้งพาเรนต์ให้รีเซ็ต state fetch เอง
  emit("clear");
  nextTick(() => {
    hydrated.value = true;
  });
}

defineExpose({ reset });

// lifecycle — โหลดปีก่อน -> degree -> เติม URL -> ยิงค้นหา
onMounted(async () => {
  await fetchYears();
  await fetchDegrees();
  prefillFromUrl();
  hydrated.value = true;
});
</script>

