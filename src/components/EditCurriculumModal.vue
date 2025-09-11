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
              label="label"
              :reduce="(c) => c.id"
              placeholder="กรุณาเลือกสถาบัน..."
              :disabled="isLoading"
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
                :input-id="'curriculum-year'"
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
            <div class="flex flex-row gap-2 items-center">
              <div>
                <label class="block font-bold mb-1">
                  หลักสูตรสำหรับ
                  <span class="text-red-500">*</span>
                </label>
              </div>
              <div class="mb-2">
                <p
                  v-if="!selectedTypes.length"
                  class="mt-1 text-xs text-red-600"
                >
                  เลือกได้มากกว่า 1 ประเภท
                </p>
              </div>
            </div>
            <ul v-if="typeOptions.length" class="flex flex-row gap-1 w-full">
              <li v-for="opt in typeOptions" :key="opt.id" class="w-full">
                <label
                  :for="`type-${opt.id}`"
                  class="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded"
                >
                  <input
                    :id="`type-${opt.id}`"
                    type="checkbox"
                    :value="Number(opt.id)"
                    v-model="selectedTypes"
                    @change="onTypeChange(opt.id)"
                    :ref="opt.name === ALL_LABEL ? setSelectAllRef : null"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm">
                    {{ opt.name }}
                    <span
                      v-if="opt.name === ALL_LABEL"
                      class="text-xs text-gray-500"
                      >(เลือกทั้งหมด)</span
                    >
                  </span>
                </label>
              </li>
            </ul>
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
              />
            </div>
            <div>
              <label class="block font-bold mb-1"
                >วันที่ประชุม <span class="text-red-500">*</span></label
              >
              <VueDatePicker
                v-model="meetingDate"
                :format="formatToThai"
                :enable-time-picker="false"
                :auto-apply="true"
                :max-date="endOfToday"
                :locale="'th'"
                placeholder="เลือกวันที่ (วัน/เดือน/ปี พ.ศ.)"
              />
            </div>
          </div>

          <!-- ปีเริ่ม/สิ้นสุด + สถานะ -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="block font-bold mb-1"
                >ปีที่เริ่มต้น (พ.ศ.) <span class="text-red-500">*</span></label
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
                :input-id="'start-year'"
              />
            </div>

            <div>
              <label class="block font-bold mb-1"
                >ปีที่สิ้นสุด (พ.ศ.) <span class="text-red-500">*</span></label
              >
              <input
                id="end-year"
                v-model="selectedEndYear"
                type="text"
                inputmode="numeric"
                maxlength="4"
                placeholder="เช่น 2568"
                class="w-full border px-4 py-3 rounded-xl"
                @input="
                  selectedEndYear = String($event.target.value)
                    .replace(/[^0-9]/g, '')
                    .slice(0, 4)
                "
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
import { computed, reactive, ref, watch, onMounted } from "vue";
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

// ✅ ตัวเลือก "สมาชิกทุกประเภท" แบบ virtual (id ไม่ชนกับจริง)
const ALL_ID = 0;
const ALL_LABEL = "สมาชิกทุกประเภท";

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
const selectedCurriculumType = ref(curriculumType[0]);
const meetingDate = ref(null);
const statusOptions = [
  { id: 1, name: "ใช้งาน" },
  { id: 0, name: "ไม่ใช้งาน" },
];
const ispublicOptions = [
  { id: 1, value: true, name: "เผยแพร่" },
  { id: 0, value: false, name: "ไม่เผยแพร่" },
];

const selectedStatus = ref(statusOptions[0]);
const selectedIspublic = ref(ispublicOptions[0]);

const colleges = ref([]);
const degrees = ref([]);
const filteredDegrees = ref([]);

const selectedStartYear = ref(null);
const startYearOptions = ref([]);

const selectedEndYear = ref("");
const endYearOptions = ref([]);

const selectedCurriculumYear = ref(null);
const curriculumYearOptions = ref([]);

const curriculumNameOptions = ref([]);

const typeOptions = ref([]); // [{id, name}]
const selectedTypes = ref([]); // number[]
const selectAllRef = ref(null);
const setSelectAllRef = (el) => (selectAllRef.value = el);

