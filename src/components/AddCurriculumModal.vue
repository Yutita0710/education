
<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
  >
    <!-- modal wrapper -->
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative overflow-hidden"
      @click.stop
    >
      <!-- HEADER: ติดขอบบนของโมดัล และไม่เลื่อน -->
      <div class="flex items-center justify-center bg-white px-6 py-3 relative">
        <h1 class="text-2xl font-bold text-gray-800">เพิ่มข้อมูลหลักสูตร</h1>
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

      <!-- BODY: ส่วนที่เลื่อน -->
      <div class="p-6 overflow-y-auto max-h-[90vh]">
        <!-- วางฟอร์มเดิมทั้งหมดของคุณในนี้ -->
        <form @submit.prevent="saveCurriculum" class="space-y-4">
          <div class="mb-4 relative">
            <label class="block font-bold mb-1">
              ชื่อสถาบัน <span class="text-red-500">*</span>
            </label>
            <v-select
              v-model="selectedCollege"
              :options="colleges"
              label="label"
              :reduce="(c) => c.id"
              placeholder="กรุณาเลือกสถาบัน..."
            />
          </div>
          <!-- ชื่อหลักสูตร -->
          <div>
            <label class="block font-bold mb-1">
              ชื่อหลักสูตร <span class="text-red-500">*</span>
            </label>
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
          <!-- ชื่อหลักสูตร -->

          <div class="grid grid-cols-2 gap-4 items-end w-full">
            <!-- หลักสูตร -->
            <div>
              <label class="block font-bold mb-1">
                หลักสูตร <span class="text-red-500">*</span>
              </label>
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
                    v-for="curriculumTypeOption in curriculumType"
                    :key="curriculumTypeOption.id"
                    :value="curriculumTypeOption"
                    class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                  >
                    <span class="block truncate">{{
                      curriculumTypeOption.name
                    }}</span>
                    <span
                      v-if="
                        selectedCurriculumType?.id === curriculumTypeOption.id
                      "
                      class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                    >
                      <CheckIcon class="w-5 h-5" aria-hidden="true" />
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </div>

            <!-- พ.ศ. -->
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
            <label class="block font-bold mb-1">
              ระดับการศึกษา <span class="text-red-500">*</span>
            </label>
            <Listbox
              v-model="selectedDegree"
              as="div"
              class="relative w-full rounded-lg border px-2 py-[0.15rem]"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-2"
              >
                <span class="truncate">
                  {{ selectedDegree?.name || "ระดับการศึกษา" }}
                </span>
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
            <label class="block font-bold mb-1">
              หลักสูตรสำหรับ
              <!-- <span class="text-red-500">*</span> -->
            </label>

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
                    >
                      (เลือกทั้งหมด)
                    </span>
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
          <!-- 2 Column Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label class="block font-bold mb-1">
                มติการประชุมครั้งที่ <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.meeting_no"
                type="text"
                class="w-full border px-4 py-2 rounded-xl"
                placeholder="เช่น 1/2568"
                required
              />
            </div>
            <div>
              <label class="block font-bold mb-1">
                วันที่ประชุม <span class="text-red-500">*</span>
              </label>
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- ปีเริ่มต้น -->
            <div>
              <label class="block font-bold mb-1">
                ปีเริ่มต้น (พ.ศ.) <span class="text-red-500">*</span>
              </label>
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

            <!-- ปีสิ้นสุด -->
            <div>
              <label class="block font-bold mb-1">
                ปีสิ้นสุด (พ.ศ.) <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.end_year"
                type="text"
                @blur="limitYear('end_year')"
                class="w-full border px-4 py-2 rounded-xl"
                placeholder="เช่น 2570"
                required
                readonly
              />
            </div>

            <!-- สถานะ -->
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
                    v-for="ispublic in ispublicOptions"
                    :key="ispublic.id"
                    :value="ispublic"
                    class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                  >
                    <span class="block truncate">{{ ispublic.name }}</span>
                    <span
                      v-if="selectedIspublic?.id === ispublic.id"
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
                    v-for="status in statusOptions"
                    :key="status.id"
                    :value="status"
                    class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                  >
                    <span class="block truncate">{{ status.name }}</span>
                    <span
                      v-if="selectedStatus?.id === status.id"
                      class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                    >
                      <CheckIcon class="w-5 h-5" aria-hidden="true" />
                    </span>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-center gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-[#0085DB] hover:bg-[#0085DB] text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              <span v-if="!isLoading" class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6 mr-2"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z"
                    clip-rule="evenodd"
                  />
                </svg>

                บันทึก
              </span>
              <span v-else class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6 mr-2"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                    clip-rule="evenodd"
                  />
                </svg>

                บันทึก...
              </span>
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
 * 1) Imports
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
  addEducation,
  getallYears,
  getCollegesPaginated,
  getCurriculumsListAll,
  getDegrees,
  getTypes,
} from "@/services/apiService";

