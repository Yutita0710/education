
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
              class="font-[15px]"
              v-model="selectedCollege"
              :options="colleges"
              label="name"
              :reduce="(college) => college.id"
              placeholder="กรุณาเลือกระดับการศึกษา..."
              required
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
              หลักสูตรสำหรับ <span class="text-red-500">*</span>
            </label>

            <ul
              class="items-center w-full text-sm font-medium text-gray-900 bg-white sm:flex"
            >
              <li v-for="opt in typeOptions" :key="opt.id" class="w-full">
                <div class="flex items-center ps-3">
                  <input
                    :id="`type-${opt.id}`"
                    type="radio"
                    name="curriculum-type"
                    :value="opt.id"
                    v-model="selectedType"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500"
                  />
                  <label
                    :for="`type-${opt.id}`"
                    class="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >
                    {{ opt.name }}
                  </label>
                </div>
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
                disabled
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
import { reactive, ref, watch } from "vue";
import {
  addEducation,
  getallYears,
  getCollegesPaginated,
  getCurriculumsListAll,
  getDegrees,
  getEducationPaginated,
  getTypes,
} from "@/services/apiService";
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
const selectedCollege = ref(null);
const selectedDegree = ref(null);
// ค่าที่ผู้ใช้เลือก (เก็บเป็น id ของหลักสูตร)
const selectedCurriculum = ref(null);
const selectedCurriculumName = ref(null);
// options สำหรับ v-select แยกกันชัดเจน
const curriculumNameOptions = ref([]); // [{ name: string }]
const selectedCurriculumType = ref(null);
const meetingDate = ref(null); // ค่าเป็นสตริงรูปแบบวันที่ ISO
const props = defineProps({
  showModal: Boolean,
  closeModal: Function,
});

const emit = defineEmits(["close"]);
const statusOptions = [
  { id: 1, name: "ใช้งาน" },
  { id: 0, name: "ไม่ใช้งาน" },
];
const ispublicOptions = [
  { id: 1, value: true, name: "เผยแพร่" },
  { id: 0, value: false, name: "ไม่เผยแพร่" },
];

const curriculumType = [
  { id: 1, name: "หลักสูตร" },
  { id: 2, name: "หลักสูตรใหม่" },
  { id: 2, name: "หลักสูตรปรับปรุง" },
];

const selectedStatus = ref(statusOptions[0]);
const selectedIspublic = ref(ispublicOptions[0]);
const colleges = ref([]);
const isLoading = ref(false);
const search = ref("");
const degrees = ref([]); // จาก API
const filteredDegrees = ref([]);
const form = reactive({
  name: "",
  description: "",
  degree_id: "", // number | string ของ id
  start_year: "", // พ.ศ. (string)
  end_year: "", // พ.ศ. (string)
  college_id: "", // number | string ของ id
  active: 1,
  remark: "", // ✅ เพิ่ม
  meeting_no: "", // ✅ เพิ่ม (จะ map เป็น meeting_resolution)
});
console.log("form", form);
const typeOptions = ref([]); // << ต้องมีบรรทัดนี้
const selectedType = ref(null);
// ปีเริ่มต้น (ของข้อมูลหลัก)
const selectedStartYear = ref(null);
const startYearOptions = ref([]);

// ปี พ.ศ. อีกตัวสำหรับ description (หรือจุดประสงค์อื่น)
const selectedCurriculumYear = ref(null);
const curriculumYearOptions = ref([]);


async function fetchStartYears() {
  isLoading.value = true;
  try {
    const res = await getallYears();
    const apiYears = res?.data?.startYears ?? [];

    const valid = Array.from(new Set(apiYears.map((y) => Number(y))))
      .filter((y) => Number.isFinite(y) && y >= 2400 && y <= 2699);

    const currentBE = dayjs().year() + 543;
    const minBE = valid.length ? Math.min(...valid) : 2400;

    const range = [];
    for (let y = currentBE; y >= minBE; y--) range.push(y);

    const mapped = range.map((y) => ({ name: String(y), value: y }));
    startYearOptions.value = mapped;
    curriculumYearOptions.value = [...mapped];

    // set ค่าเริ่มต้นโหมดแก้ไข (ถ้ามี)
    const editStart = Number(props?.curriculum?.start_year);
    selectedStartYear.value =
      Number.isFinite(editStart) && editStart >= minBE && editStart <= currentBE
        ? editStart
        : null;

    // ถ้าต้องการเดาปีจาก description
    const yearInDesc = Number(
      String(props?.curriculum?.description ?? "").match(/\b(24|25|26)\d{2}\b/)?.[0]
    );
    selectedCurriculumYear.value =
      Number.isFinite(yearInDesc) && yearInDesc >= minBE && yearInDesc <= currentBE
        ? yearInDesc
        : null;
  } catch (err) {
    console.error("fetchStartYears error:", err);
    startYearOptions.value = [];
    curriculumYearOptions.value = [];
  } finally {
    isLoading.value = false;
  }
}