// id ของตัวเลือกจริงทั้งหมด (ไม่รวม ALL_ID)
const realTypeIds = computed(() =>
  (typeOptions.value || [])
    .filter((t) => t.id !== ALL_ID)
    .map((t) => Number(t.id))
);
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
const pendingIncomingTypes = ref(null);
/* =========================
 * Computed (types)
 * ========================= */
const allTypeId = computed(() => ALL_ID);

// // ส่งให้ BE: ถ้าเลือก "สมาชิกทุกประเภท" → ส่งแค่ [allId] ไม่งั้นส่งตามที่เลือก
// const payloadTypeIds = computed(() => {
//   const allId = allTypeId.value;
//   const sel = selectedTypes.value || [];
//   if (!Array.isArray(sel) || sel.length === 0) return [];
//   if (allId != null && sel.includes(allId)) return [allId];
//   return Array.from(new Set(sel.map(Number)));
// });

/* =========================
 * Helpers
 * ========================= */
const endOfToday = computed(() => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
});

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

// function onEndYearBlur() {
//   const s = Number(selectedStartYear.value);
//   const e = Number(selectedEndYear.value);
//   // ว่างก็ข้ามไปก่อน
//   if (!Number.isFinite(e)) return;

//   // บังคับช่วงปี พ.ศ. ที่ยอมรับ
//   if (e < 2400 || e > 2699) {
//     Swal.fire({
//       icon: "warning",
//       title: "ปีสิ้นสุดไม่ถูกต้อง",
//       text: "กรุณากรอกปี พ.ศ. 4 หลัก ระหว่าง 2400–2699",
//     });
//     selectedEndYear.value = ""; // เคลียร์ให้กรอกใหม่
//     return;
//   }

//   // ถ้าต่ำกว่าปีเริ่มต้น ให้เด้งขึ้นมาเท่ากับปีเริ่มต้น
//   if (Number.isFinite(s) && e < s) {
//     selectedEndYear.value = String(s);
//   }
// }

function applyIncomingTypes(incoming) {
  // ถ้า master ยังไม่พร้อม → เก็บไว้ก่อน
  if (!realTypeIds.value.length) {
    pendingIncomingTypes.value = Array.isArray(incoming)
      ? [...incoming]
      : incoming;
    return;
  }

  const allId = allTypeId.value;
  const allReal = realTypeIds.value;
  const known = new Set(allId != null ? [allId, ...allReal] : allReal);

  let arr = Array.isArray(incoming) ? incoming : [];
  arr = arr.map(Number).filter((n) => Number.isFinite(n) && known.has(n));

  if (allId != null && arr.includes(allId)) {
    selectedTypes.value = [allId, ...allReal];
  } else {
    const hasAllReal =
      allReal.length > 0 && allReal.every((id) => arr.includes(id));
    selectedTypes.value =
      hasAllReal && allId != null ? [allId, ...allReal] : arr;
  }
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

function arraysEqual(a = [], b = []) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
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
  const mapped = raw
    .filter((t) => Number(t.active) === 1)
    .map((t) => ({ id: Number(t.id), name: String(t.type_name) }));

  // ✅ prepend ตัวเลือกเสมือน "สมาชิกทุกประเภท"
  typeOptions.value = [{ id: ALL_ID, name: ALL_LABEL }, ...mapped];
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
  try {
    const params = {
      sort: "institute_group", // column
      order: "ASC", // direction
      search: search.value.trim(),
      active: 1,
    };
    const res = await getCollegesPaginated(params);
    const rows = res.data?.data || [];
    colleges.value = rows.map((c) => ({
      ...c,
      label: [c.name, (c.campus ?? "").trim()].filter(Boolean).join("  "),
    }));
  } catch (err) {
    console.error("getCollegesPaginated error:", err);
    // await notifyError("ไม่สามารถโหลดข้อมูลสถาบัน", "กรุณาลองใหม่อีกครั้ง");
    await Swal.fire({
      icon: "error",
      title: "ไม่สามารถโหลดข้อมูลสถาบัน",
      text: "กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
    });
  }
}

