<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative overflow-hidden"
      @click.stop
    >
      <!-- HEADER -->
      <div class="flex items-center justify-center bg-white px-6 py-3 relative">
        <h1 class="text-2xl font-bold text-gray-800">แก้ไขข้อมูลหลักสูตร</h1>
        <button
          @click="closeModal"
          class="absolute right-6 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-8"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- BODY -->
      <div class="p-6 overflow-y-auto max-h-[90vh]">
        <form @submit.prevent="updateCurriculum" class="space-y-4">
          <!-- สถาบัน -->
          <div class="mb-4 relative">
            <label class="block font-bold mb-1"
              >ชื่อสถาบัน <span class="text-red-500">*</span></label
            >
            <v-select
              class="font-[15px]"
              v-model="selectedCollege"
              :options="colleges"
              label="name"
              :reduce="(c) => c.id"
              placeholder="กรุณาเลือกสถาบัน..."
              :disabled="isLoading"
              required
            />
          </div>

          <!-- ชื่อหลักสูตร -->
          <div>
            <label class="block font-bold mb-1"
              >ชื่อหลักสูตร <span class="text-red-500">*</span></label
            >
            <v-select
              class="font-[15px]"
              v-model="selectedCurriculum"
              :options="curriculumNameOptions"
              label="name"
              :reduce="(opt) => opt.name"
              :disabled="isLoading || !curriculumNameOptions.length"
              placeholder="กรุณาเลือกชื่อหลักสูตร..."
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4 items-end w-full">
            <!-- หลักสูตร (ชนิด) -->
            <div>
              <label class="block font-bold mb-1"
                >หลักสูตร <span class="text-red-500">*</span></label
              >
              <Listbox
                v-model="selectedCurriculumType"
                as="div"
                class="relative w-full rounded-lg border px-2 py-[0.15rem]"
              >
                <ListboxButton
                  class="relative w-full inline-flex items-center justify-between px-3 py-2"
                >
                  <span class="truncate">{{
                    selectedCurriculumType?.name || "หลักสูตร"
                  }}</span>
                  <ChevronUpDownIcon
                    class="w-5 h-5 text-gray-500"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  class="absolute z-20 mt-2 max-h-60 w-full md:w-[14rem] overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 left-0"
                >
                  <ListboxOption
                    v-for="opt in curriculumType"
                    :key="opt.id"
                    :value="opt"
                    class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                  >
                    <span class="block truncate">{{ opt.name }}</span>
                    <span
                      v-if="selectedCurriculumType?.id === opt.id"
                      class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                    >
                      <CheckIcon class="w-5 h-5" aria-hidden="true" />
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </div>

            <!-- พ.ศ. (สำหรับ description) -->
            <div class="flex flex-row items-center gap-2 w-full">
              <label class="whitespace-nowrap">พ.ศ.</label>
              <v-select
                class="font-[15px] flex-1 min-w-0"
                v-model="selectedCurriculumYear"
                :options="curriculumYearOptions"
                label="name"
                :reduce="(opt) => opt.value"
                :disabled="
                  isLoading ||
                  !(curriculumYearOptions && curriculumYearOptions.length)
                "
                placeholder="กรุณาเลือกปี พ.ศ."
                required
              />
            </div>
          </div>

          <!-- ระดับการศึกษา -->
          <div class="mb-4 relative">
            <label class="block font-bold mb-1"
              >ระดับการศึกษา <span class="text-red-500">*</span></label
            >
            <Listbox
              v-model="selectedDegree"
              as="div"
              class="relative w-full rounded-lg border px-2 py-[0.15rem]"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-2"
              >
                <span class="truncate">{{
                  selectedDegree?.name || "ระดับการศึกษา"
                }}</span>
                <ChevronUpDownIcon
                  class="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                class="absolute z-20 mt-2 max-h-60 w-full md:w-[14rem] overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 left-0"
              >
                <ListboxOption
                  v-for="degree in filteredDegrees"
                  :key="degree.id"
                  :value="degree"
                  class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                >
                  <span class="block truncate">{{ degree.name }}</span>
                  <span
                    v-if="selectedDegree?.id === degree.id"
                    class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                  >
                    <CheckIcon class="w-5 h-5" aria-hidden="true" />
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </Listbox>
          </div>

          <!-- หลักสูตรสำหรับ -->
          <div>
            <label class="block font-bold mb-1"
              >หลักสูตรสำหรับ <span class="text-red-500">*</span></label
            >
            <ul class="flex flex-row gap-1 w-full">
              <li v-for="opt in typeOptions" :key="opt.id" class="w-full">
                <label
                  :for="`type-${opt.id}`"
                  class="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded"
                >
                  <input
                    :id="`type-${opt.id}`"
                    type="checkbox"
                    :value="opt.id"
                    v-model="selectedTypes"
                    @change="onTypeChange(opt.id)"
                    :ref="
                      opt.name === 'สมาชิกทุกประเภท' ? setSelectAllRef : null
                    "
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm">
                    {{ opt.name }}
                    <span
                      v-if="opt.name === 'สมาชิกทุกประเภท'"
                      class="text-xs text-gray-500"
                      >(เลือกทั้งหมด)</span
                    >
                  </span>
                </label>
              </li>
            </ul>
            <p v-if="!selectedTypes.length" class="mt-1 text-xs text-red-600">
              เลือกได้มากกว่า 1 หลักสูตร
            </p>
          </div>

          <!-- รายละเอียด -->
          <div>
            <label class="block font-bold mb-1">รายละเอียด</label>
            <textarea
              v-model="form.remark"
              rows="2"
              class="w-full border px-4 py-2 rounded-xl resize-none"
            ></textarea>
          </div>

          <!-- มติ/วันที่ -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="block font-bold mb-1"
                >มติการประชุมครั้งที่ <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.meeting_no"
                type="text"
                class="w-full border px-4 py-2 rounded-xl"
                placeholder="เช่น 1/2568"
                required
              />
            </div>
            <div>
              <label class="block font-bold mb-1"
                >วันที่ประชุม <span class="text-red-500">*</span></label
              >
              <VueDatePicker
                v-model="meetingDate"
                :format="formatToThai"
                :enable-time="false"
                :auto-apply="true"
                :locale="'th'"
                placeholder="เลือกวันที่ (วัน/เดือน/ปี พ.ศ.)"
              />
            </div>
          </div>

          <!-- ปีเริ่ม/สิ้นสุด + สถานะ -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="block font-bold mb-1"
                >ปีเริ่มต้น (พ.ศ.) <span class="text-red-500">*</span></label
              >
              <v-select
                class="font-[15px] flex-1 min-w-0"
                v-model="selectedStartYear"
                :options="startYearOptions"
                label="name"
                :reduce="(opt) => opt.value"
                :disabled="
                  isLoading || !(startYearOptions && startYearOptions.length)
                "
                placeholder="กรุณาเลือกปี พ.ศ."
                required
              />
            </div>

            <div>
              <label class="block font-bold mb-1"
                >ปีสิ้นสุด (พ.ศ.) <span class="text-red-500">*</span></label
              >
              <v-select
                class="font-[15px] flex-1 min-w-0"
                v-model="selectedEndYear"
                :options="endYearOptions"
                label="name"
                :reduce="(opt) => opt.value"
                :disabled="
                  isLoading || !(endYearOptions && endYearOptions.length)
                "
                placeholder="กรุณาเลือกปี พ.ศ."
                required
              />
            </div>

            <div>
              <label for="ispublic" class="block mb-2 font-medium text-gray-900"
                >สถานะการเผยแพร่</label
              >
              <Listbox
                v-model="selectedIspublic"
                as="div"
                class="relative w-full rounded-lg border px-2 py-[0.15rem]"
              >
                <ListboxButton
                  class="relative w-full inline-flex items-center justify-between px-3 py-2"
                >
                  <span class="truncate">{{
                    selectedIspublic?.name || "สถานะการเผยแพร่"
                  }}</span>
                  <ChevronUpDownIcon
                    class="w-5 h-5 text-gray-500"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  class="absolute z-20 mt-2 max-h-60 w-full md:w-[14rem] overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 left-0"
                >
                  <ListboxOption
                    v-for="opt in ispublicOptions"
                    :key="opt.id"
                    :value="opt"
                    class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                  >
                    <span class="block truncate">{{ opt.name }}</span>
                    <span
                      v-if="selectedIspublic?.id === opt.id"
                      class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                    >
                      <CheckIcon class="w-5 h-5" aria-hidden="true" />
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </div>

            <div>
              <label for="status" class="block mb-2 font-medium text-gray-900"
                >สถานะการใช้งาน</label
              >
              <Listbox
                v-model="selectedStatus"
                as="div"
                class="relative w-full rounded-lg border px-2 py-[0.15rem]"
              >
                <ListboxButton
                  class="relative w-full inline-flex items-center justify-between px-3 py-2"
                >
                  <span class="truncate">{{
                    selectedStatus?.name || "สถานะการใช้งาน"
                  }}</span>
                  <ChevronUpDownIcon
                    class="w-5 h-5 text-gray-500"
                    aria-hidden="true"
                  />
                </ListboxButton>
                <ListboxOptions
                  class="absolute z-20 mt-2 max-h-60 w-full md:w-[14rem] overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 left-0"
                >
                  <ListboxOption
                    v-for="s in statusOptions"
                    :key="s.id"
                    :value="s"
                    class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                  >
                    <span class="block truncate">{{ s.name }}</span>
                    <span
                      v-if="selectedStatus?.id === s.id"
                      class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                    >
                      <CheckIcon class="w-5 h-5" aria-hidden="true" />
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </div>
          </div>

          <!-- ปุ่ม -->
          <div class="flex justify-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-[#0085DB] hover:bg-[#0085DB] text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              <span v-if="!isLoading" class="flex items-center">บันทึก</span>
              <span v-else class="flex items-center">บันทึก...</span>
            </button>
            <button
              type="button"
              @click="closeModal"
              class="bg-[#F95668] hover:bg-[#F95668]/80 text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