// เมื่อเลือก "ชื่อหลักสูตร" -> เขียนลง form.name
watch(selectedCurriculum, (val) => {
  form.name = val ? String(val).trim() : "";
});

// เมื่อเลือก "หลักสูตร" (รายละเอียด) -> เขียนลง form.description
watch(selectedCurriculumName, (val) => {
  form.description = val ? String(val).trim() : "";
});

function clearForm() {
  form.name = "";
  form.description = "";
  form.degree_id = null; // ✅ รีเซ็ต v-select
  form.college_id = null; // ✅ รีเซ็ต v-select
  form.start_year = "";
  form.end_year = "";
  form.active = 1;
  form.remark = "";
  selectedCollege.value = null;
  selectedDegree.value = null;
}

function limitYear(field) {
  const value = form[field]?.toString();

  // ตรวจสอบว่าเป็นตัวเลขและต้องมีความยาว 4 หลัก
  if (!/^\d{4}$/.test(value)) {
    Swal.fire({
      title: "รูปแบบไม่ถูกต้อง",
      text: "กรุณากรอกปีเป็นตัวเลข 4 หลัก",
      icon: "warning",
      confirmButtonText: "ตกลง",
    });

    // ล้างค่าผิดออก
    form[field] = "";
  }
}
watch(selectedCollege, (val) => {
  // v-select reduce => id ตรง ๆ
  form.college_id = val || "";
});

// ❗ เดิมเป็น object ทั้งก้อน -> เปลี่ยนให้เก็บ id
watch(selectedDegree, (val) => {
  form.degree_id = val?.id || "";
});
// Watch start_year เพื่อบวก 5 ปีให้อัตโนมัติ
watch(
  () => form.start_year,
  (newStart) => {
    const start = parseInt(newStart);
    if (!isNaN(start)) {
      // บวก 5 ปีเสมอ
      form.end_year = start + 4;
    } else {
      form.end_year = "";
    }
  }
);

// Watch end_year เพื่อห้ามน้อยกว่าปีเริ่มต้น
watch(
  () => form.end_year,
  (newEndYear) => {
    const start = parseInt(form.start_year);
    const end = parseInt(newEndYear);

    if (!isNaN(start) && !isNaN(end)) {
      if (end < start) {
        form.end_year = start; // ปรับให้เท่ากับ start_year
      }
    }
  }
);

async function fetchTypes() {
  isLoading.value = true;
  try {
    const res = await getTypes();
    const raw = res?.data?.data ?? [];
    typeOptions.value = raw
      .filter((t) => Number(t.active) === 1)
      .map((t) => ({
        id: t.id,
        name: t.type_name,
      }));
  } catch (err) {
    console.error("fetchTypes error:", err);
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถโหลดข้อมูลประเภทหลักสูตรได้",
      text: "กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
    });
  } finally {
    isLoading.value = false;
  }
}

