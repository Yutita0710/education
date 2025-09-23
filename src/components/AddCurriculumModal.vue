
<template>
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
    >
      <!-- modal wrapper -->
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative flex flex-col max-h-[80vh]"
        @click.stop
      >
        <!-- HEADER: ติดขอบบนของโมดัล และไม่เลื่อน -->
        <div
          class="flex items-center justify-center bg-white rounded-2xl px-6 py-3 relative"
        >
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
            <div class="mb-4 relative flex flex-col gap-2">
              <div class="flex items-center">
                <input
                  id="link-checkbox"
                  type="checkbox"
                  v-model="isSpecific"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                  :aria-expanded="isSpecific.toString()"
                  aria-controls="member-only-input"
                />
                <label
                  for="link-checkbox"
                  class="ms-2 text-[17px] font-medium text-gray-900"
                >
                  หลักสูตรเฉพาะสมาชิก
                </label>

                <!-- โชว์โน้ตเมื่อเลือก -->
                <span
                  v-show="isSpecific"
                  class="ms-2 text-[12px] text-gray-500"
                >
                  กรณีที่เลขประจำตัวคนต่างด้าวมี 13 หลัก ให้เพิ่มเลข 0 ด้านหน้า
                  ตัวอย่าง
                  <span class="text-red-600 underline underline-offset-2"
                    >0</span
                  >XXXXXXXXXXXXX
                </span>
              </div>

              <!-- อินพุตจะแสดงเมื่อเช็ก -->
              <div v-if="isSpecific" id="member-only-input" class="mt-1">
                <input
                  v-model="form.specific_no"
                  type="text"
                  inputmode="numeric"
                  pattern="\d*"
                  @input="
                    form.specific_no = (form.specific_no || '')
                      .replace(/\D/g, '')
                      .slice(0, 14)
                  "
                  class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="กรอกเลขบัตรประชาชน 13 หลัก/เลขประจำตัวคนต่างด้าว 14 หลัก"
                />
              </div>
            </div>
            <div class="mb-4 relative">
              <label class="block font-bold mb-1">
                ชื่อสถาบัน <span class="text-red-500">*</span>
              </label>
              <v-select
                v-model="selectedCollege"
                :options="colleges"
                label="label"
                :reduce="(c) => c.id"
                :searchable="true"
                :clearable="false"
                placeholder="กรุณาเลือกสถาบัน..."
              />
            </div>
            <!-- ชื่อหลักสูตร -->
            <div>
              <label class="block font-bold mb-1">
                ชื่อหลักสูตร <span class="text-red-500">*</span>
              </label>
              <v-select
                v-model="selectedCurriculum"
                :options="curriculumNameOptions"
                label="name"
                :searchable="true"
                :clearable="false"
                :reduce="(opt) => opt.name"
                :disabled="isLoading || !curriculumNameOptions.length"
                placeholder="กรุณาเลือกชื่อหลักสูตร..."
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
                  :searchable="true"
                  :clearable="false"
                  :reduce="(opt) => opt.value"
                  :disabled="
                    isLoading ||
                    !(curriculumYearOptions && curriculumYearOptions.length)
                  "
                  placeholder="กรุณาเลือกปี พ.ศ."
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
                />
              </div>
              <div>
                <label class="block font-bold mb-1">
                  วันที่ประชุม <span class="text-red-500">*</span>
                </label>
                <VueDatePicker
                  v-model="meetingDate"
                  :format="formatToThai"
                  :enable-time-picker="false"
                  :auto-apply="true"
                  :locale="'th'"
                  :max-date="endOfToday"
                  placeholder="เลือกวันที่ (วัน/เดือน/ปี พ.ศ.)"
                >
                  <!-- ปีใน header -->
                  <template #year="{ value }">
                    {{ toBE(value) }}
                  </template>

                  <!-- ปีใน overlay เลือกปี -->
                  <template #year-overlay-value="{ value }">
                    {{ toBE(value) }}
                  </template>
                </VueDatePicker>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <!-- ปีที่เริ่มต้น -->
              <div>
                <label class="block font-bold mb-1">
                  ปีที่เริ่มต้น (พ.ศ.) <span class="text-red-500">*</span>
                </label>
                <v-select
                  class="font-[15px] flex-1 min-w-0"
                  v-model="selectedStartYear"
                  :options="startYearOptions"
                  label="name"
                  :searchable="true"
                  :clearable="false"
                  :reduce="(opt) => opt.value"
                  :disabled="
                    isLoading || !(startYearOptions && startYearOptions.length)
                  "
                  placeholder="กรุณาเลือกปี พ.ศ."
                />
              </div>

              <!-- ปีที่สิ้นสุด -->
              <div>
                <label class="block font-bold mb-1">
                  ปีที่สิ้นสุด (พ.ศ.) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.end_year"
                  type="text"
                  @blur="limitYear('end_year')"
                  class="w-full border px-4 py-2 rounded-xl bg-gray-200"
                  placeholder="เช่น 2570"
                  readonly
                />
              </div>

              <!-- สถานะ -->
              <div>
                <label
                  for="ispublic"
                  class="block mb-2 font-medium text-gray-900"
                  >สถานะการเผยแพร่</label
                >
                <Listbox
                  v-model="selectedIspublic"
                  as="div"
                  :disabled="isSpecific"
                  :class="[
                    'relative w-full rounded-lg border px-2 py-[0.15rem]',
                    isSpecific ? 'bg-gray-200' : 'bg-white border-gray-300',
                  ]"
                >
                  <ListboxButton
                    :class="[
                      'relative w-full inline-flex items-center justify-between px-3 py-2 rounded-md',
                      isSpecific
                        ? 'text-gray-500 cursor-not-allowed pointer-events-none'
                        : 'cursor-pointer',
                    ]"
                    :aria-disabled="isSpecific ? 'true' : 'false'"
                    :tabindex="isSpecific ? -1 : 0"
                  >
                    <span class="truncate">{{
                      selectedIspublic?.name || "สถานะการเผยแพร่"
                    }}</span>
                    <ChevronUpDownIcon class="w-5 h-5 text-gray-500" />
                  </ListboxButton>

                  <ListboxOptions
                    v-if="!isSpecific"
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
            <div
              class="flex justify-center gap-3 pt-6 border-t border-gray-200"
            >
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
  </Teleport>

  <DetailCurriculumModal
    :key="detailCurriculum?.id ?? (showDetailModal ? 'open' : 'closed')"
    :showModal="showDetailModal"
    :curriculum="detailCurriculum"
    :closeModal="closeDetailModal"
    @request-edit="openEditFromDetail"
    @refresh-data="emit('refresh-data', $event)"
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
/* =========================
 * 1) Imports
 * ========================= */