/* =========================
 * Imports
 * ========================= */
import { computed, reactive, ref, watch } from "vue";
import Swal from "sweetalert2";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

import {
  updateEducation,
  getallYears,
  getCollegesPaginated,
  getCurriculumsListAll,
  getDegrees,
  getTypes,
} from "@/services/apiService";

/* =========================
 * Props / Emits
 * ========================= */
const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, required: true },
  curriculum: { type: Object, default: null }, // ข้อมูลเดิม
});
const emit = defineEmits(["refresh-data"]);

/* =========================
 * Constants
 * ========================= */
const STATUS_OPTIONS = [
  { id: 1, name: "ใช้งาน" },
  { id: 0, name: "ไม่ใช้งาน" },
];
const ISPUBLIC_OPTIONS = [
  { id: 1, value: true, name: "เผยแพร่" },
  { id: 0, value: false, name: "ไม่เผยแพร่" },
];
const curriculumType = [
  { id: 1, name: "หลักสูตร" },
  { id: 2, name: "หลักสูตรใหม่" },
  { id: 3, name: "หลักสูตรปรับปรุง" },
];

/* =========================
 * State
 * ========================= */
const isLoading = ref(false);
const search = ref("");

const selectedCollege = ref(null);
const selectedDegree = ref(null);
const selectedCurriculum = ref(null);
const selectedCurriculumType = ref(null);
const meetingDate = ref(null);