/* =========================
 * 2) Props & Emits
 * ========================= */
const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, required: true },
  // สำหรับโหมดแก้ไข ถ้ามีจะใช้ค่าเริ่มต้นจากนี่
  curriculum: { type: Object, default: null },
});
const emit = defineEmits(["close", "refresh-data"]);

/* =========================
 * 3) Constants / Options
 * ========================= */
const DURATION_YEARS = 5; // ระยะหลักสูตร 5 ปี → end = start + 4

const STATUS_OPTIONS = [
  { id: 1, name: "ใช้งาน" },
  { id: 0, name: "ไม่ใช้งาน" },
];

const ISPUBLIC_OPTIONS = [
  { id: 1, value: true, name: "เผยแพร่" },
  { id: 0, value: false, name: "ไม่เผยแพร่" },
];

const CURRICULUM_TYPE = [
  { id: 1, name: "หลักสูตร" },
  { id: 2, name: "หลักสูตรใหม่" },
  { id: 3, name: "หลักสูตรปรับปรุง" },
];

/* =========================
 * 4) State
 * ========================= */
const isLoading = ref(false);
const search = ref("");

const selectedCollege = ref(null); // v-select → id
const selectedDegree = ref(null); // Listbox → object(มี id)
const selectedCurriculum = ref(null); // v-select → string (ชื่อหลักสูตร)
const selectedCurriculumType = ref(null); // object จาก CURRICULUM_TYPE
const curriculumType = CURRICULUM_TYPE;
const meetingDate = ref(null);

const selectedStatus = ref(STATUS_OPTIONS[0]);
const selectedIspublic = ref(ISPUBLIC_OPTIONS[0]);

const colleges = ref([]);
const degrees = ref([]); // raw จาก API
const filteredDegrees = ref([]); // เอาไว้กรองในอนาคต

// ปีเริ่มต้น (ฟอร์มหลัก)
const selectedStartYear = ref(null);
const startYearOptions = ref([]);

// ปีที่ใช้ประกอบ description อัตโนมัติ
const selectedCurriculumYear = ref(null);
const curriculumYearOptions = ref([]);

// รายชื่อหลักสูตร (ตัวเลือกชื่อ)
const curriculumNameOptions = ref([]); // [{ name: string }]

// ประเภทสมาชิก/หลักสูตรสำหรับ
const typeOptions = ref([]); // [{ id, name }]
const selectedTypes = ref([]); // number[] (เก็บ id ที่เลือก)

// ref ของ checkbox “สมาชิกทุกประเภท”
const selectAllRef = ref(null);
const setSelectAllRef = (el) => (selectAllRef.value = el);

// ฟอร์มหลัก
const form = reactive({
  name: "",
  description: "",
  degree_id: "", // number string ok → แปลงตอนส่ง
  start_year: "", // BE
  end_year: "", // BE
  college_id: "",
  active: 1,
  remark: "",
  meeting_no: "",
  type_ids: [],
});

/* =========================
 * 5) Computed
 * ========================= */
// หา id ของ “สมาชิกทุกประเภท”
const allTypeId = computed(() => {
  const found = (typeOptions.value || []).find(
    (t) => t.name === "สมาชิกทุกประเภท"
  );
  return found ? found.id : null;
});

// id ของตัวเลือกย่อย (ยกเว้น all)
const realTypeIds = computed(() =>
  (typeOptions.value || [])
    .filter((t) => t.name !== "สมาชิกทุกประเภท")
    .map((t) => t.id)
);

// type_ids ที่จะส่ง (ตัด “สมาชิกทุกประเภท” ออก)
const payloadTypeIds = computed(() => {
  const allId = allTypeId.value; // ปกติ = 1
  const selRaw = selectedTypes.value || [];

  // ไม่เลือกอะไรเลย
  if (!Array.isArray(selRaw) || selRaw.length === 0) return [];

  // มีเลือก "สมาชิกทุกประเภท" → ถือว่าเลือกทั้งหมด ส่ง [1] อย่างเดียว
  if (allId != null && selRaw.includes(allId)) return [allId];

  // ไม่ได้เลือก 1 → ส่งตามที่เลือก
  // (แปลงเป็น number, ตัดค่าซ้ำ กัน edge case)
  const uniq = Array.from(new Set(selRaw.map(Number)));
  return uniq;
});