import { computed, reactive, ref, watch, nextTick, onBeforeUnmount } from "vue";
import Swal from "sweetalert2";
import vSelect from "vue-select"; // ใช้ใน template
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
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
dayjs.extend(buddhistEra);
dayjs.locale("th");

import {
  addEducation,
  getEducationById,
  getallYears,
  getCollegesPaginated,
  getCurriculumsListAll,
  getDegrees,
  getTypes,
} from "@/services/apiService";

import DetailCurriculumModal from "./DetailCurriculumModal.vue";
import EditCurriculumModal from "./EditCurriculumModal.vue";

/* =========================
 * 2) Props & Emits
 * ========================= */
const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, required: true },
  curriculum: { type: Object, default: null }, // โหมดแก้ไข
});
const emit = defineEmits(["close", "refresh-data"]);

/* =========================
 * 3) Constants / Options
 * ========================= */
const ALL_ID = 0;
const ALL_LABEL = "สมาชิกทุกประเภท";
const DURATION_YEARS = 5;

const CURRICULUM_TYPE = [
  { id: 1, name: "หลักสูตร" },
  { id: 2, name: "หลักสูตรใหม่" },
  { id: 3, name: "หลักสูตรปรับปรุง" },
];
const statusOptions = [
  { id: 1, name: "ใช้งาน" },
  { id: 0, name: "ไม่ใช้งาน" },
];
const ispublicOptions = [
  { id: 1, value: true, name: "เผยแพร่" },
  { id: 0, value: false, name: "ไม่เผยแพร่" },
];