const selectedStatus = ref(STATUS_OPTIONS[0]);
const selectedIspublic = ref(ISPUBLIC_OPTIONS[0]);

const colleges = ref([]);
const degrees = ref([]);
const filteredDegrees = ref([]);

const selectedStartYear = ref(null);
const startYearOptions = ref([]);

const selectedEndYear = ref(null);
const endYearOptions = ref([]);

const selectedCurriculumYear = ref(null);
const curriculumYearOptions = ref([]);

const curriculumNameOptions = ref([]);

const typeOptions = ref([]);
const selectedTypes = ref([]);
const selectAllRef = ref(null);
const setSelectAllRef = (el) => (selectAllRef.value = el);

const form = reactive({
  name: "",
  description: "",
  degree_id: "",
  start_year: "",
  end_year: "",
  college_id: "",
  active: 1,
  remark: "",
  meeting_no: "",
});

/* =========================
 * Computed (types)
 * ========================= */
const allTypeId = computed(
  () =>
    (typeOptions.value || []).find((t) => t.name === "สมาชิกทุกประเภท")?.id ??
    null
);
const realTypeIds = computed(() =>
  (typeOptions.value || [])
    .filter((t) => t.name !== "สมาชิกทุกประเภท")
    .map((t) => t.id)
);

// ส่งให้ BE: ถ้าเลือก "สมาชิกทุกประเภท" → ส่งแค่ [allId] ไม่งั้นส่งตามที่เลือก
const payloadTypeIds = computed(() => {
  const allId = allTypeId.value;
  const sel = selectedTypes.value || [];
  if (!Array.isArray(sel) || sel.length === 0) return [];
  if (allId != null && sel.includes(allId)) return [allId];
  return Array.from(new Set(sel.map(Number)));
});

