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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 mr-2">
          <path fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">แก้ไขข้อมูลหลักสูตร</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="updateCurriculum" class="space-y-4">
        <!-- สถาบันการศึกษา -->
        <div class="mb-4">
          <label class="block font-bold mb-1">สถาบันการศึกษา <span class="text-red-500">*</span></label>
          <v-select
            v-model="form.college_id"
            :options="colleges"
            label="name"
            :reduce="(c) => c.id"
            placeholder="เลือกสถาบันการศึกษา"
            :disabled="isLoading"
            required
          />
        </div>

        <!-- ชื่อหลักสูตร -->
        <div>
          <label class="block font-bold mb-1">ชื่อหลักสูตร <span class="text-red-500">*</span></label>
          <input
            v-model.trim="form.name"
            type="text"
            class="w-full border px-4 py-2 rounded-xl"
            placeholder="กรอกชื่อหลักสูตร"
            required
          />
        </div>

        <!-- หลักสูตร (คำอธิบายสั้น) -->
        <div>
          <label class="block font-bold mb-1">หลักสูตร <span class="text-red-500">*</span></label>
          <input
            v-model.trim="form.description"
            type="text"
            class="w-full border px-4 py-2 rounded-xl"
            placeholder="กรอกหลักสูตร เช่น หลักสูตร/ปี พ.ศ."
            required
          />
        </div>

        <!-- รายละเอียดเพิ่ม -->
        <div>
          <label class="block font-bold mb-1">รายละเอียด</label>
          <textarea v-model.trim="form.remark" rows="2" class="w-full border px-4 py-2 rounded-xl resize-none" />
        </div>

        <!-- ระดับการศึกษา -->
        <div class="mb-4">
          <label class="block font-bold mb-1">ระดับการศึกษา <span class="text-red-500">*</span></label>
          <v-select
            v-model="form.degree_id"
            :options="degrees"
            label="name"
            :reduce="(d) => d.id"
            placeholder="กรุณาเลือกระดับการศึกษา"
            :disabled="isLoading"
            required
          />
        </div>

        <!-- วันที่ประชุม (คงไว้หาก backend รองรับ) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label class="block font-bold mb-1">มติการประชุมครั้งที่</label>
            <input
              v-model.trim="form.meeting_no"
              type="text"
              class="w-full border px-4 py-2 rounded-xl"
              placeholder="เช่น 1/2568"
            />
          </div>
          <div>
            <label class="block font-bold mb-1">วันที่ประชุม</label>
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

        <!-- ปีเริ่ม-สิ้นสุด + สถานะ -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label class="block font-bold mb-1">ปีเริ่มต้น (พ.ศ.) <span class="text-red-500">*</span></label>
            <input
              v-model="form.start_year"
              type="text"
              @focus="handleFocus('start_year')"
              @blur="limitYear('start_year')"
              class="w-full border px-4 py-2 rounded-xl"
              placeholder="เช่น 2568"
              required
            />
          </div>
          <div>
            <label class="block font-bold mb-1">ปีสิ้นสุด (พ.ศ.) <span class="text-red-500">*</span></label>
            <input
              v-model="form.end_year"
              type="text"
              @focus="handleFocus('end_year')"
              @blur="limitYear('end_year')"
              class="w-full border px-4 py-2 rounded-xl"
              placeholder="เช่น 2572"
              required
            />
          </div>
          <div>
            <label class="block font-bold mb-1">สถานะการใช้งาน</label>
            <select v-model="form.active" class="w-full border px-4 py-2 rounded-xl bg-white">
              <option :value="1">ใช้งาน</option>
              <option :value="0">ไม่ใช้งาน</option>
            </select>
          </div>
        </div>

        <!-- ปุ่ม -->
        <div class="flex justify-center gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-[#0085DB] hover:bg-[#0085DB]/90 text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <span v-if="!isLoading">บันทึก</span>
            <span v-else>บันทึก...</span>
          </button>
          <button
            type="button"
            @click="closeModal"
            class="bg-[#F95668] hover:bg-[#F95668]/80 text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
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
import Swal from "sweetalert2";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

// API
import {
  updateEducation,
  getCollegesPaginated,
  getDegrees,
} from "@/services/apiService";

const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, default: () => {} },
  curriculum: { type: Object, default: null }, // ข้อมูลเดิมของหลักสูตร
});
const emit = defineEmits(["refresh-data"]);

const isLoading = ref(false);
const colleges = ref([]);
const degrees = ref([]);
const meetingDate = ref(null); // Date | null

// เก็บค่าเดิมขณะ focus (ใช้คืนค่าเมื่อรูปแบบไม่ถูกต้อง)
const oldValue = ref("");

// ฟอร์มแก้ไข
const form = reactive({
  name: "",
  description: "",
  degree_id: null,
  start_year: "",
  end_year: "",
  college_id: null,
  active: 1,
  remark: "",
  meeting_no: "",
});