/* =========================
 * 4) State
 * ========================= */
const isLoading = ref(false);
const search = ref("");
const toBE = (v) => (isNaN(+v) ? v : +v + 543);

const selectedCollege = ref(null); // v-select => id
const selectedDegree = ref(null); // Listbox => object
const selectedCurriculum = ref(null); // v-select => string
const selectedCurriculumType = ref(CURRICULUM_TYPE[0]);
const curriculumType = CURRICULUM_TYPE;
const meetingDate = ref(null);

const selectedStatus = ref(statusOptions[0]);
const selectedIspublic = ref(ispublicOptions[0]);
const prevIspublic = ref(selectedIspublic.value);

const colleges = ref([]);
const degrees = ref([]);
const filteredDegrees = ref([]);

const selectedStartYear = ref(null);
const startYearOptions = ref([]);

const selectedCurriculumYear = ref(null);
const curriculumYearOptions = ref([]);

const curriculumNameOptions = ref([]);

const typeOptions = ref([]); // [{id,name}]
const selectedTypes = ref([]); // number[]

const selectAllRef = ref(null);
const setSelectAllRef = (el) => (selectAllRef.value = el);

const isSpecific = ref(false); // “หลักสูตรเฉพาะสมาชิก”

// ฟอร์มหลัก (single source of truth)
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
  type_ids: [],
  specific_no: "", // << ใช้ตรงนี้แทน ref แยก
});

/* =========================
 * 5) Computed
 * ========================= */
const endOfToday = computed(() => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
});

const formatToThai = (date) => (date ? dayjs(date).format("DD/MM/BBBB") : "");

const realTypeIds = computed(() =>
  (typeOptions.value || []).filter((t) => t.id !== ALL_ID).map((t) => t.id)
);

const payloadTypeText = computed(() => {
  const sel = (selectedTypes.value || []).map(Number).filter(Number.isFinite);
  if (!sel.length) return "";
  const real = realTypeIds.value;
  const hasAll = sel.includes(ALL_ID);
  const selectedRealCount = new Set(sel.filter((id) => id !== ALL_ID)).size;
  return hasAll || selectedRealCount === real.length
    ? real.join(",")
    : Array.from(new Set(sel.filter((id) => id !== ALL_ID)))
        .sort((a, b) => a - b)
        .join(",");
});

/* =========================
 * 6) Helpers
 * ========================= */
function buildAutoDescription() {
  const typeName = selectedCurriculumType.value?.name?.toString().trim();
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
  form.specific_no = "";
  isSpecific.value = false;

  selectedCollege.value = null;
  selectedDegree.value = null;
  selectedStartYear.value = null;
  selectedCurriculumYear.value = null;
  selectedCurriculum.value = null;
  selectedCurriculumType.value = CURRICULUM_TYPE[0];
  selectedTypes.value = [];
  meetingDate.value = null;

  selectedStatus.value = statusOptions[0];
  selectedIspublic.value = ispublicOptions[0];
}

function notifyError(title, text) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#EF4444",
  });
}

const cleanStr = (v) => (typeof v === "string" ? v.trim() : v);
const textOrUndef = (v) => {
  const s = (v ?? "").toString().trim();
  return s ? s : undefined;
};
const year4OrUndef = (v) => {
  const s = (v ?? "").toString().trim();
  return /^\d{4}$/.test(s) ? s : undefined;
};
const compact = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