/* =========================
 * Helpers
 * ========================= */
const formatToThai = (date) =>
  date ? dayjs(date).add(543, "year").format("DD/MM/YYYY") : "";

function buildAutoDescription() {
  const typeName = selectedCurriculumType.value?.name?.toString().trim() || "";
  const yearBE = Number.isFinite(selectedCurriculumYear.value)
    ? String(selectedCurriculumYear.value)
    : "";
  if (typeName && yearBE) return `${typeName} พ.ศ.${yearBE}`;
  if (typeName) return typeName;
  if (yearBE) return `พ.ศ.${yearBE}`;
  return "";
}

function applyIncomingTypes(incoming) {
  const allId = allTypeId.value;
  const allReal = realTypeIds.value;
  const known = new Set(allId != null ? [allId, ...allReal] : allReal);

  if (!Array.isArray(incoming)) incoming = [];
  incoming = incoming
    .map(Number)
    .filter((n) => Number.isFinite(n) && known.has(n));

  if (allId != null && incoming.includes(allId)) {
    selectedTypes.value = [allId, ...allReal];
    return;
  }
  const hasAllReal =
    allReal.length > 0 && allReal.every((id) => incoming.includes(id));
  selectedTypes.value =
    hasAllReal && allId != null ? [allId, ...allReal] : incoming;
}

function parseTypeYearFromDescription(desc) {
  // รูปแบบคาดหวัง: "<ชื่อชนิด> พ.ศ.<ปี4หลัก>"
  if (!desc || typeof desc !== "string") return { typeName: "", yearBE: null };
  const m = desc.match(/^\s*(.*?)\s*พ\.ศ\.\s*(\d{4})\s*$/);
  if (!m) {
    // ไม่เจอ "พ.ศ." ก็พยายามเดาปีท้ายสตริง
    const m2 = desc.match(/^\s*(.*?)\s*(\d{4})\s*$/);
    if (!m2) return { typeName: desc.trim(), yearBE: null };
    const y = parseInt(m2[2], 10);
    return { typeName: m2[1].trim(), yearBE: Number.isFinite(y) ? y : null };
  }
  const y = parseInt(m[2], 10);
  return { typeName: m[1].trim(), yearBE: Number.isFinite(y) ? y : null };
}

function ensureYearOption(year) {
  if (!Number.isFinite(year)) return;
  const exists = curriculumYearOptions.value.some((o) => o.value === year);
  if (!exists) {
    const opt = { name: String(year), value: year };
    // ใส่ไว้ทั้ง 3 ชุดเพื่อให้เอกภาพ
    curriculumYearOptions.value = [opt, ...curriculumYearOptions.value].sort(
      (a, b) => b.value - a.value
    );
    startYearOptions.value = [opt, ...startYearOptions.value].sort(
      (a, b) => b.value - a.value
    );
    // endYearOptions จะถูก sync ตาม start อยู่แล้ว แต่เผื่อกรณีไม่มี start ก็เพิ่มไว้ก่อน
    endYearOptions.value = [opt, ...endYearOptions.value].sort(
      (a, b) => b.value - a.value
    );
  }
}