// ---------- Utils ----------
const formatToThai = (d) => (d ? dayjs(d).add(543, "year").format("DD/MM/YYYY") : "");
const toDateOrNull = (val) => (val ? dayjs(val).toDate() : null);
const formatToBuddhistDateObj = (d) => (d ? dayjs(d).startOf("day").toDate() : null);

// ตรวจตัวเลขปี 4 หลัก
function handleFocus(field) {
  oldValue.value = form[field];
}
function limitYear(field) {
  const value = String(form[field] ?? "");
  if (!/^\d{4}$/.test(value)) {
    Swal.fire({
      title: "รูปแบบไม่ถูกต้อง",
      text: "กรุณากรอกปีเป็นตัวเลข 4 หลัก",
      icon: "warning",
      confirmButtonText: "ตกลง",
    });
    form[field] = oldValue.value; // คืนค่าเดิม
  }
}

// Auto คุมความสัมพันธ์ start/end
watch(
  () => form.start_year,
  (v) => {
    const start = parseInt(v);
    const end = parseInt(form.end_year);
    if (Number.isFinite(start)) {
      // ถ้ายังไม่ตั้ง end หรือ end < start → ตั้ง end = start + 4
      if (!Number.isFinite(end) || end < start) {
        form.end_year = String(start + 4);
      }
    }
  }
);

// ---------- Loaders ----------
async function fetchColleges() {
  try {
    const res = await getCollegesPaginated({ sort: "id", order: "ASC" });
    colleges.value = (res?.data?.data || []).sort((a, b) => a.id - b.id);
  } catch (e) {
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถโหลดข้อมูลสถาบันการศึกษา",
      text: "กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
    });
  }
}
async function fetchDegrees() {
  try {
    const res = await getDegrees();
    degrees.value = (res?.data?.data || []).sort((a, b) => a.id - b.id);
  } catch (e) {
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถโหลดข้อมูลระดับการศึกษา",
      text: "กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
    });
  }
}

// ---------- Populate on open ----------
watch(
  () => props.showModal,
  async (open) => {
    if (!open) return;

    isLoading.value = true;
    try {
      await Promise.all([fetchColleges(), fetchDegrees()]);

      // เติมค่าเริ่มต้นจาก curriculum
      const c = props.curriculum || {};
      form.name = c.name || "";
      form.description = c.description || "";
      form.degree_id = c.degree_id ?? c.degree?.id ?? null;
      form.college_id = c.college_id ?? c.college?.id ?? null;
      form.start_year = c.start_year ? String(c.start_year) : "";
      form.end_year = c.end_year ? String(c.end_year) : "";
      form.active = Number.isFinite(+c.active) ? +c.active : 1;
      form.remark = c.remark || "";
      form.meeting_no = c.meeting_resolution || c.meeting_no || "";

      // meeting_date (ถ้ามี) -> DatePicker
      meetingDate.value = toDateOrNull(c.meeting_date);
    } finally {
      isLoading.value = false;
    }
  }
);

// ---------- Submit ----------
async function updateCurriculum() {
  // ตรวจ required เบื้องต้น
  if (!form.name?.trim()) {
    Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อหลักสูตร" });
    return;
  }
  if (!form.description?.trim()) {
    Swal.fire({ icon: "warning", title: "กรุณากรอกหลักสูตร" });
    return;
  }
  if (!form.degree_id || !form.college_id || !form.start_year || !form.end_year) {
    Swal.fire({ icon: "warning", title: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    return;
  }
  const start = parseInt(form.start_year);
  const end = parseInt(form.end_year);
  if (Number.isFinite(start) && Number.isFinite(end) && end < start) {
    Swal.fire({ icon: "warning", title: "ปีสิ้นสุดต้องไม่น้อยกว่าปีเริ่มต้น" });
    return;
  }

  isLoading.value = true;
  try {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      degree_id: Number(form.degree_id),
      college_id: Number(form.college_id),
      start_year: String(form.start_year),
      end_year: String(form.end_year),
      active: Number(form.active),
      remark: form.remark ?? "",
      // mapping เพิ่มเติมตาม backend
      meeting_resolution: form.meeting_no ?? "",
      meeting_date: formatToBuddhistDateObj(meetingDate.value),
    };

    await updateEducation(props.curriculum.id, payload);

    await Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      timer: 1400,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    // แจ้ง parent ให้รีเฟรชตาราง (ใช้ชื่ออีเวนต์เดียวกับฝั่ง list)
    emit("refresh-data");
    props.closeModal();
  } catch (err) {
    const status = err?.response?.status ?? err?.response?.data?.statusCode ?? null;
    const rawMessage = err?.response?.data?.message ?? err?.message;
    const messageText = Array.isArray(rawMessage) ? rawMessage.join("\n") : String(rawMessage || "");

    if (status === 400) {
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
</script>

<style scoped>
/* สามารถเพิ่มสไตล์เฉพาะจุดได้ */
</style>
