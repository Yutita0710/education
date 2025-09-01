
<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div
      class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative overflow-y-auto max-h-[90vh]"
      @click.stop
    >
      <!-- Close button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-8 mr-2"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          เพิ่มข้อมูลหลักสูตร
        </h1>
      </div>
      <!-- <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <div class="text-blue-500 mr-3 mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6 mr-2"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="font-bold text-blue-800">
            <p class="mb-1">คำแนะนำในการกรอกข้อมูล:</p>
            <ul class="list-disc list-inside space-y-1 text-blue-700">
              <li>กรอกข้อมูลให้ครบถ้วนในช่องที่มีเครื่องหมาย * (บังคับ)</li>
              <li>ปีที่กรอกควรเป็นปี พ.ศ. (เช่น 2568)</li>
              <li>ตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก</li>
            </ul>
          </div>
        </div>
      </div> -->
      <!-- Form Card -->
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
            v-model="selectedCurriculumId"
            :options="curriculumOptions"
            label="name"
            :reduce="(opt) => opt.id"
            :disabled="isLoading || !curriculumOptions.length"
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
            <input
              v-model="form.description"
              type="text"
              required
              class="w-full border px-4 py-2 rounded-xl"
              placeholder="กรอกหลักสูตร"
            />
          </div>

          <!-- พ.ศ. -->
          <div class="flex flex-row items-center gap-2 w-full">
            <label class="whitespace-nowrap">พ.ศ.</label>
            <input
              type="text"
              required
              class="flex-1 border px-4 py-2 rounded-xl items-end"
              placeholder="กรอก พ.ศ."
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
          <label class="block font-bold mb-1"
            >หลักสูตรสำหรับ <span class="text-red-500">*</span></label
          >
          <ul
            class="items-center w-full text-sm font-medium text-gray-900 bg-white sm:flex"
          >
            <li class="w-full">
              <div class="flex items-center ps-3">
                <input
                  id="vue-checkbox-list"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                />
                <label
                  for="vue-checkbox-list"
                  class="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >สมาชิกทุกประเภท</label
                >
              </div>
            </li>
            <li class="w-full">
              <div class="flex items-center ps-3">
                <input
                  id="react-checkbox-list"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                />
                <label
                  for="react-checkbox-list"
                  class="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >สมาชิกสามัญ</label
                >
              </div>
            </li>
            <li class="w-full">
              <div class="flex items-center ps-3">
                <input
                  id="angular-checkbox-list"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                />
                <label
                  for="angular-checkbox-list"
                  class="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >สมาชิกวิสามัญ</label
                >
              </div>
            </li>
            <li class="w-full">
              <div class="flex items-center ps-3">
                <input
                  id="laravel-checkbox-list"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                />
                <label
                  for="laravel-checkbox-list"
                  class="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                  >สมาชิกสมทบ</label
                >
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
          <!-- ปีเริ่มต้น -->
          <div>
            <label class="block font-bold mb-1">
              ปีเริ่มต้น (พ.ศ.) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.start_year"
              type="text"
              @blur="limitYear('start_year')"
              class="w-full border px-4 py-2 rounded-xl"
              placeholder="เช่น 2568"
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
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import {
  addEducation,
  getCollegesPaginated,
  getDegrees,
  getEducationPaginated,
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
const selectedCollege = ref(null);
const selectedDegree = ref(null);
// ค่าที่ผู้ใช้เลือก (เก็บเป็น id ของหลักสูตร)
const selectedCurriculumId = ref(null);

// ตัวเลือกใน v-select (แสดงชื่อหลักสูตร)
const curriculumOptions = ref([]);

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
  degree_id: "",
  start_year: "",
  end_year: "",
  college_id: "",
  active: 1,
});
console.log("form", form);
function onDegreeChange(event) {
  const selectedValue = event.target.value;
  const numberValue = selectedValue ? Number(selectedValue) : null;

  form.degree_id = numberValue;

  console.log("👉 selectedValue:", selectedValue); // "5" (string)
  console.log("👉 numberValue:", numberValue); // 5 (number)
  console.log("👉 form.degree_id:", form.degree_id); // 5
}

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
  form.college_id = val || "";
});
watch(selectedDegree, (val) => {
  form.degree_id = val || "";
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

watch(
  () => props.showModal,
  (newVal) => {
    if (newVal) {
      fetchDegrees();
      fetchColleges();
      fetchCurriculum(1, {});

      if (!props.curriculum) clearForm(); // รีเซ็ตเฉพาะตอนเปิด modal ใหม่
    }
  }
);

async function saveCurriculum() {
  console.log("form", form);
  if (!form.name.trim()) {
    Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อหลักสูตร" });
    return;
  }

  if (
    !form.degree_id ||
    !form.college_id ||
    !form.start_year ||
    !form.end_year
  ) {
    Swal.fire({ icon: "warning", title: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    return;
  }

  const start = parseInt(form.start_year);
  const end = parseInt(form.end_year);
  const diff = end - start;

  if (start >= end) {
    Swal.fire({ icon: "warning", title: "ปีเริ่มต้นต้องน้อยกว่าปีสิ้นสุด" });
    return;
  }

  if (diff > 10) {
    const confirm = await Swal.fire({
      icon: "question",
      title: `ช่วงปี ${diff} ปี ดูยาวเกินไป`,
      text: "คุณต้องการดำเนินการต่อหรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });
    if (!confirm.isConfirmed) return;
  }

  isLoading.value = true;

  try {
    const submitData = {
      ...form,
      degree_id: parseInt(form.degree_id),
      start_year: form.start_year.toString(),
      end_year: form.end_year.toString(),
      college_id: parseInt(form.college_id),
      active: parseInt(form.active),
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
    emit("refresh-data"); // ส่งสัญญาณให้ parent โหลดใหม่
    props.closeModal();
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
      timerProgressBar: true,
    });
  } finally {
    isLoading.value = false;
  }
}

// AddCurriculumModal.vue (หรือที่เรียกใช้)
async function fetchCurriculum(page = 1, filters = {}) {
  try {
    // ❌ อย่าเติม sort เป็น 'id'
    // ✅ ไม่ใส่ sort เลย หรือใส่เป็น "0"/"1" เท่านั้น
    const res = await getEducationPaginated(page, undefined, {
      ...filters,
      // ตัวอย่าง: sort เป็น index (ถ้าต้องการ)
      // sort: "0",           // <= ส่งเฉพาะเมื่อมั่นใจว่า API ต้องการค่าดัชนี
      // order: "ASC",
    });
console.log("Curriculums", res);
    const list = Array.isArray(res?.data?.data) ? res.data.data : [];
    curriculumOptions.value = list.map((c) => ({ id: c.id, name: c.name }));
  } catch (err) {
    console.error("❌ API error payload:", err?.response?.data || err);
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
</script>