function parseTypeTextToIds(text) {
  if (typeof text !== "string") return [];
  return text
    .split(/[,\uFF0C\u3001\s]+/) // คอมมา, คอมมาแบบฟูลวิธ, เครื่องหมายจุลภาคญี่ปุ่น, เว้นวรรค
    .map((s) => parseInt(s, 10))
    .filter(Number.isFinite);
}
/* =========================
 * Data fetchers
 * ========================= */
async function fetchStartYears() {
  const res = await getallYears();
  const apiYears = Array.isArray(res?.data?.startYears)
    ? res.data.startYears
    : [];
  const nums = [...new Set(apiYears.map((y) => Number(y)))].filter(
    (y) => Number.isFinite(y) && y >= 2400 && y <= 2699
  );

  const currentBE = dayjs().year() + 543;
  const minBE = nums.length ? Math.min(...nums) : 2400;

  const range = Array.from(
    { length: currentBE - minBE + 1 },
    (_, i) => currentBE - i
  ).map((y) => ({ name: String(y), value: y }));

  startYearOptions.value = range;
  curriculumYearOptions.value = [...range];
  endYearOptions.value = [...range]; // เบื้องต้นทั้งหมด แล้วค่อยกรองตาม start
}

function syncEndYearOptionsByStart(startVal) {
  if (!Number.isFinite(startVal)) {
    endYearOptions.value = [...startYearOptions.value];
    return;
  }
  endYearOptions.value = startYearOptions.value.filter(
    (o) => o.value >= startVal
  );

  if (
    Number.isFinite(selectedEndYear.value) &&
    selectedEndYear.value < startVal
  ) {
    selectedEndYear.value = startVal;
  }
}

async function fetchTypes() {
  const res = await getTypes();
  const raw = res?.data?.data ?? [];
  typeOptions.value = raw
    .filter((t) => Number(t.active) === 1)
    .map((t) => ({ id: t.id, name: t.type_name }));
}

async function fetchCurriculumNames() {
  const res = await getCurriculumsListAll();
  const names = Array.isArray(res?.data?.data?.name) ? res.data.data.name : [];
  curriculumNameOptions.value = names
    .filter(Boolean)
    .map((n) => ({ name: String(n).trim() }));
}

async function fetchDegrees() {
  const res = await getDegrees();
  degrees.value = res?.data?.data || [];
  filteredDegrees.value = [...degrees.value];
}

async function fetchColleges() {
  const params = { sort: "id", order: "ASC", search: search.value.trim() };
  const res = await getCollegesPaginated(params);
  colleges.value = res?.data?.data || [];
}

/* =========================
 * Watchers (sync form)
 * ========================= */
watch(selectedCollege, (val) => (form.college_id = val || ""));
watch(selectedDegree, (val) => (form.degree_id = val?.id || ""));

// ไม่ +4 อัตโนมัติอีกต่อไป — ใช้ selectedStartYear/selectedEndYear คุม
watch(selectedStartYear, (y) => {
  const n = Number(y);
  form.start_year = Number.isFinite(n) ? String(n) : "";
  syncEndYearOptionsByStart(Number.isFinite(n) ? n : null);
});

watch(selectedEndYear, (y) => {
  const n = Number(y);
  form.end_year = Number.isFinite(n) ? String(n) : "";
});

// บังคับ end ≥ start เสมอ
watch(
  () => form.end_year,
  (newEnd) => {
    const s = parseInt(form.start_year);
    const e = parseInt(newEnd);
    if (Number.isFinite(s) && Number.isFinite(e) && e < s) {
      form.end_year = String(s);
      selectedEndYear.value = s;
    }
  }
);