const mastersLoaded = ref(false);

async function prefetchMasters() {
  if (mastersLoaded.value) return;
  await fetchTypes(); // ต้องมาก่อน เพื่อให้มี realTypeIds ใช้ตรวจ 'เลือกครบ'
  await Promise.all([
    fetchDegrees(),
    fetchColleges(),
    fetchStartYears(),
    fetchCurriculumNames(),
  ]);
  mastersLoaded.value = true;

  // ✅ ถ้าระหว่างรอ master มีค่าประเภทเข้ามาแล้ว ให้ apply ตอนนี้
  if (pendingIncomingTypes.value != null) {
    applyIncomingTypes(pendingIncomingTypes.value);
    pendingIncomingTypes.value = null;
  }
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
  const str = String(y ?? "");
  // ถ้าลบหมด = ว่าง → ให้ form.end_year ว่างด้วย (ไม่แปลงเป็น 0)
  if (str === "") {
    form.end_year = "";
    return;
  }
  // ซิงก์ลงฟอร์มเฉพาะเมื่อเป็นปี พ.ศ. 4 หลักเท่านั้น
  if (/^\d{4}$/.test(str)) {
    form.end_year = str;
  } else {
    // ระหว่างพิมพ์ (เช่น 25, 256) ยังไม่ซิงก์เพื่อไม่ให้ validation/auto-correctรบกวน
    form.end_year = "";
  }
});

watch(selectedCurriculum, (val) => (form.name = val ? String(val).trim() : ""));
watch([selectedCurriculumType, selectedCurriculumYear], () => {
  form.description = buildAutoDescription();
});

/* =========================
 * Types UI: select-all/indeterminate
 * ========================= */
function onTypeChange(changedId) {
  const real = realTypeIds.value;

  if (Number(changedId) === ALL_ID) {
    const checked = selectedTypes.value.includes(ALL_ID);
    selectedTypes.value = checked ? [ALL_ID, ...real] : [];
    return;
  }

  // ติ๊กย่อย → ตัด ALL ออกก่อน แล้วเช็คว่าครบทุกย่อยหรือไม่
  selectedTypes.value = selectedTypes.value.filter((id) => id !== ALL_ID);
  const sel = new Set(selectedTypes.value.map(Number));
  const selectedRealCount = real.filter((id) => sel.has(id)).length;

  if (selectedRealCount === real.length) {
    selectedTypes.value = [ALL_ID, ...real];
  }
}

// ✅ ทำให้ selectedTypes เป็นตัวเลข + ไม่ซ้ำ (ป้องกันลูปด้วย arraysEqual)
watch(selectedTypes, (v) => {
  const normalized = Array.from(
    new Set((v || []).map(Number).filter(Number.isFinite))
  );
  if (!arraysEqual(normalized, selectedTypes.value)) {
    selectedTypes.value = normalized;
  }
});

watch([selectedTypes, realTypeIds], () => {
  if (!selectAllRef.value) return;
  const sel = new Set(selectedTypes.value.map(Number));
  const real = realTypeIds.value;
  const some = real.some((id) => sel.has(id));
  const all  = real.every((id) => sel.has(id));
  selectAllRef.value.indeterminate = some && !all;
}, { deep: true });

// ✅ บังคับซิงก์ ALL เมื่อลิสต์ประเภทเปลี่ยนหรือค่าที่เลือกถูกแก้จากที่อื่น

/* =========================
 * Populate on open
 * ========================= */

const payloadTypeText = computed(() => {
  const sel = (selectedTypes.value || []).map(Number).filter(Number.isFinite);
  if (!sel.length) return "";

  const real = realTypeIds.value; // เช่น [1,2,3]
  const hasAll = sel.includes(ALL_ID);
  const selectedRealCount = new Set(sel.filter((id) => id !== ALL_ID)).size;

  // เลือก ALL หรือเลือกครบทุกย่อย → ส่งทุก id จริง
  if (hasAll || selectedRealCount === real.length) return real.join(",");

  // เลือกบางส่วน → ส่งเฉพาะที่เลือก (ไม่รวม ALL_ID)
  return Array.from(new Set(sel.filter((id) => id !== ALL_ID)))
    .sort((a, b) => a - b)
    .join(",");
});

