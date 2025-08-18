<template>
  <div class="relative p-6">
    <!-- Header -->
    <header
      class="bg-custom-gradient rounded-md pb-16 md:pb-20 pt-10 md:mb-16 flex flex-col text-center shadow-md"
    >
      <div class="flex items-start px-4">
        <Breadcrumb />
      </div>
      <div class="px-4 md:px-0">
        <img
          class="mx-auto h-20 md:h-28"
          src="../../assets/img/tfac.ico"
          alt=""
        />
        <h1
          class="text-[#111C2D]/80 text-lg md:text-3xl font-bold drop-shadow-sm mt-4"
        >
          สถาบันการศึกษาที่ผ่านการรับรองจากสภาวิชาชีพบัญชี ในพระบรมราชูปถัมภ์
        </h1>
      </div>
    </header>

    <!-- Filter Section -->
    <div class="px-4 md:px-8 md:absolute md:bottom-0 md:left-0 md:right-0 mb-6">
      <div
        class="flex flex-col md:flex-row gap-4 md:gap-6 bg-white p-4 rounded-lg border shadow-sm text-gray-700 w-full max-w-4xl mx-auto"
      >
        <!-- กล่องที่ 1 -->
        <div class="flex-1">
          <label class="block font-semibold text-gray-700 mb-2">
            ชื่อสถาบันการศึกษา
          </label>
          <input
            type="text"
            id="simple-search"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5"
            placeholder="กรุณากรอกชื่อสถาบันการศึกษาที่ต้องการค้นหา"
          />
        </div>

        <!-- กล่องที่ 2 -->
        <div class="w-full md:w-auto flex items-end">
          <button
            class="bg-[#F8B15D] hover:bg-[#FE7743] text-white px-6 py-3 rounded-md shadow flex items-center justify-center gap-2 transition-all font-medium w-full md:w-auto min-w-[8rem]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-6 flex-shrink-0"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                d="M20 8c-1.403-2.96-4.463-5-8-5a9 9 0 1 0 0 18a9 9 0 0 0 9-9m0-9v6h-6"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="p-6 text-gray-700">
    <!-- ตาราง -->
    <div class="mb-8 mt-8 px-4 sm:px-8 md:px-4 lg:px-4 xl:px-20">
      <div
        class="flex flex-col sm:flex-row justify-between items-center sm:items-center py-4"
      >
        <!-- หัวข้อ -->
        <h2 class="text-lg font-bold mb-3 sm:mb-0">
          จํานวน ({{ totalItems }}) สถาบันการศึกษา
        </h2>

        <!-- ปุ่ม -->
        <button
          @click="showCollegeModal = true"
          class="inline-flex items-center gap-2 bg-[#ed590e] text-white px-4 py-2 rounded-full shadow hover:bg-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clip-rule="evenodd"
            />
          </svg>
          เพิ่มข้อมูลสถาบันการศึกษา
        </button>
      </div>

      <div class="overflow-x-auto">
        <table
          class="table-auto w-full border-collapse border border-gray-300 text-sm sm:text-base"
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
              class="border px-2 py-[1rem]  font-bold whitespace-nowrap w-[100px]"
            >
              สถานะ
            </th>
            <th class="border px-2 py-[1rem]  font-bold w-[100px]">รายละเอียด</th>
            <th
              class="border px-2 py-[1rem]  font-bold font-bold whitespace-nowrap w-[100px]"
            >
              แก้ไข
            </th>
          </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in colleges"
              :key="item.id"
              class="hover:bg-gray-50 text-gray-600"
            >
              <td class="border px-2 py-1 text-center">
                {{ index + 1 + (currentPage - 1) * perPage }}
              </td>
              <td class="border px-2 py-1 break-words">{{ item.name }}</td>
              <td
                class="border px-2 py-1 break-words cursor-pointer"
                @click="goToCurriculum(item.name)"
              >
                {{ item.curriculumCount || 0 }}
              </td>
              <td
                class="border px-2 py-1 text-center items-center justify-center"
              >
                <span
                  :class="
                    item.active
                      ? 'bg-[#09C97F1A] text-[#09C97F] font-semibold'
                      : 'bg-[#FB977D1A] text-[#FB977D] font-semibold'
                  "
                  class="rounded-full px-3 py-1 text-xs readonly font-medium"
                >
                  {{ item.active ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="border px-2 py-1 text-center">
                <button
                  @click="openEditcollegeModal(item)"
                  class="inline-flex items-center bg-orange-400 text-white px-2 py-2 rounded-full hover:bg-orange-500 transition"
                >
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
        <div class="text-sm text-gray-700 text-center sm:text-left">
          Showing
          <span class="font-medium">{{ startIndex + 1 }}</span>
          to
          <span class="font-medium">{{ endIndex }}</span>
          of
          <span class="font-medium">{{ totalItems }}</span>
          results
        </div>

        <!-- ถ้ามีหน้ามากกว่า 1 ให้แสดง pagination -->
        <nav
          v-if="totalPages > 1"
          class="isolate inline-flex -space-x-px rounded-md shadow-sm mx-auto sm:mx-0"
          aria-label="Pagination"
        >
          <!-- ไปหน้าแรก -->
          <button
            @click="changePage(1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded-l disabled:opacity-50"
          >
            «
          </button>

          <!-- ก่อนหน้า -->
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border disabled:opacity-50"
          >
            ‹
          </button>

          <!-- ถ้าหน้าแรกไม่ใช่ 1 ให้แสดง 1 + ... -->
          <template v-if="visiblePages[0] > 1">
            <button class="px-3 py-1 border" @click="changePage(1)">1</button>
            <span class="px-3 py-1 border">...</span>
          </template>

          <!-- แสดงหน้าที่ visible -->
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 border',
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800',
            ]"
          >
            {{ page }}
          </button>

          <!-- ถ้าหน้าสุดท้ายไม่อยู่ในช่วง ให้แสดง ... + หน้าสุดท้าย -->
          <template v-if="visiblePages[visiblePages.length - 1] < totalPages">
            <span class="px-3 py-1 border">...</span>
            <button class="px-3 py-1 border" @click="changePage(totalPages)">
              {{ totalPages }}
            </button>
          </template>

          <!-- ถัดไป -->
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border disabled:opacity-50"
          >
            ›
          </button>

          <!-- ไปหน้าสุดท้าย -->
          <button
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded-r disabled:opacity-50"
          >
            »
          </button>
        </nav>
      </div>
    </div>

    <!-- Add Modal -->
    <AddCollegeModal
      :showModal="showCollegeModal"
      :closeModal="closeCollegeModal"
      @close="closeCollegeModal"
    />

    <!-- Edit Modal - เพิ่มส่วนนี้ -->
    <EditCollegeModal
      :showModal="showEditModal"
      :closeModal="closeEditModal"
      :selectedCollege="selectedCollege"
      @close="closeEditModal"
    />
  </div>
  <!-- Loading Overlay -->
  <div v-if="isLoading" class="loading-overlay">
    <!-- From Uiverse.io by forgingdestiny -->
    <div class="loader">
      <div class="circle" tabindex="0"></div>
      <div class="circle" tabindex="0"></div>
      <div class="circle" tabindex="0"></div>
      <div class="circle" tabindex="0"></div>
      <div class="circle" tabindex="0"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import AddCollegeModal from "@/components/AddCollegeModal.vue";
import EditCollegeModal from "@/components/EditCollegeModal.vue"; // ✅ Add this import
import { countCurriculum, getColleges } from "@/services/apiService";
import { useRouter } from "vue-router";
import Breadcrumb from "@/components/ฺBreadcrumb.vue";

const colleges = ref([]);
const showCollegeModal = ref(false);
const search = ref("");
const selectedCollege = ref({});
const showEditModal = ref(false);
// Pagination state
const currentPage = ref(1);
const perPage = 10;
const totalItems = ref(0);
const totalPages = ref(1);
const router = useRouter();
// แสดงผลดัชนีเริ่มและสิ้นสุด
const startIndex = computed(() => (currentPage.value - 1) * perPage);
const endIndex = computed(() =>
  Math.min(currentPage.value * perPage, totalItems.value)
);
const isLoading = ref(false);
const curriculumCountsMap = ref({});
let searchTimeout = null;

// สร้างหน้าเพจที่จะแสดง (สูงสุด 5 ปุ่ม)
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(currentPage.value - 2, 1);
  let end = Math.min(start + maxVisible - 1, totalPages.value);

  if (end - start < maxVisible - 1) {
    start = Math.max(end - maxVisible + 1, 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const fetchData = async () => {
  try {
    isLoading.value = true;

    // 1️⃣ ดึงข้อมูลมหาวิทยาลัยตาม page
    const params = {
      page: currentPage.value,
      limit: perPage,
      sort: "id",
      order: "ASC",
      search: search.value.trim(),
    };
    const res = await getColleges(params);
    const collegesPage = res.data?.data || [];

    // 2️⃣ โหลดจำนวนหลักสูตรครั้งเดียว (ถ้ายังไม่มี)
    if (Object.keys(curriculumCountsMap.value).length === 0) {
      const curriculumCountsRes = await countCurriculum();
      const curriculumCounts = curriculumCountsRes.data?.data || [];

      // แปลงเป็น map เพื่อเข้าถึงง่าย
      curriculumCounts.forEach((c) => {
        curriculumCountsMap.value[c.college_id] = Number(c.curriculum_count);
      });
    }

    // 3️⃣ map จำนวนหลักสูตรเข้ากับหน้า current page
    colleges.value = collegesPage.map((college) => ({
      ...college,
      curriculumCount: curriculumCountsMap.value[college.id] || 0,
    }));

    // 4️⃣ meta pagination
    const meta = res.data?.meta || {};
    totalItems.value = meta.total || 0;
    totalPages.value = meta.last_page || 1;

    console.log({ colleges: colleges.value });
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    isLoading.value = false;
  }
};

// เพิ่ม debounce เล็กน้อย
watch(search, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // เริ่มที่หน้าแรกทุกครั้งที่ค้นหาใหม่
    fetchData();
  }, 300); // 300ms delay หลังเลิกพิมพ์
});