function lockBodyScroll(lock) {
  const sbw = window.innerWidth - document.documentElement.clientWidth;
  if (lock) {
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
  } else {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
}

/* ===== Helpers เฉพาะฝั่งแสดงผลในโมดัลรายละเอียด ===== */
function makeCollegeLabel(col) {
  if (!col) return "";
  const campus = (col.campus ?? "").trim();
  return [col.name, campus].filter(Boolean).join("  ");
}
function toIdArray(csvOrArray) {
  if (Array.isArray(csvOrArray))
    return csvOrArray.map(Number).filter(Number.isFinite);
  if (typeof csvOrArray === "string") {
    return csvOrArray
      .split(/[,\uFF0C\u3001\s]+/)
      .map((s) => Number(s.trim()))
      .filter(Number.isFinite);
  }
  return [];
}
function decorateCurriculumForView(raw) {
  const out = { ...raw };

  // college
  if (out.college) {
    out.college_label = makeCollegeLabel(out.college);
  } else if (Number.isFinite(Number(out.college_id))) {
    const found = (colleges.value || []).find(
      (c) => Number(c.id) === Number(out.college_id)
    );
    if (found) {
      out.college = {
        id: found.id,
        name: found.name ?? found.label ?? "",
        campus: found.campus ?? "",
        active: found.active,
      };
      out.college_label = makeCollegeLabel(out.college);
    } else out.college_label = "";
  } else out.college_label = "";

  // degree
  if (out.degree?.name) {
    out.degree_name = out.degree.name;
  } else if (Number.isFinite(Number(out.degree_id))) {
    const d = (filteredDegrees.value || []).find(
      (x) => Number(x.id) === Number(out.degree_id)
    );
    out.degree_name = d?.name ?? "";
    if (d && !out.degree) out.degree = d;
  } else out.degree_name = "";

  // types
  if (!out.types && (out.type || out.type_ids)) {
    const ids = toIdArray(out.type ?? out.type_ids ?? []);
    out.type_ids = ids;
    out.types = ids.map((id) => ({
      id,
      name:
        (typeOptions.value || []).find((t) => t.id === id)?.name || String(id),
    }));
  }

  const realIds = (typeOptions.value || [])
    .map((t) => Number(t.id))
    .filter((id) => Number.isFinite(id) && id !== ALL_ID);

  const arrFromCsvOrArray = (v) => {
    if (Array.isArray(v)) return v.map(Number).filter(Number.isFinite);
    if (typeof v === "string")
      return v
        .split(/[,\uFF0C\u3001\s]+/)
        .map((s) => Number(s.trim()))
        .filter(Number.isFinite);
    return [];
  };

  let ids = [];
  if (out.type_ids) ids = arrFromCsvOrArray(out.type_ids);
  else if (out.type) ids = arrFromCsvOrArray(out.type);

  if ((!ids || !ids.length) && Array.isArray(out.types) && out.types.length) {
    const nameToId = new Map(
      (typeOptions.value || []).map((t) => [
        String(t.name).trim(),
        Number(t.id),
      ])
    );
    ids = out.types
      .map((t) => nameToId.get(String(t.name).trim()))
      .filter(Number.isFinite);
  }

  const idSet = new Set(ids);
  const allSelected =
    realIds.length > 0 && realIds.every((id) => idSet.has(id));

  if (allSelected) {
    out.type_ids = [ALL_ID, ...realIds];
    out.types = [{ id: ALL_ID, name: ALL_LABEL }];
    out.type_display = ALL_LABEL;
  } else {
    const mapIdToName = (id) =>
      (typeOptions.value || []).find((t) => Number(t.id) === Number(id))
        ?.name || String(id);
    out.type_ids = ids;
    out.types = ids.map((id) => ({ id, name: mapIdToName(id) }));
    out.type_display = out.types.map((t) => t.name).join(", ");
  }
  return out;
}

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
    const mapped = raw
      .filter((t) => Number(t.active) === 1)
      .map((t) => ({ id: Number(t.id), name: String(t.type_name) }));
    typeOptions.value = [{ id: ALL_ID, name: ALL_LABEL }, ...mapped];
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
    const params = {
      sort: "institute_group",
      order: "ASC",
      search: search.value.trim(),
      status: 1,
    };
    const res = await getCollegesPaginated(params);
    const rows = res.data?.data || [];
    colleges.value = rows.map((c) => ({
      ...c,
      label: [c.name, (c.campus ?? "").trim()].filter(Boolean).join("  "),
    }));
  } catch (err) {
    console.error("getCollegesPaginated error:", err);
    await notifyError("ไม่สามารถโหลดข้อมูลสถาบัน", "กรุณาลองใหม่อีกครั้ง");
  }
}