function ensureCollegeOption(id, fallback) {
  const nid = Number(id);
  if (!Number.isFinite(nid)) return;

  const exists = colleges.value.some((c) => Number(c.id) === nid);
  if (!exists) {
    if (fallback?.name) {
      const label = [fallback.name, (fallback.campus ?? "").trim()]
        .filter(Boolean)
        .join("  ");
      colleges.value.unshift({ id: nid, ...fallback, label });
    }
    // ถ้ามี API getCollegeById สามารถเรียกมาเติมแทน fallback ได้
  }
}

function ensureDegreeOption(id, fallback) {
  const nid = Number(id);
  if (!Number.isFinite(nid)) return;

  const exists = filteredDegrees.value.some((d) => Number(d.id) === nid);
  if (!exists && fallback?.name) {
    filteredDegrees.value.unshift({ id: nid, ...fallback });
  }
}

function ensureCurriculumNameOption(name) {
  if (!name || typeof name !== "string") return;
  const exists = curriculumNameOptions.value.some(
    (o) => o?.name?.trim() === name.trim()
  );
  if (!exists) {
    curriculumNameOptions.value.unshift({ name: name.trim() });
  }
}

function normalizeTypeField(typeField) {
  if (Array.isArray(typeField))
    return typeField.map(Number).filter(Number.isFinite);
  if (typeof typeField === "string") {
    return typeField
      .split(/[,\s]+/)
      .map((s) => parseInt(s, 10))
      .filter(Number.isFinite);
  }
  return [];
}