watch(selectedCurriculum, (val) => (form.name = val ? String(val).trim() : ""));
watch([selectedCurriculumType, selectedCurriculumYear], () => {
  form.description = buildAutoDescription();
});

watch([selectedCurriculumType, selectedCurriculumYear], () => {
  form.description = buildAutoDescription();
});

/* =========================
 * Types UI: select-all/indeterminate
 * ========================= */
function onTypeChange(changedId) {
  const allId = allTypeId.value;
  if (allId == null) return;

  if (changedId === allId) {
    const checked = selectedTypes.value.includes(allId);
    selectedTypes.value = checked ? [allId, ...realTypeIds.value] : [];
  } else {
    selectedTypes.value = selectedTypes.value.filter((id) => id !== allId);
    const sel = new Set(selectedTypes.value);
    const selectedRealCount = realTypeIds.value.filter((id) =>
      sel.has(id)
    ).length;
    if (selectedRealCount === realTypeIds.value.length) {
      selectedTypes.value = [allId, ...realTypeIds.value];
    }
  }
}

watch(
  [selectedTypes, realTypeIds, allTypeId],
  () => {
    if (!selectAllRef.value || allTypeId.value == null) return;
    const sel = new Set(selectedTypes.value);
    const selectedRealCount = realTypeIds.value.filter((id) =>
      sel.has(id)
    ).length;
    const allReal = realTypeIds.value.length;
    selectAllRef.value.indeterminate =
      selectedRealCount > 0 && selectedRealCount < allReal;
  },
  { deep: true }
);

/* =========================
 * Populate on open
 * ========================= */
watch(
  () => props.showModal,
  async (open) => {
    if (!open) return;
    isLoading.value = true;
    try {
      await Promise.all([
        fetchDegrees(),
        fetchColleges(),
        fetchStartYears(),
        fetchTypes(),
        fetchCurriculumNames(),
      ]);

      const c = props.curriculum ?? {};

      // ปีเริ่ม/สิ้นสุด
      selectedStartYear.value = Number(c.start_year) || null;
      syncEndYearOptionsByStart(selectedStartYear.value);
      selectedEndYear.value =
        Number(c.end_year) || selectedStartYear.value || null;
      form.start_year = selectedStartYear.value
        ? String(selectedStartYear.value)
        : "";
      form.end_year = selectedEndYear.value
        ? String(selectedEndYear.value)
        : "";

      // สถาบัน/ระดับ/ชื่อหลักสูตร
      selectedCollege.value = c.college_id ?? c.college?.id ?? null;

      const degreeId = c.degree_id ?? c.degree?.id ?? null;
      selectedDegree.value =
        degrees.value.find((d) => d.id === degreeId) ?? null;

      selectedCurriculum.value = c.name || null;

      // สถานะ
      selectedIspublic.value =
        ISPUBLIC_OPTIONS.find(
          (x) => x.value === Boolean(c.is_curriculum_published)
        ) ?? ISPUBLIC_OPTIONS[0];
      selectedStatus.value =
        STATUS_OPTIONS.find((x) => x.id === Number(c.active)) ??
        STATUS_OPTIONS[0];

      // ฟิลด์อื่น
      form.name = c.name || "";

      const { typeName, yearBE } = parseTypeYearFromDescription(
        c.description || ""
      );
      if (typeName) {
        // match กับรายการชนิดที่มีอยู่
        selectedCurriculumType.value =
          curriculumType.find((x) => x.name === typeName) || null;
      }
      if (Number.isFinite(yearBE)) {
        ensureYearOption(yearBE);
        selectedCurriculumYear.value = yearBE; // v-select ใช้ตัวเลข (reduce -> value)
      }

      form.description = c.description || buildAutoDescription();

      form.active = Number.isFinite(+c.active) ? +c.active : 1;
      form.remark = c.remark || "";
      form.meeting_no = c.meeting_resolution || c.meeting_no || "";
      meetingDate.value = c.meeting_date
        ? dayjs(c.meeting_date).toDate()
        : null;

      // ประเภท (type_ids)
      const incoming =
        typeof c.type === "string" && c.type.trim().length
          ? parseTypeTextToIds(c.type)
          : Array.isArray(c.type_ids)
          ? c.type_ids
          : c.types?.map((t) => t.id) ?? [];
      applyIncomingTypes(incoming);
      applyIncomingTypes(incoming);
    } finally {
      isLoading.value = false;
    }
  }
);