/* =========================
 * 6) Helper & UI utils
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

function clearForm() {
  form.name = "";
  form.description = "";
  form.degree_id = "";
  form.start_year = "";
  form.end_year = "";
  form.college_id = "";
  form.active = 1;
  form.remark = "";
  form.meeting_no = "";

  selectedCollege.value = null;
  selectedDegree.value = null;
  selectedStartYear.value = null;
  selectedCurriculumYear.value = null;
  selectedCurriculum.value = null;
  selectedCurriculumType.value = null;
  selectedTypes.value = [];
  meetingDate.value = null;

  selectedStatus.value = STATUS_OPTIONS[0];
  selectedIspublic.value = ISPUBLIC_OPTIONS[0];
}

function notifyError(title, text) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#EF4444",
  });
}

const payloadTypeText = computed(() => {
  const sel = (selectedTypes.value || []).map(Number).filter(Number.isFinite);

  if (!sel.length) return "";

  const allId = allTypeId.value; // id ของตัวเลือก "สมาชิกทุกประเภท" (เช่น 1)
  const real = realTypeIds.value; // id ของตัวเลือกย่อยจริง (เช่น [2,3,4])

  const hasAll = allId != null && sel.includes(allId);
  const allRealSelected = real.length && real.every((id) => sel.includes(id));

  // ถ้าเลือก "สมาชิกทุกประเภท" หรือเลือกครบทุกตัวเลือกย่อย → ใช้ id ของตัวเลือกย่อยทั้งหมด
  const ids =
    hasAll || allRealSelected ? real : sel.filter((id) => id !== allId); // ตัด allId ออกถ้าเผลอปนมา

  // กันค่าซ้ำและเรียงน้อย→มาก เพื่อให้เก็บสวย ๆ
  const uniqSorted = Array.from(new Set(ids)).sort((a, b) => a - b);
  return uniqSorted.join(",");
});
/* =========================
 * 7) Data fetchers
 * ========================= */
async function fetchStartYears() {
  try {
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

    // โหมดแก้ไข
    const editStart = Number(props?.curriculum?.start_year);
    selectedStartYear.value =
      Number.isFinite(editStart) &&
      editStart >= (range.at(-1)?.value ?? 2400) &&
      editStart <= currentBE
        ? editStart
        : null;
  } catch (e) {
    console.error("fetchStartYears error:", e);
    startYearOptions.value = [];
    curriculumYearOptions.value = [];
  }
}

async function fetchTypes() {
  try {
    const res = await getTypes();
    const raw = res?.data?.data ?? [];
    typeOptions.value = raw
      .filter((t) => Number(t.active) === 1)
      .map((t) => ({ id: t.id, name: t.type_name }));
  } catch (err) {
    console.error("fetchTypes error:", err);
    await notifyError(
      "ไม่สามารถโหลดข้อมูลประเภทหลักสูตรได้",
      "กรุณาลองใหม่อีกครั้ง"
    );
  }
}

async function fetchCurriculum() {
  try {
    const res = await getCurriculumsListAll();
    const names = Array.isArray(res?.data?.data?.name)
      ? res.data.data.name
      : [];
    curriculumNameOptions.value = names
      .filter(Boolean)
      .map((n) => ({ name: String(n).trim() }));
  } catch (err) {
    console.error("getCurriculumsListAll error:", err?.response?.data || err);
  }
}

async function fetchDegrees() {
  try {
    const res = await getDegrees();
    degrees.value = res.data?.data || [];
    filteredDegrees.value = [...degrees.value];
  } catch (err) {
    await notifyError(
      "ไม่สามารถโหลดข้อมูลระดับการศึกษา",
      "กรุณาลองใหม่อีกครั้ง"
    );
  }
}

async function fetchColleges() {
  try {
    const params = { sort: "id", order: "ASC", search: search.value.trim() };
    const res = await getCollegesPaginated(params);
    const rows = res.data?.data || [];
    colleges.value = rows.map((c) => ({
      ...c,
      label: [c.name, (c.campus ?? "").trim()].filter(Boolean).join("  "),
    }));
  } catch (err) {
    console.error("getCollegesPaginated error:", err);
    await notifyError(
      "ไม่สามารถโหลดข้อมูลสถาบันการศึกษา",
      "กรุณาลองใหม่อีกครั้ง"
    );
  }
}

/* =========================
 * 8) Watchers
 * ========================= */
// sync v-select → form.college_id
watch(selectedCollege, (val) => {
  form.college_id = val || "";
});

// sync degree(listbox object) → form.degree_id
watch(selectedDegree, (val) => {
  form.degree_id = val?.id || "";
});

// start_year (string) → คำนวณ end_year ตาม DURATION_YEARS
watch(
  () => form.start_year,
  (newStart) => {
    const s = parseInt(newStart);
    form.end_year = Number.isFinite(s) ? String(s + (DURATION_YEARS - 1)) : "";
  }
);

