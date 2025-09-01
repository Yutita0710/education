<template>
  <div class="text-[#707781]">
    <div class="mb-2 flex justify-start">
      <p class="text-lg font-bold mb-3 sm:mb-0">
        จำนวน
        {{
          Number(
            props.total ?? props.meta?.total ?? props.curriculums?.length ?? 0
          ).toLocaleString("th-TH-u-nu-latn")
        }}
        หลักสูตร
      </p>
    </div>
    <!-- ตาราง (Responsive) -->
    <div
      class="overflow-x-auto md:overflow-x-hidden border border-gray-300 rounded-lg"
    >
      <table
        class="w-full font-bold border-collapse border border-[gray-300] sm:text-base font-bold"
      >
        <thead>
          <tr class="bg-[#E2EDFC]">
            <th class="border px-2 py-[0.7rem] font-bold">ลำดับ</th>
            <th class="border px-2 py-[0.7rem] font-bold">
              ชื่อสถาบันการศึกษา
            </th>
            <th class="border px-2 py-[0.7rem] font-bold">ชื่อหลักสูตร</th>
            <th class="border px-2 py-[0.7rem] font-bold">หลักสูตร</th>
            <th class="border px-2 py-[0.7rem] font-bold">ระดับการศึกษา</th>
            <th class="border px-2 py-[0.7rem] font-bold">หลักสูตรสำหรับ</th>
            <th class="border px-2 py-[0.7rem] font-bold">ปีเริ่มต้น</th>
            <th class="border px-2 py-[0.7rem] font-bold">ปีสิ้นสุด</th>
            <th class="border px-2 py-[0.7rem] font-bold">รายละเอียด</th>
            <th v-if="isAdmin" class="border px-2 py-[0.7rem] font-bold">
              สถานะ
            </th>
            <th
              v-if="isAdmin"
              class="border px-2 py-[0.7rem] font-bold font-bold"
            >
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in props.curriculums"
            :key="item.id"
            class="hover:bg-gray-50 text-gray-600"
          >
            <!-- ลำดับ -->
            <td class="border px-2 py-1 text-center">
              {{ meta.per_page * (meta.current_page - 1) + index + 1 }}
            </td>

            <!-- ชื่อสถาบันการศึกษา -->
            <td class="border px-2 py-1">
              {{ item.college?.name || "" }}
            </td>

            <!-- ชื่อหลักสูตร -->
            <td class="border px-2 py-1">
              {{ item.name }}
            </td>

            <!-- คำอธิบายหลักสูตร -->
            <td class="border px-2 py-1">
              {{ item.description || "" }}
            </td>

            <!-- ระดับการศึกษา -->
            <td class="border px-2 py-1 text-center">
              {{ item.degree?.name }}
            </td>

            <!-- สําหรับสมาชิก -->
            <td class="border px-2 py-1 text-center">
              <!-- {{ item.type}} -->
            </td>
            <!-- ปีเริ่มต้น -->
            <td class="border px-2 py-1 text-center">
              {{ item.start_year || "" }}
            </td>

            <!-- ปีสิ้นสุด -->
            <td class="border px-2 py-1 text-center">
              {{ item.end_year || "" }}
            </td>

            <td class="border px-2 py-1">{{ item.remark }}</td>

            <!-- สถานะ (admin เท่านั้น) -->
            <td
              v-if="isAdmin"
              class="border px-2 py-1 text-center items-center"
            >
              <div
                class="flex text-center justify-center items-center gap-x-4 text-xs"
              >
                <a
                  class="relative z-10 rounded-full px-3 py-1.5 font-medium"
                  :class="
                    item.active
                      ? 'bg-[#09C97F1A] text-[#09C97F] font-semibold'
                      : 'bg-[#FB977D1A] text-[#FB977D] font-semibold'
                  "
                >
                  {{ item.active ? "Active" : "Inactive" }}
                </a>
              </div>
            </td>

            <td
              v-if="isAdmin"
              class="border px-2 py-1 text-center items-center"
            >
              <button
                @click="openEditModal(item)"
                class="inline-flex items-center bg-orange-400 text-white px-2 py-2 rounded-full hover:bg-orange-500 transition"
                :disabled="isUpdating"
              >
                <!-- ไอคอนดินสอ -->
                <svg
                  v-if="!isUpdating"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <!-- Loading spinner -->
                <svg
                  v-else
                  class="animate-spin size-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <EditCurriculumModal
    :showModal="showEditModal"
    :curriculum="selectedCurriculum"
    :closeModal="closeEditModal"
    @close="closeEditModal"
    @update="handleUpdateCurriculum"
    @refreshData="handleRefreshData"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import EditCurriculumModal from "./EditCurriculumModal.vue";
import { updateEducation } from "@/services/apiService";

const isAdmin = localStorage.getItem("token") ? true : false;
// ✅ ประกาศ emits ให้ครบ
const emit = defineEmits(["refreshData", "edit"]);
const props = defineProps({
  curriculums: { type: Array, required: true },
  meta: { type: Object, required: true },
  isAdmin: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
});

// ------ Modal (ถ้าให้ DataTable จัดการโมดอลเอง) ------
const isUpdating = ref(false);
const showEditModal = ref(false);
const selectedCurriculum = ref(null);

function openEditModal(item) {
  selectedCurriculum.value = { ...item };
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  selectedCurriculum.value = null;
}

async function handleUpdateCurriculum(updatedData) {
  isUpdating.value = true;
  try {
    const { id, ...data } = updatedData;
    await updateEducation(id, data);

    await Swal.fire({
      icon: "success",
      title: "อัปเดตข้อมูลสำเร็จ",
      text: "ข้อมูลหลักสูตรได้รับการอัปเดตเรียบร้อยแล้ว",
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    closeEditModal();
    emit("refreshData"); // ✅ ให้ parent โหลดข้อมูลใหม่
  } catch (error) {
    let errorMessage = "ไม่สามารถอัปเดตข้อมูลหลักสูตรได้ กรุณาลองใหม่อีกครั้ง";
    if (error?.response) {
      if (error.response.status === 422)
        errorMessage = "ข้อมูลที่กรอกไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
      else if (error.response.status === 404)
        errorMessage = "ไม่พบข้อมูลหลักสูตรที่ต้องการแก้ไข";
      else if (error.response.status === 403)
        errorMessage = "คุณไม่มีสิทธิ์ในการแก้ไขข้อมูลนี้";
      else if (error.response.status === 500)
        errorMessage = "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
      if (error.response.data)
        console.error("Error details:", error.response.data);
    }
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: errorMessage,
      confirmButtonColor: "#EF4444",
    });
  } finally {
    isUpdating.value = false;
  }
}

// ✅ proxy ให้ parent
const handleRefreshData = () => emit("refreshData");
</script>