/* =========================
 * 8) Watchers (sync form & UI)
 * ========================= */
watch(selectedCollege, (val) => {
  form.college_id = val || "";
});
watch(selectedDegree, (val) => {
  form.degree_id = val?.id || "";
});

watch(
  () => form.start_year,
  (newStart) => {
    const s = parseInt(newStart);
    form.end_year = Number.isFinite(s) ? String(s + (DURATION_YEARS - 1)) : "";
  }
);
watch(
  () => form.end_year,
  (newEnd) => {
    const s = parseInt(form.start_year);
    const e = parseInt(newEnd);
    if (Number.isFinite(s) && Number.isFinite(e) && e < s)
      form.end_year = String(s);
  }
);

watch(selectedStartYear, (y) => {
  form.start_year = Number.isFinite(y) ? String(y) : "";
});
watch(selectedCurriculum, (val) => {
  form.name = val ? String(val).trim() : "";
});
watch([selectedCurriculumType, selectedCurriculumYear], () => {
  form.description = buildAutoDescription();
});

watch(isSpecific, (checked) => {
  if (checked) {
    prevIspublic.value = selectedIspublic.value;
    selectedIspublic.value = ispublicOptions[1]; // ไม่เผยแพร่
  } else {
    selectedIspublic.value = prevIspublic.value ?? ispublicOptions[0];
    form.specific_no = ""; // เคลียร์เมื่อเลิกติ๊ก
  }
});

/* ===== Checkbox “สมาชิกทุกประเภท” ===== */
function onTypeChange(changedId) {
  if (changedId === ALL_ID) {
    const checked = selectedTypes.value.includes(ALL_ID);
    selectedTypes.value = checked ? [ALL_ID, ...realTypeIds.value] : [];
  } else {
    selectedTypes.value = selectedTypes.value.filter((id) => id !== ALL_ID);
    const sel = new Set(selectedTypes.value);
    const real = realTypeIds.value;
    const selectedRealCount = real.filter((id) => sel.has(id)).length;
    if (selectedRealCount === real.length)
      selectedTypes.value = [ALL_ID, ...real];
  }
}
watch(
  [selectedTypes, realTypeIds],
  () => {
    if (!selectAllRef.value) return;
    const sel = new Set(selectedTypes.value);
    const real = realTypeIds.value;
    const selectedRealCount = real.filter((id) => sel.has(id)).length;
    selectAllRef.value.indeterminate =
      selectedRealCount > 0 && selectedRealCount < real.length;
  },
  { deep: true }
);

/* =========================
 * 9) Validation & Submit
 * ========================= */
