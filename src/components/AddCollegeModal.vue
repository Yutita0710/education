<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div
      class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative overflow-y-auto max-h-screen"
    >
      <!-- <div
      class="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-auto p-6 relative"
    > -->
      <!-- Close button (มุมขวาบน) -->
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
      <h2 class="text-xl font-bold text-center mb-4">
        เพิ่มข้อมูลสถาบันการศึกษา
      </h2>

      <!-- Form -->
      <form @submit.prevent="saveCurriculum" class="space-y-4">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">
            <span class="flex items-center gap-1 font-bold">
              ชื่อสถาบันการศึกษา
              <span class="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
            placeholder="กรอกชื่อสถาบันการศึกษา"
          />
        </div>
        <div>
          <label for="countries" class="block mb-2 font-medium text-gray-900"
            >สถานะ</label
          >
          <select
            v-model="form.active"
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="1">&nbsp;&nbsp;&nbsp;ใช้งาน</option>
            <option value="0">&nbsp;&nbsp;&nbsp;ไม่ใช้งาน</option>
          </select>
        </div>
        <!-- ส่วนปุ่ม action -->
        <div class="flex justify-center gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
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
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6 mr-2"
            >
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>

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
  addEducationCollege,
  checkCollegeNameExists,
} from "@/services/apiService";

const props = defineProps({
  showModal: Boolean,
  closeModal: Function,
});
const isLoading = ref(false);

const form = reactive({
  name: "",
  active: 1,
});

function clearForm() {
  form.name = "";
  form.active = 1;
}

watch(
  () => props.showModal,
  (newVal) => {
    if (newVal) {
      clearForm();
    }
  }
);


async function saveCurriculum() {
  const nameTrimmed = form.name.trim();
  if (!nameTrimmed) {
    Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อสถาบันการศึกษา" });
    return;
  }

  // ตรวจสอบซ้ำด้วย try/catch
  try {
    const resp = await checkCollegeNameExists(nameTrimmed);
    if (resp.data?.statusCode === 400) {
      Swal.fire({
        icon: "warning",
        title: "ชื่อสถาบันศึกษาซ้ำกับชื่อสถาบันอื่น",
        text: "กรุณากรอกชื่อสถาบันใหม่",
      });
      return;
    }
  } catch (err) {
    console.error("Error checking duplicate:", err);
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถตรวจสอบชื่อสถาบันได้",
      text: "กรุณาลองใหม่อีกครั้ง",
    });
    return;
  }

  // เริ่มบันทึกข้อมูล
  isLoading.value = true;
  try {
    await addEducationCollege({ ...form, active: parseInt(form.active) });
    await Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    clearForm();
    props.closeModal();
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถบันทึกข้อมูลได้",
      text: "กรุณาลองใหม่อีกครั้ง",
    });
  } finally {
    isLoading.value = false;
  }
}


</script>
