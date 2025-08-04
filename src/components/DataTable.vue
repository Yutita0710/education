<template>
  <div v-for="group in paginatedGroups" :key="group.degree.id" class="mb-8">
    <!-- หัวข้อแต่ละกลุ่ม -->
    <h2 class="text-lg font-bold mb-3">
      {{ group.degree.name }} ({{ group.total }} หลักสูตร)
    </h2>

    <!-- ตาราง (Responsive) -->
    <div class="overflow-x-auto">
      <table
        class="table-auto w-full border-collapse border border-gray-300 text-sm sm:text-base"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-2 py-1 whitespace-nowrap w-[60px]">ลำดับ</th>
            <th class="border px-2 py-1 whitespace-nowrap w-[200px]">
              ชื่อสถาบันการศึกษา
            </th>
            <th class="border px-2 py-1 whitespace-nowrap w-[200px]">
              ชื่อหลักสูตร
            </th>
            <th class="border px-2 py-1 w-[300px]">รายละเอียด</th>
            <th class="border px-2 py-1 whitespace-nowrap w-[100px]">
              ปีเริ่มต้น
            </th>
            <th class="border px-2 py-1 whitespace-nowrap w-[100px]">
              ปีสิ้นสุด
            </th>
            <!-- ✅ เพิ่มส่วนนี้ -->
            <th
              v-if="isAdmin"
              class="border px-2 py-1 whitespace-nowrap w-[100px]"
            >
              สถานะ
            </th>
            <th
              v-if="isAdmin"
              class="border px-2 py-1 whitespace-nowrap w-[100px]"
            >
              แก้ไข
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in group.paginatedItems"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td class="border px-2 py-1 text-center">
              {{ index + 1 + (currentPages[group.degree.id] - 1) * limit }}
            </td>
            <td class="border px-2 py-1 truncate">{{ item.college.name }}</td>
            <td class="border px-2 py-1 truncate">{{ item.name }}</td>
            <td class="border px-2 py-1 truncate">{{ item.description }}</td>
            <td class="border px-2 py-1">{{ item.start_year }}</td>
            <td class="border px-2 py-1">{{ item.end_year || "-" }}</td>
            <!-- ✅ เพิ่มส่วนนี้ -->
            <td v-if="isAdmin" class="border px-2 py-1 text-center items-center">
              <div class="flex items-center gap-x-4 text-xs">
                <a
                  class="relative z-10 rounded-full px-3 py-1.5 font-medium"
                  :class="
                    item.active
                      ? 'bg-[#09C97F1A] text-[#09C97F] font-semibold'
                      : 'bg-[#FB977D1A] text-[#FB977D] font-semibold'
                  "
                  :href="`/admin/curriculum/${item.id}`"
                >
                  {{ item.active ? "Active" : "Inactive" }}
                </a>
              </div>
            </td>

            <td v-if="isAdmin" class="border px-2 py-1 text-center items-center">
              <button
                class="inline-flex items-center bg-orange-400 text-white px-2 py-2 rounded-full hover:bg-orange-50 transition"
              >
                <!-- ไอคอนดินสอ -->
                <svg
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
      <div class="text-sm text-gray-700 text-center sm:text-left">
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
              ? 'bg-blue-500 text-white'
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
</template>
<script setup>
import { ref, computed, watch } from "vue";
// ✅ ตรวจสอบว่าเป็น admin หรือไม่
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

const limit = props.limit;
const currentPages = ref({});

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

const paginatedGroups = computed(() => {
  return props.data.map((group) => {
    const start = (currentPages.value[group.degree.id] - 1) * limit;
    const end = start + limit;
    return {
      ...group,
      paginatedItems: group.items.slice(start, end),
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
</script>