function validateBeforeSubmit({
  nameTrimmed,
  meetingNoTrimmed,
  startStr,
  endStr,
  meetingDateStr,
}) {
  if (!form.college_id) return { ok: false, msg: "กรุณาเลือกชื่อสถาบัน" };
  if (!nameTrimmed) return { ok: false, msg: "กรุณาเลือกชื่อหลักสูตร" };

  const noYear =
    selectedCurriculumYear.value === null ||
    selectedCurriculumYear.value === undefined;
  if (noYear)
    return {
      ok: false,
      msg: "กรุณาเลือก พ.ศ. หลักสูตร",
      focusId: "curriculum-year",
    };

  if (!form.degree_id) return { ok: false, msg: "กรุณาเลือกระดับการศึกษา" };
  if (!selectedTypes.value.length)
    return { ok: false, msg: "กรุณาเลือก 'หลักสูตรสำหรับ' อย่างน้อย 1 รายการ" };
  if (!meetingNoTrimmed) return { ok: false, msg: "กรุณากรอกมติการประชุม" };
  if (!meetingDate.value) return { ok: false, msg: "กรุณาเลือกวันที่ประชุม" };
  if (dayjs(meetingDate.value).isAfter(dayjs(), "day"))
    return { ok: false, msg: "วันที่ประชุมต้องไม่เกินวันที่ปัจจุบัน" };

  if (!/^\d{4}$/.test(startStr))
    return { ok: false, msg: "ปีที่เริ่มต้นไม่ถูกต้อง" };
  if (endStr && !/^\d{4}$/.test(endStr))
    return { ok: false, msg: "ปีที่สิ้นสุดไม่ถูกต้อง" };
  if (endStr && Number(endStr) < Number(startStr))
    return { ok: false, msg: "ปีที่สิ้นสุดต้องไม่น้อยกว่าปีที่เริ่มต้น" };

  if (isSpecific.value) {
    const digits = (form.specific_no || "").replace(/\D/g, "");
    if (!(digits.length === 13 || digits.length === 14))
      return {
        ok: false,
        msg: "รูปแบบเลขสมาชิกไม่ถูกต้อง (ต้อง 13 หรือ 14 หลัก)",
      };
  }

  return { ok: true };
}

async function saveCurriculum() {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const nameTrimmed = cleanStr(form.name);
    const meetingNoTrimmed = cleanStr(form.meeting_no);
    const descTrimmed = cleanStr(form.description);
    const startStr = (form.start_year ?? "").toString().trim();
    let endStr = (form.end_year ?? "").toString().trim();
    const meetingDateStr = dayjs(meetingDate.value).format("YYYY-MM-DD");

    // validate
    const v = validateBeforeSubmit({
      nameTrimmed,
      meetingNoTrimmed,
      startStr,
      endStr,
      meetingDateStr,
    });
    if (!v.ok) {
      isLoading.value = false;
      await Swal.fire({ icon: "warning", title: v.msg });
      if (v.focusId) document.getElementById(v.focusId)?.focus();
      return;
    }

    // ห้ามเผยแพร่เมื่อเป็นเฉพาะสมาชิก
    const isPublishedEffective = isSpecific.value
      ? false
      : Boolean(selectedIspublic.value?.value);

    const submitData = compact({
      name: nameTrimmed,
      description: textOrUndef(descTrimmed) ?? buildAutoDescription(),
      degree_id: Number(form.degree_id),
      start_year: year4OrUndef(startStr),
      end_year: year4OrUndef(endStr),
      college_id: Number(form.college_id),
      active: Number(selectedStatus.value?.id ?? form.active ?? 1),
      remark: textOrUndef(form.remark),
      meeting_resolution: meetingNoTrimmed,
      is_curriculum_published: isPublishedEffective,
      type: textOrUndef(payloadTypeText.value),
      meeting_date: meetingDateStr,
      specific_no: isSpecific.value
        ? textOrUndef((form.specific_no || "").replace(/\D/g, ""))
        : undefined,
    });

    const res = await addEducation(submitData);

    // ดึงรายละเอียดล่าสุด
    const created = res?.data?.data ?? res?.data?.item ?? res?.data ?? {};
    const createdId =
      created?.id ?? created?.curriculum_id ?? created?.insertId ?? null;

    let detail = created;
    if (createdId) {
      try {
        const r = await getEducationById(createdId);
        detail = r?.data?.data ?? r?.data ?? created;
      } catch (_) {}
    }
    detailCurriculum.value = decorateCurriculumForView(detail);

    await Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      text: "ข้อมูลหลักสูตรถูกเพิ่มเรียบร้อยแล้ว",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    emit("refresh-data");
    props.closeModal?.();
    await nextTick();
    showDetailModal.value = true;
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
        text: "กรุณาตรวจสอบข้อมูล",
      });
    } else {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  } finally {
    isLoading.value = false;
  }
}

