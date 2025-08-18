<template>
  <div
    v-for="group in paginatedGroups"
    :key="group.degree.id"
    class="px-4 sm:px-8 md:px-4 lg:px-4 xl:px-20 text-gray-700"
  >
    <!-- หัวข้อแต่ละกลุ่ม -->
    <h2 class="text-lg font-bold mb-3">
      {{ group.degree.name }} ({{ group.total }} หลักสูตร)
    </h2>

    <!-- ตาราง (Responsive) -->
    <div class="overflow-x-auto">
      <table
        class="w-full font-bold border-collapse border border-[gray-300] sm:text-base font-bold"
      >
        <thead>
          <tr class="bg-[#F0F5F9]">
            <th class="border px-2 py-[1rem]  font-bold whitespace-nowrap w-[60px]">ลำดับ</th>
            <th class="border px-2 py-[1rem]  font-bold whitespace-nowrap w-[400px]">
              ชื่อสถาบันการศึกษา
            </th>
            <th class="border px-2 py-[1rem]  font-bold whitespace-nowrap w-[300px]">
              ชื่อหลักสูตร
            </th>
            <th class="border px-2 py-[1rem]  font-bold whitespace-nowrap w-[200px]">
              หลักสูตร
            </th>
            <th class="border px-2 py-[1rem]  font-bold whitespace-nowrap w-[100px]">
              ปีเริ่มต้น
            </th>
            <th class="border px-2 py-[1rem]  font-bold whitespace-nowrap w-[100px]">
              ปีสิ้นสุด
            </th>
            <th
              v-if="isAdmin"
              class="border px-2 py-[1rem]  font-bold whitespace-nowrap w-[100px]"
            >
              สถานะ
            </th>
            <th class="border px-2 py-[1rem]  font-bold w-[100px]">รายละเอียด</th>
            <th
              v-if="isAdmin"
              class="border px-2 py-[1rem]  font-bold font-bold whitespace-nowrap w-[100px]"
            >
              แก้ไข
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in group.paginatedItems"
            :key="item.id"
            class="hover:bg-gray-50 text-gray-600"
          >
            <td class="border px-2 py-1 text-center">
              {{ index + 1 + (currentPages[group.degree.id] - 1) * limit }}
            </td>
            <td class="border px-2 py-1 whitespace-normal break-words">
              {{ item.college.name }}
              <template v-if="isAdmin">
                <span
                  v-if="item.college.active === 1"
                  class="bg-[#09C97F1A] text-[#09C97F] text-xs font-semibold px-2.5 py-0.5 rounded-full"
                >
                  Active
                </span>
                <span
                  v-else
                  class="bg-[#FB977D1A] text-[#FB977D] text-xs font-semibold px-2.5 py-0.5 rounded-full"
                >
                  Inactive
                </span>
              </template>
            </td>
            <td class="border px-2 py-1 whitespace-normal break-words">
              {{ item.name }}
            </td>
            <td class="border px-2 py-1 whitespace-normal break-words">
              {{ item.description }}
            </td>
            <td class="border px-2 py-1 text-center">{{ item.start_year }}</td>
            <td class="border px-2 py-1 text-center">{{ item.end_year }}</td>
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
            <td class="border px-2 py-1 truncate">{{ item.remark }}</td>

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

    <!-- Pagination -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 bg-white px-4 py-3 mt-3 gap-3"
    >
      <!-- ข้อความ -->
      <div class="text-gray-700 text-center sm:text-left">
        Showing
        <span class="font-medium">{{ startIndex(group.degree.id) + 1 }}</span>
        to
        <span class="font-medium">{{ endIndex(group.degree.id) }}</span>
        of
        <span class="font-medium">{{ group.total }}</span>
        results
      </div>

      <!-- ปุ่ม -->
      <nav
        class="isolate inline-flex -space-x-px rounded-md shadow-sm mx-auto sm:mx-0"
        aria-label="Pagination"
      >
        <!-- ไปหน้าแรก -->
        <button
          @click="changePage(group.degree.id, 1)"
          :disabled="currentPages[group.degree.id] === 1"
          class="px-3 py-1 border rounded-l disabled:opacity-50"
        >
          «
        </button>

        <!-- ก่อนหน้า -->
        <button
          @click="
            changePage(group.degree.id, currentPages[group.degree.id] - 1)
          "
          :disabled="currentPages[group.degree.id] === 1"
          class="px-3 py-1 border disabled:opacity-50"
        >
          ‹
        </button>

        <!-- ถ้าหน้าปัจจุบันเกิน 3 ให้แสดง 1 + ... -->
        <template v-if="startPage(group.degree.id) > 1">
          <button
            class="px-3 py-1 border"
            @click="changePage(group.degree.id, 1)"
          >
            1
          </button>
          <span class="px-3 py-1 border hidden sm:inline">...</span>
        </template>

        <!-- Page numbers -->
        <button
          v-for="page in visiblePages(group.degree.id)"
          :key="page"
          @click="changePage(group.degree.id, page)"
          :class="[
            'px-3 py-1 border',
            page === currentPages[group.degree.id]
              ? 'bg-[#0085db] text-white'
              : 'bg-white text-gray-800',
          ]"
        >
          {{ page }}
        </button>

        <!-- ถ้าหน้าสุดท้ายไม่อยู่ในช่วง แสดง ... + หน้าสุดท้าย -->
        <template v-if="endPage(group.degree.id) < totalPages[group.degree.id]">
          <span class="px-3 py-1 border hidden sm:inline">...</span>
          <button
            class="px-3 py-1 border"
            @click="changePage(group.degree.id, totalPages[group.degree.id])"
          >
            {{ totalPages[group.degree.id] }}
          </button>
        </template>

        <!-- ถัดไป -->
        <button
          @click="
            changePage(group.degree.id, currentPages[group.degree.id] + 1)
          "
          :disabled="
            currentPages[group.degree.id] === totalPages[group.degree.id]
          "
          class="px-3 py-1 border disabled:opacity-50"
        >
          ›
        </button>

        <!-- ไปหน้าสุดท้าย -->
        <button
          @click="changePage(group.degree.id, totalPages[group.degree.id])"
          :disabled="
            currentPages[group.degree.id] === totalPages[group.degree.id]
          "
          class="px-3 py-1 border rounded-r disabled:opacity-50"
        >
          »
        </button>
      </nav>
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
import { ref, computed, watch } from "vue";
import Swal from "sweetalert2";
import EditCurriculumModal from "./EditCurriculumModal.vue";
import { updateEducation } from "@/services/apiService";