// ห้าม end_year น้อยกว่า start_year (กรณีมีการแก้ไขภายหลัง)
watch(
  () => form.end_year,
  (newEnd) => {
    const s = parseInt(form.start_year);
    const e = parseInt(newEnd);
    if (Number.isFinite(s) && Number.isFinite(e) && e < s) {
      form.end_year = String(s);
    }
  }
);

// เลือกปีเริ่ม → เขียน form.start_year
watch(selectedStartYear, (y) => {
  form.start_year = Number.isFinite(y) ? String(y) : "";
});

// เลือกชื่อหลักสูตร → เขียน form.name
watch(selectedCurriculum, (val) => {
  form.name = val ? String(val).trim() : "";
});

// อธิบายอัตโนมัติจากประเภท + พ.ศ.
watch([selectedCurriculumType, selectedCurriculumYear], () => {
  form.description = buildAutoDescription();
});

// Checkbox “สมาชิกทุกประเภท” (select all / indeterminate)
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
 * 9) Submit
 * ========================= */
async function saveCurriculum() {
  isLoading.value = true;
  try {
    // validation เบื้องต้น
    if (!form.name?.trim()) {
      await Swal.fire({ icon: "warning", title: "กรุณาเลือกชื่อหลักสูตร" });
      return;
    }
    if (!form.college_id) {
      await Swal.fire({ icon: "warning", title: "กรุณาเลือกชื่อสถาบัน" });
      return;
    }
    if (!form.degree_id) {
      await Swal.fire({ icon: "warning", title: "กรุณาเลือกระดับการศึกษา" });
      return;
    }
    if (!form.start_year) {
      await Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกปีเริ่มต้น (พ.ศ.)",
      });
      return;
    }
    // if (!selectedTypes.value.length) {
    //   await Swal.fire({
    //     icon: "warning",
    //     title: "กรุณาเลือก 'หลักสูตรสำหรับ' อย่างน้อย 1 รายการ",
    //   });
    //   return;
    // }
    if (!form.meeting_no?.trim()) {
      await Swal.fire({ icon: "warning", title: "กรุณากรอกมติการประชุม" });
      return;
    }
    if (!meetingDate.value) {
      await Swal.fire({ icon: "warning", title: "กรุณาเลือกวันที่ประชุม" });
      return;
    }

    const meetingDateStr = dayjs(meetingDate.value).format("YYYY-MM-DD");

    const submitData = {
      name: form.name.trim(),
      description: form.description?.trim() ?? "",
      degree_id: Number(form.degree_id),
      start_year: String(form.start_year), // พ.ศ.
      end_year: String(form.end_year), // พ.ศ.
      college_id: Number(form.college_id),
      active: Number(selectedStatus.value?.id ?? form.active),
      remark: form.remark ?? "",
      meeting_resolution: form.meeting_no ?? "",
      is_curriculum_published: Boolean(selectedIspublic.value?.value),
      type: payloadTypeText.value, // array<number>
      meeting_date: meetingDateStr, // YYYY-MM-DD
    };

    // ส่ง
    await addEducation(submitData);

    await Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      text: "ข้อมูลหลักสูตรถูกเพิ่มเรียบร้อยแล้ว",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    emit("refresh-data");
    props.closeModal();
  } catch (err) {
    console.error("saveCurriculum error:", err?.response?.data || err);
    const status =
      err?.response?.status ?? err?.response?.data?.statusCode ?? null;
    const rawMessage = err?.response?.data?.message ?? err?.message;
    const messageText = Array.isArray(rawMessage)
      ? rawMessage.join("\n")
      : String(rawMessage || "");

    if (status === 400 && /already exists/i.test(messageText)) {
      await Swal.fire({
        icon: "warning",
        title: "ข้อมูลซ้ำ",
        text: "มีหลักสูตรชื่อนี้อยู่แล้ว",
      });
    } else if (status === 400) {
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

/* =========================
 * 10) Open modal flow
 * ========================= */
watch(
  () => props.showModal,
  async (open) => {
    if (!open) return;

    // reset หรือ preload จาก props.curriculum
    if (!props.curriculum) {
      clearForm();
    } else {
      // โหลดค่าที่เลือกไว้ (กรณีแก้ไข)
      const existing =
        props.curriculum.type_ids ??
        props.curriculum.types?.map((t) => t.id) ??
        [];
      selectedTypes.value = Array.isArray(existing)
        ? existing.map((n) => Number(n)).filter((n) => Number.isFinite(n))
        : [];
    }

    isLoading.value = true;
    try {
      await Promise.all([
        fetchDegrees(),
        fetchColleges(),
        fetchCurriculum(),
        fetchStartYears(),
        fetchTypes(),
      ]);
    } finally {
      isLoading.value = false;
    }
  }
);

/* =========================
 * 11) Expose to template
 * ========================= */
</script>