/* =========================
 * 10) Detail/Edit modals
 * ========================= */
const showDetailModal = ref(false);
const detailCurriculum = ref(null);
const showEditModal = ref(false);
const editingCurriculum = ref(null);

function closeDetailModal() {
  showDetailModal.value = false;
  detailCurriculum.value = null;
}
function openEditFromDetail(curr) {
  showDetailModal.value = false;
  editingCurriculum.value = { ...(curr || detailCurriculum.value || {}) };
  showEditModal.value = true;
}
function closeEditModal() {
  showEditModal.value = false;
  editingCurriculum.value = null;
}
async function handleEditSaved(e) {
  showEditModal.value = false;
  const id =
    e?.id ?? editingCurriculum.value?.id ?? detailCurriculum.value?.id ?? null;
  editingCurriculum.value = null;

  if (id) {
    try {
      const r = await getEducationById(id);
      const fresh = r?.data?.data ?? r?.data ?? {};
      detailCurriculum.value = decorateCurriculumForView(fresh);
    } catch {
      const merged = {
        ...(detailCurriculum.value || {}),
        ...(e?.atch || {}),
        id,
      };
      detailCurriculum.value = decorateCurriculumForView(merged);
    }
  }
  showDetailModal.value = true;
  emit("refresh-data", e);
}

/* =========================
 * 11) Open modal flow + lifecycle
 * ========================= */
watch(
  () => props.showModal,
  async (open) => {
    if (!open) return;

    if (!props.curriculum) clearForm();

    isLoading.value = true;
    try {
      await Promise.all([
        fetchDegrees(),
        fetchColleges(),
        fetchCurriculum(),
        fetchStartYears(),
        fetchTypes(), // จำเป็นสำหรับคำนวณ "ครบทุกประเภท"
      ]);

      // preload selections (โหมดแก้ไข)
      if (props.curriculum) {
        const collegeId = Number(
          props.curriculum.college_id ?? props.curriculum.college?.id
        );
        if (Number.isFinite(collegeId)) selectedCollege.value = collegeId;

        const degreeId = Number(
          props.curriculum.degree_id ?? props.curriculum.degree?.id
        );
        if (Number.isFinite(degreeId)) {
          const found = (filteredDegrees.value || []).find(
            (d) => Number(d.id) === degreeId
          );
          if (found) selectedDegree.value = found;
        }
      }

      // โหลด type ที่เคยเลือก
      let existing = [];
      const csv = props.curriculum?.type ?? props.curriculum?.types ?? null;
      if (typeof csv === "string") {
        existing = csv
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => Number.isFinite(n));
      } else if (Array.isArray(props.curriculum?.type_ids)) {
        existing = props.curriculum.type_ids
          .map((n) => Number(n))
          .filter((n) => Number.isFinite(n));
      }
      const real = realTypeIds.value;
      const allSelected =
        real.length > 0 && real.every((id) => existing.includes(id));
      selectedTypes.value = allSelected ? [ALL_ID, ...real] : existing;
    } finally {
      isLoading.value = false;
    }
  }
);

watch(
  () => props.showModal,
  (open) => lockBodyScroll(open),
  { immediate: true }
);
onBeforeUnmount(() => lockBodyScroll(false));
</script>