// ไปหน้า curriculum
function goToCurriculum(collegeId) {
  router.push({
    path: "/admin/curriculum",
    query: { collegeId },
  });
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchData();
  }
}

function closeEditModal() {
  showEditModal.value = false;
  selectedCollege.value = {};
  fetchData(); // รีโหลดข้อมูลหลังจากแก้ไข
}

function closeCollegeModal() {
  showCollegeModal.value = false;
  fetchData();
} // closeCollegeModal

function openEditcollegeModal(item) {
  console.log("Opening edit modal for:", item);
  selectedCollege.value = { ...item }; // ✅ ใช้ตัวแปรนี้แทน selectedCurriculum
  showEditModal.value = true;
}

function reset() {
  search.value = "";
  currentPage.value = 1;
  fetchData();
}

onMounted(fetchData);
</script>


<style scoped>
/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* From Uiverse.io by forgingdestiny */
/* Container for the loader */
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10em;
}

/* Circle elements */
.circle {
  width: 1em;
  height: 1em;
  margin: 0 0.25em;
  border-radius: 50%;
  background-color: #a8d5e2;
  animation: wave 1.5s infinite ease-in-out;
  transition: background-color 0.3s ease;
}

/* Animation */
@keyframes wave {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-1em);
  }
}

/* Delay for each circle */
.circle:nth-child(1) {
  animation-delay: 0s;
}

.circle:nth-child(2) {
  animation-delay: 0.2s;
}

.circle:nth-child(3) {
  animation-delay: 0.4s;
}

.circle:nth-child(4) {
  animation-delay: 0.6s;
}

.circle:nth-child(5) {
  animation-delay: 0.8s;
}
</style>