const payloadTypeText = computed(() => {
  const allId = allTypeId.value;
  const real = realTypeIds.value;
  const sel = (selectedTypes.value || []).map(Number).filter(Number.isFinite);

  if (!sel.length) return "";

  const hasAll = allId != null && sel.includes(allId);
  const allRealSelected = real.length && real.every((id) => sel.includes(id));

  // ถ้าเลือก "สมาชิกทุกประเภท" หรือเลือกครบทุกย่อย → เก็บเฉพาะย่อยทั้งหมด (ไม่ใส่ allId)
  const ids =
    hasAll || allRealSelected ? real : sel.filter((id) => id !== allId);

  return Array.from(new Set(ids))
    .sort((a, b) => a - b)
    .join(",");
});
/* =========================
 * Submit (Update)
 * ========================= */
async function updateCurriculum() {
  // validate หลักๆ
  if (!form.name?.trim())
    return Swal.fire({ icon: "warning", title: "กรุณาเลือกชื่อหลักสูตร" });
  if (!form.college_id)
    return Swal.fire({ icon: "warning", title: "กรุณาเลือกชื่อสถาบัน" });
  if (!form.degree_id)
    return Swal.fire({ icon: "warning", title: "กรุณาเลือกระดับการศึกษา" });
  if (!form.start_year)
    return Swal.fire({ icon: "warning", title: "กรุณาเลือกปีเริ่มต้น (พ.ศ.)" });
  if (!selectedTypes.value.length)
    return Swal.fire({
      icon: "warning",
      title: "กรุณาเลือก 'หลักสูตรสำหรับ' อย่างน้อย 1 รายการ",
    });
  if (!form.meeting_no?.trim())
    return Swal.fire({ icon: "warning", title: "กรุณากรอกมติการประชุม" });
  if (!meetingDate.value)
    return Swal.fire({ icon: "warning", title: "กรุณาเลือกวันที่ประชุม" });

  const start = parseInt(form.start_year);
  const end = parseInt(form.end_year);
  if (Number.isFinite(start) && Number.isFinite(end) && end < start)
    return Swal.fire({
      icon: "warning",
      title: "ปีสิ้นสุดต้องไม่น้อยกว่าปีเริ่มต้น",
    });

  isLoading.value = true;
  try {
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || buildAutoDescription(),
      degree_id: Number(form.degree_id),
      start_year: String(form.start_year),
      end_year: String(form.end_year),
      college_id: Number(form.college_id),
      active: Number(selectedStatus.value?.id ?? form.active),
      remark: form.remark ?? "",
      meeting_resolution: form.meeting_no ?? "",
      is_curriculum_published: Boolean(selectedIspublic.value?.value),
      type: payloadTypeText.value,
      meeting_date: dayjs(meetingDate.value).format("YYYY-MM-DD"),
    };

    await updateEducation(props.curriculum.id, payload);

    await Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    // emit("refresh-data");
    emit("refresh-data", {
      id: props.curriculum.id,
      atch: payload, // หรือผลลัพธ์จริงจาก API ถ้า API ส่ง record กลับมา
    });
    props.closeModal();
  } catch (err) {
    console.error("updateCurriculum error:", err?.response?.data || err);
    const status =
      err?.response?.status ?? err?.response?.data?.statusCode ?? null;
    const rawMessage = err?.response?.data?.message ?? err?.message;
    const messageText = Array.isArray(rawMessage)
      ? rawMessage.join("\n")
      : String(rawMessage || "");
    if (status === 400) {
      await Swal.fire({
        icon: "warning",
        title: "บันทึกไม่สำเร็จ",
        text: messageText || "กรุณาตรวจสอบข้อมูล",
      });
    } else {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: messageText || "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
