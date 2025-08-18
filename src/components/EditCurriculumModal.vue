<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-gray-700"
  >
    <div
      class="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-auto p-6 relative"
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
          แก้ไขข้อมูลหลักสูตร
        </h1>
      </div>

      <!-- Form Card -->
      <form
        @submit.prevent="updateCurriculum"
        class="space-y-4"
      >
        <!-- form fields เหมือนเดิม ... -->
        <div class="mb-4 relative">
            <label class="block font-bold mb-1">
            สถาบันการศึกษา <span class="text-red-500">*</span>
          </label>
          <v-select
            v-model="form.college_id"
            :options="colleges"
            label="name"
            :reduce="(college) => college.id"
            placeholder="เลือกสถาบันการศึกษา"
            required
          />
        </div>
        <!-- ชื่อหลักสูตร -->
        <div>
            <label class="block font-bold mb-1"
            >ชื่อหลักสูตร <span class="text-red-500">*</span></label
          >
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border px-4 py-2 rounded-xl"
            placeholder="กรอกชื่อหลักสูตร"
          />
        </div>
        <div>
          <label class="block font-bold mb-1"
            >หลักสูตร <span class="text-red-500">*</span></label
          >
          <input
            v-model="form.description"
            type="text"
            required
            class="w-full border px-4 py-2 rounded-xl"
            placeholder="กรอกหลักสูตร"
          />
        </div>

        <div>
          <label class="block font-bold mb-1">รายละเอียด</label>
          <textarea
            v-model="form.remark"
            rows="2"
            class="w-full border px-4 py-2 rounded-xl resize-none"
          ></textarea>
        </div>

        <!-- ระดับการศึกษา -->
        <div class="mb-4 relative">
          <label class="block font-bold mb-1">
            ระดับการศึกษา <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.degree_id"
            class="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          >
            <option value="">กรุณาเลือกระดับการศึกษา</option>
            <option
              v-for="degree in degrees"
              :key="degree.id"
              :value="degree.id"
            >
              {{ degree.name }}
            </option>
          </select>
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
              @focus="handleFocus('start_year')"
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
              @focus="handleFocus('end_year')"
              @blur="limitYear('end_year')"
              class="w-full border px-4 py-2 rounded-xl"
              placeholder="เช่น 2570"
              required
            />
          </div>

          <!-- สถานะ -->
          <div>
            <label class="block font-bold mb-1">สถานะ</label>
            <select
              v-model="form.active"
              class="w-full border px-4 py-2 rounded-xl bg-white"
            >
              <option value="1">ใช้งาน</option>
              <option value="0">ไม่ใช้งาน</option>
            </select>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
          >
            <span v-if="!isLoading">บันทึก</span>
            <span v-else>บันทึก...</span>
          </button>
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
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
import {
  updateEducation,
  getColleges,
  getDegrees,
} from "@/services/apiService";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css"; // ต้อง import CSS ด้วย

const props = defineProps({
  showModal: Boolean,
  closeModal: Function,
  curriculum: Object, // ข้อมูลหลักสูตรที่จะนำมาแก้ไข
});

const isLoading = ref(false);
const colleges = ref([]);
const degrees = ref([]);
const emit = defineEmits(["refreshData"]);
const form = reactive({
  name: "",
  description: "",
  degree_id: "",
  start_year: "",
  end_year: "",
  college_id: "",
  active: 1,
  remark: "",
});

watch(
  [() => props.curriculum, () => props.showModal],
  async ([newCurriculum, newShowModal]) => {
    if (newShowModal) {
      await fetchColleges();
      await fetchDegrees();

      if (newCurriculum) {
        Object.assign(form, {
          name: newCurriculum.name || "",
          description: newCurriculum.description || "",
          degree_id: newCurriculum.degree_id || "",
          degree_name: newCurriculum.degree?.name || "", // ✅ เพิ่ม
          start_year: newCurriculum.start_year || "",
          end_year: newCurriculum.end_year || "",
          college_id: newCurriculum.college_id || "",
          college_name: newCurriculum.college?.name || "", // ✅ เพิ่ม
          active: newCurriculum.active ?? 1,
          remark: newCurriculum.remark || "",
          college_id: newCurriculum.college_id || null,
          degree_id: newCurriculum.degree_id || null,
        });
      } else {
        clearForm();
      }
    }
  }
);

const oldValue = ref(""); // เก็บค่าเดิมตอน focus

function handleFocus(field) {
  oldValue.value = form[field]; // เก็บค่าเดิมไว้
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

    // คืนค่าเดิม
    form[field] = oldValue.value;
  }
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
}

async function updateCurriculum() {
  console.log("Updating curriculum:", form);
  // return;
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

  if (start > end) {
    Swal.fire({ icon: "warning", title: "ปีเริ่มต้นต้องน้อยกว่าปีสิ้นสุด" });
    return;
  }

  isLoading.value = true;

  try {
    // เรียก API patch อัพเดตข้อมูลหลักสูตร โดยส่ง id ไปด้วย
    await updateEducation(props.curriculum.id, {
      name: form.name,
      description: form.description,
      degree_id: parseInt(form.degree_id),
      college_id: parseInt(form.college_id),
      start_year: form.start_year.toString(),
      end_year: form.end_year.toString(),
      active: parseInt(form.active),
      remark: form.remark,
    });

    Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    emit("refreshData");
    console.log("Emitted refreshData");

    props.closeModal();
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
    });
  } finally {
    isLoading.value = false;
  }
}

// Fetch colleges
async function fetchColleges() {
  try {
    const res = await getColleges();
    colleges.value = res.data?.data || [];

    // ถ้าต้องการจัดเรียง (ตัวอย่างเรียงตาม id)
    colleges.value = colleges.value.sort((a, b) => a.id - b.id);
  } catch {
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถโหลดข้อมูลสถาบันการศึกษา",
      text: "กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
    });
  }
}

// Fetch degrees
async function fetchDegrees() {
  try {
    const res = await getDegrees();
    const data = res.data?.data || [];

    // ถ้าต้องการจัดเรียง (ตัวอย่างเรียงตาม id)
    degrees.value = data.sort((a, b) => a.id - b.id);
  } catch (err) {
    console.error("Error fetching degrees:", err);
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถโหลดข้อมูลระดับการศึกษา",
      text: "กรุณาลองใหม่อีกครั้ง",
      confirmButtonColor: "#EF4444",
    });
  }
}
</script>