function setTypesFromRecord(typeFieldFromRecord) {
  const ids = normalizeTypeField(typeFieldFromRecord);
  const allowed = new Set(realTypeIds.value);
  const chosen = ids.filter((n) => allowed.has(n));

  const allSelected =
    chosen.length > 0 && chosen.length === realTypeIds.value.length;
  selectedTypes.value = allSelected ? [ALL_ID, ...realTypeIds.value] : chosen;
}
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
  const noYear =
    selectedCurriculumYear.value === null ||
    selectedCurriculumYear.value === undefined;

  if (noYear) {
    await Swal.fire({
      icon: "warning",
      title: "กรุณาเลือก พ.ศ. หลักสูตร",
    });
    // โฟกัสไปที่ตัวแรกที่ยังไม่ครบ
    if (noYear) {
      document.getElementById("curriculum-year")?.focus();
    }
    return;
  }

  if (!selectedTypes.value.length)
    return Swal.fire({
      icon: "warning",
      title: "กรุณาเลือก 'หลักสูตรสำหรับ' อย่างน้อย 1 รายการ",
    });
  if (!form.meeting_no?.trim())
    return Swal.fire({ icon: "warning", title: "กรุณากรอกมติการประชุม" });
  if (!meetingDate.value) {
    await Swal.fire({ icon: "warning", title: "กรุณาเลือกวันที่ประชุม" });
    return;
  }

  const meetingDateStr = dayjs(meetingDate.value).format("YYYY-MM-DD");
  if (dayjs(meetingDate.value).isAfter(dayjs(), "day")) {
    await Swal.fire({
      icon: "warning",
      title: "วันที่ประชุมต้องไม่เกินวันที่ปัจจุบัน",
    });
    return;
  }

  if (!form.start_year)
    return Swal.fire({
      icon: "warning",
      title: "กรุณาเลือกปีที่เริ่มต้น (พ.ศ.)",
    });
  const start = parseInt(form.start_year);
  const end = parseInt(form.end_year);
  if (Number.isFinite(start) && Number.isFinite(end) && end < start)
    return Swal.fire({
      icon: "warning",
      title: "ปีที่สิ้นสุดต้องไม่น้อยกว่าปีที่เริ่มต้น",
    });

  if (!/^\d{4}$/.test(String(form.end_year))) {
    return Swal.fire({ icon: "warning", title: "ปีที่สิ้นสุดไม่ถูกต้อง" });
  }
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
      meeting_date: meetingDateStr,
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
function populateFromCurriculum(c) {
  if (!c) return;

  // ปีเริ่ม/สิ้นสุด
  ensureYearOption(Number(c.start_year));
  ensureYearOption(Number(c.end_year));
  selectedStartYear.value = Number(c.start_year) || null;
  syncEndYearOptionsByStart(selectedStartYear.value);
  selectedEndYear.value = c.end_year
    ? String(c.end_year)
    : selectedStartYear.value
    ? String(selectedStartYear.value)
    : "";
  form.end_year = selectedEndYear.value;
  form.end_year = selectedEndYear.value ? String(selectedEndYear.value) : "";

  // สถาบัน / ระดับการศึกษา / ชื่อหลักสูตร
  // selectedCollege.value = c.college_id ?? c.college?.id ?? null;
  const collegeId = c.college_id ?? c.college?.id ?? null;
  ensureCollegeOption(collegeId, c.college);
  selectedCollege.value = Number.isFinite(Number(collegeId))
    ? Number(collegeId)
    : null;

  // const degreeId = c.degree_id ?? c.degree?.id ?? null;
  // selectedDegree.value =
  //   (filteredDegrees.value || []).find(
  //     (d) => Number(d.id) === Number(degreeId)
  //   ) ?? null;
  const degreeId = c.degree_id ?? c.degree?.id ?? null;
  ensureDegreeOption(degreeId, c.degree);
  selectedDegree.value =
    (filteredDegrees.value || []).find(
      (d) => Number(d.id) === Number(degreeId)
    ) ?? null;
  ensureCurriculumNameOption(c.name);
  selectedCurriculum.value = c.name || null;

  // สถานะเผยแพร่/การใช้งาน
  selectedIspublic.value =
    ispublicOptions.find(
      (x) => x.value === Boolean(c.is_curriculum_published)
    ) ?? ispublicOptions[0];
  selectedStatus.value =
    statusOptions.find((x) => x.id === Number(c.active)) ?? statusOptions[0];

  // คำอธิบาย (แยกชนิด + ปีจาก description ถ้ามี)
  const { typeName, yearBE } = parseTypeYearFromDescription(
    c.description || ""
  );
  if (typeName) {
    selectedCurriculumType.value =
      curriculumType.find((x) => x.name === typeName) || null;
  } else {
    selectedCurriculumType.value = curriculumType[0] || null;
  }
  if (Number.isFinite(yearBE)) {
    ensureYearOption(yearBE);
    selectedCurriculumYear.value = yearBE;
  }
  form.description = c.description || buildAutoDescription();

  // ฟิลด์อื่น ๆ
  form.active = Number.isFinite(+c.active) ? +c.active : 1;
  form.remark = c.remark || "";
  form.meeting_no = c.meeting_resolution || c.meeting_no || "";
  meetingDate.value = c.meeting_date ? dayjs(c.meeting_date).toDate() : null;

  // ประเภท (รับได้ทั้ง string csv / array ids / objects)
  const incoming =
    typeof c.type === "string" && c.type.trim().length
      ? parseTypeTextToIds(c.type) // "1,2,3" -> [1,2,3]
      : Array.isArray(c.type_ids)
      ? c.type_ids
      : c.types?.map((t) => t.id) ?? [];

  applyIncomingTypes(incoming);
}

// เมื่อ props.curriculum เปลี่ยนระหว่างที่ modal เปิดอยู่ ⇒ อัปเดตฟอร์มทันที
watch(
  () => props.curriculum,
  (c) => {
    if (!props.showModal || !c) return;
    populateFromCurriculum(c);
  },
  { immediate: true } // ถ้าต้องการให้ populate ครั้งแรกด้วยก็ใส่
);

watch(
  () => props.showModal,
  async (open) => {
    if (!open) return;
    isLoading.value = true;
    try {
      await prefetchMasters(); // ✅ โหลด master ให้ครบก่อน
      populateFromCurriculum(props.curriculum ?? {}); // ✅ แล้วค่อย bind
    } finally {
      isLoading.value = false;
    }
  }
);
onMounted(() => {
  prefetchMasters().catch(() => {});
});
</script>