// ตรวจสอบว่าเป็น admin หรือไม่
const isAdmin = localStorage.getItem("token") ? true : false;

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  limit: {
    type: Number,
    default: 10,
  },
});

// เพิ่ม emit สำหรับแจ้ง parent component
const emit = defineEmits(["refreshData", "dataUpdated"]);
const limit = props.limit;
const currentPages = ref({});
const isUpdating = ref(false);

// อัปเดต currentPages ทุกครั้งที่ data เปลี่ยน
watch(
  () => props.data,
  (newVal) => {
    const pages = {};
    newVal.forEach((group) => {
      pages[group.degree.id] = currentPages.value[group.degree.id] || 1;
    });
    currentPages.value = pages;
  },
  { immediate: true }
);

const totalPages = computed(() => {
  const pages = {};
  props.data.forEach((group) => {
    pages[group.degree.id] = Math.ceil(group.items.length / limit);
  });
  return pages;
});

const sortedData = computed(() => {
  const customOrder = [6, 5, 4];

  return [...props.data].sort((a, b) => {
    const indexA = customOrder.indexOf(a.degree.id);
    const indexB = customOrder.indexOf(b.degree.id);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB; // ถ้าเจอทั้งคู่ ให้เรียงตามลำดับใน customOrder
    } else if (indexA !== -1) {
      return -1; // A เจอใน customOrder ให้มาก่อน
    } else if (indexB !== -1) {
      return 1; // B เจอใน customOrder ให้มาก่อน
    } else {
      return a.degree.id - b.degree.id; // ถ้าไม่มีใน customOrder ให้เรียงตามปกติ (ascending)
    }
  });
});

const paginatedGroups = computed(() => {
  return sortedData.value.map((group) => {
    const start = (currentPages.value[group.degree.id] - 1) * limit;
    const end = start + limit;
    return {
      ...group,
      paginatedItems: group.items.slice(start, end),
      total: group.items.length,
    };
  });
});

function changePage(groupId, page) {
  if (page >= 1 && page <= totalPages.value[groupId]) {
    currentPages.value[groupId] = page;
  }
}

function startIndex(groupId) {
  return (currentPages.value[groupId] - 1) * limit;
}

function endIndex(groupId) {
  const end = startIndex(groupId) + limit;
  const group = props.data.find((g) => g.degree.id === groupId);
  return end > group.items.length ? group.items.length : end;
}

function startPage(groupId) {
  const maxVisible = 4;
  const current = currentPages.value[groupId];
  return Math.max(1, current - Math.floor(maxVisible / 2));
}

function endPage(groupId) {
  const maxVisible = 4;
  const total = totalPages.value[groupId];
  return Math.min(total, startPage(groupId) + maxVisible - 1);
}

function visiblePages(groupId) {
  const pages = [];
  for (let i = startPage(groupId); i <= endPage(groupId); i++) {
    pages.push(i);
  }
  return pages;
}

const showEditModal = ref(false);
const selectedCurriculum = ref(null);

function openEditModal(item) {
  console.log("Opening edit modal for:", item);
  selectedCurriculum.value = { ...item }; // สร้าง copy เพื่อป้องกัน mutation
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  selectedCurriculum.value = null;
}

async function handleUpdateCurriculum(updatedData) {
  console.log("Received update data:", updatedData);

  isUpdating.value = true;

  try {
    const { id, ...data } = updatedData;

    // เรียก API อัปเดต
    const response = await updateEducation(id, data);
    console.log("Update response:", response);

    await Swal.fire({
      icon: "success",
      title: "อัปเดตข้อมูลสำเร็จ",
      text: "ข้อมูลหลักสูตรได้รับการอัปเดตเรียบร้อยแล้ว",
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    // ปิด modal
    closeEditModal();

    // Emit event ให้ parent refresh ข้อมูล
    emit("refreshData");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดต:", error);

    let errorMessage = "ไม่สามารถอัปเดตข้อมูลหลักสูตรได้ กรุณาลองใหม่อีกครั้ง";

    if (error.response) {
      console.error("Error response:", error.response);
      if (error.response.status === 422) {
        errorMessage = "ข้อมูลที่กรอกไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
      } else if (error.response.status === 404) {
        errorMessage = "ไม่พบข้อมูลหลักสูตรที่ต้องการแก้ไข";
      } else if (error.response.status === 403) {
        errorMessage = "คุณไม่มีสิทธิ์ในการแก้ไขข้อมูลนี้";
      } else if (error.response.status === 500) {
        errorMessage = "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
      }

      // แสดง error details ใน console
      if (error.response.data) {
        console.error("Error details:", error.response.data);
      }
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

function handleRefreshData() {
  // console.log("Received refreshData in DataTable");
  emit("refreshData"); // ส่งต่อไป parent
}
</script>