async function saveCurriculum() {
  // … (เช็ก required เดิมคงไว้)

  isLoading.value = true;
  try {
    const submitData = {
      name: form.name?.trim(),
      description: form.description?.trim(),
      degree_id: Number(form.degree_id),
      start_year: String(form.start_year),
      end_year: String(form.end_year),
      college_id: Number(form.college_id),
      active: Number(selectedStatus.value?.id ?? form.active),
      remark: form.remark ?? "",
      meeting_resolution: form.meeting_no ?? "",
      is_curriculum_published: Boolean(selectedIspublic.value?.value),
      type: selectedType.value ?? (selectedType.value === 0 ? 0 : ""),
      meeting_date: formatToBuddhist(meetingDate.value),
    };

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
    // ----- แยกข้อความ error จาก backend -----
    const status =
      err?.response?.status ?? err?.response?.data?.statusCode ?? null;

    const rawMessage = err?.response?.data?.message ?? err?.message;
    const messageText = Array.isArray(rawMessage)
      ? rawMessage.join("\n")
      : String(rawMessage || "");

    // ----- จัดการเคสซ้ำโดยเฉพาะ -----
    if (status === 400 && /already exists/i.test(messageText)) {
      await Swal.fire({
        icon: "warning",
        title: "ข้อมูลซ้ำ",
        text: "มีหลักสูตรชื่อนี้อยู่ในระบบแล้ว กรุณาเปลี่ยนชื่อหลักสูตร",
        confirmButtonText: "ตกลง",
      });
      // ถ้ามี ref ของช่องชื่อหลักสูตร จะโฟกัสช่องให้ (ออปชัน)
      // nameInputRef?.value?.focus?.();
    } else if (status === 400) {
      await Swal.fire({
        icon: "warning",
        title: "บันทึกไม่สำเร็จ",
        text: messageText || "กรุณาตรวจสอบข้อมูลที่กรอก",
        confirmButtonText: "ตกลง",
      });
    } else {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: messageText || "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#EF4444",
      });
    }
  } finally {
    isLoading.value = false;
  }
}

// AddCurriculumModal.vue (หรือที่เรียกใช้)
async function fetchCurriculum() {
  isLoading.value = true;
  try {
    const res = await getCurriculumsListAll();
    console.log("Curriculums", res);
    // คาดรูปแบบ res.data.data = { name: string[], description: string[] }
    const names = Array.isArray(res?.data?.data?.name)
      ? res.data.data.name
      : [];
    const descs = Array.isArray(res?.data?.data?.description)
      ? res.data.data.description
      : [];

    // map เป็น options ของ v-select
    curriculumNameOptions.value = names
      .filter(Boolean)
      .map((n) => ({ name: String(n).trim() }));
  } catch (err) {
    console.error("❌ API error payload:", err?.response?.data || err);
  } finally {
    isLoading.value = false;
  }
}

// Fetch degrees
async function fetchDegrees() {
  try {
    const res = await getDegrees();
    console.log("Degrees", res);
    degrees.value = res.data?.data || [];
    filteredDegrees.value = [...degrees.value];
  } catch {
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถโหลดข้อมูลระดับการศึกษา",
      text: "กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
    });
  }
}

async function fetchColleges() {
  try {
    const params = {
      sort: "id",
      order: "ASC",
      search: search.value.trim(),
    };

    const res = await getCollegesPaginated(params);
    console.log(res);
    colleges.value = res.data?.data || [];
  } catch (err) {
    console.error("Error fetching colleges:", err);

    Swal.fire({
      icon: "error",
      title: "ไม่สามารถโหลดข้อมูลสถาบันการศึกษา",
      text: "กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
      timerProgressBar: true,
    });
  }
}

const formatToThai = (date) => {
  return date ? dayjs(date).add(543, "year").format("DD/MM/YYYY") : "";
};

// (ถ้าต้องการส่งเข้า API เป็น ค.ศ. YYYY-MM-DD)
// ฟังก์ชันแปลงให้เหลือแต่วัน (Date instance จริง)
const formatToBuddhist = (date) => {
  return date ? dayjs(date).startOf("day").toDate() : null;
};

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

watch([selectedCurriculumType, selectedCurriculumYear], () => {
  form.description = buildAutoDescription();
});
// ลำดับตอนเปิดโมดัล
watch(
  () => props.showModal,
  async (open) => {
    if (!open) return;
    // ถ้าเป็น “เพิ่มใหม่” ให้ล้างฟอร์มก่อน แล้วค่อยดึงข้อมูล
    if (!props.curriculum) clearForm();

    await Promise.all([
      fetchDegrees(),
      fetchColleges(),
      fetchCurriculum(),
      fetchStartYears(), // โหลดปี แล้วโค้ดด้านบนจะ set ค่า editYear ให้เองถ้ามี
      fetchTypes(),
    ]);
  }
);
</script>
