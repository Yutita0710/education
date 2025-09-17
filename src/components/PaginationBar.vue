<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 bg-white px-3 sm:px-4 py-2.5 sm:py-3 mt-3 gap-2 sm:gap-3 mt-5"
  >
    <!-- Summary -->
    <div
      v-if="showSummary"
      class="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-gray-700 text-center sm:text-left"
    >
      <div>
        Showing
        <span class="font-medium">{{ startDisplay }}</span>
        to
        <!-- <span class="font-medium">{{ endIndex }}</span> -->
        <span class="font-medium">{{ endDisplay }}</span>
        of
        <span class="font-medium">{{ totalDisplay }}</span>
        results
      </div>

      <!-- ✅ Selector สำหรับ limit -->
      <div class="flex items-center gap-1">
        <span class="text-gray-500">Per page:</span>
        <select
          :value="perPageSafe"
          @change="onLimitChange"
          class="border rounded-md px-2 py-1 text-xs sm:text-sm"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Pagination -->
    <nav
      v-if="totalPages > 1"
      class="isolate inline-flex -space-x-px rounded-md shadow-sm mx-auto sm:mx-0 overflow-x-auto no-scrollbar max-w-full"
      aria-label="Pagination"
    >
      <!-- First -->
      <button
        @click="goFirst"
        :disabled="isFirst"
        class="px-2 sm:px-3 py-1 sm:py-1.5 border rounded-l text-xs sm:text-sm bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label="First page"
        title="First page"
      >
        «
      </button>

      <!-- Prev -->
      <button
        @click="goPrev"
        :disabled="isFirst"
        class="px-2 sm:px-3 py-1 sm:py-1.5 border text-xs sm:text-sm bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label="Previous page"
        title="Previous page"
      >
        ‹
      </button>

      <!-- First page -->
      <button
        @click="change(1)"
        :aria-current="currentPage === 1 ? 'page' : null"
        :class="[
          'px-2 sm:px-3 py-1 sm:py-1.5 border text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
          currentPage === 1
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800 hover:bg-gray-50',
        ]"
      >
        1
      </button>

      <span
        v-if="showLeftEllipsis"
        class="px-2 sm:px-3 py-1 sm:py-1.5 border select-none text-xs sm:text-sm bg-white text-gray-500"
        >…</span
      >

      <!-- inner pages -->
      <button
        v-for="page in innerPages"
        :key="page"
        @click="change(page)"
        :aria-current="page === currentPage ? 'page' : null"
        :class="[
          'px-2 sm:px-3 py-1 sm:py-1.5 border text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
          page === currentPage
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800 hover:bg-gray-50',
        ]"
      >
        {{ page }}
      </button>

      <span
        v-if="showRightEllipsis"
        class="px-2 sm:px-3 py-1 sm:py-1.5 border select-none text-xs sm:text-sm bg-white text-gray-500"
        >…</span
      >

      <!-- Last page -->
      <button
        @click="change(totalPages)"
        :aria-current="currentPage === totalPages ? 'page' : null"
        :class="[
          'px-2 sm:px-3 py-1 sm:py-1.5 border text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
          currentPage === totalPages
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800 hover:bg-gray-50',
        ]"
      >
        {{ totalPages }}
      </button>

      <!-- Next -->
      <button
        @click="goNext"
        :disabled="isLast"
        class="px-2 sm:px-3 py-1 sm:py-1.5 border text-xs sm:text-sm bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label="Next page"
        title="Next page"
      >
        ›
      </button>

      <!-- Last -->
      <button
        @click="goLast"
        :disabled="isLast"
        class="px-2 sm:px-3 py-1 sm:py-1.5 border rounded-r text-xs sm:text-sm bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label="Last page"
        title="Last page"
      >
        »
      </button>
    </nav>
  </div>
</template>


<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, watch, ref } from "vue";

const props = defineProps({
  currentPage: { type: Number, required: true },
  perPage: { type: Number, default: 10 },
  total: { type: Number, required: true },
  maxVisible: { type: Number, default: 7 },
  innerCount: { type: Number },
  windowMode: { type: String, default: "center" },
  showSummary: { type: Boolean, default: true },
});

const emit = defineEmits([
  "changePage",
  "update:currentPage",
  "update:perPage",
]);

const route = useRoute();
const router = useRouter();

const ALLOWED_LIMITS = [10, 20, 50, 100];
const DEFAULT_LIMIT = 10;


function sanitizeLimit(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) return DEFAULT_LIMIT;
  if (ALLOWED_LIMITS.includes(n)) return n;
  // clamp to nearest bound
  if (n < ALLOWED_LIMITS[0]) return ALLOWED_LIMITS[0];
  return ALLOWED_LIMITS[ALLOWED_LIMITS.length - 1]; // 100 สำหรับ 100000
}

function sanitizePage(p) {
  const n = Number(p);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

watch(
  () => route.query,
  (q) => {
    const safe = {
      ...q,
      limit: String(sanitizeLimit(q.limit)),
      page: String(sanitizePage(q.page)),
    };
    // canonicalize URL ถ้าเปลี่ยน
    if (safe.limit !== String(q.limit) || safe.page !== String(q.page)) {
      router.replace({ query: safe });
    }
  },
  { immediate: true }
);

const isFirst = computed(() => props.currentPage <= 1);
const isLast = computed(() => props.currentPage >= totalPages.value);
const perPageSafe = computed(() => {
  const n = Number(props.perPage);
  if (!Number.isFinite(n)) return DEFAULT_LIMIT;
  if (ALLOWED_LIMITS.includes(n)) return n;
  if (n < ALLOWED_LIMITS[0]) return ALLOWED_LIMITS[0];
  return ALLOWED_LIMITS[ALLOWED_LIMITS.length - 1];
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / perPageSafe.value))
);
const startIndex = computed(() => (props.currentPage - 1) * perPageSafe.value);
const endIndex = computed(() =>
  Math.min(props.currentPage * perPageSafe.value, props.total)
);

// ---- NEW: formatter ----
const fmt = (n) => Number(n ?? 0).toLocaleString("th-TH-u-nu-latn");

// แสดงผลแบบมีคอมมา
const totalDisplay = computed(() => fmt(props.total)); // ✅ FIX: ใช้ props.total
const startDisplay = computed(() => fmt(startIndex.value + 1));
const endDisplay = computed(() => fmt(endIndex.value));
const totalPagesDisplay = computed(() => fmt(totalPages.value));
// ✅ ใช้ innerCount ถ้าส่งมา, ไม่งั้น fallback = maxVisible - 2 (กันตำแหน่ง 1 และ last)
const innerCountVal = computed(() => {
  const fallback = Math.max(1, props.maxVisible - 2);
  return Math.max(1, props.innerCount ?? fallback);
});

// คำนวณหน้าต่าง "inner" ระหว่าง 1 และ last
const innerStart = computed(() => {
  const total = totalPages.value;
  const cnt = innerCountVal.value;

  // ถ้าหน้าทั้งหมดน้อยกว่าเท่าที่จะแสดงทั้งหมดอยู่แล้ว (รวม 1 กับ last) → inner เริ่มที่ 2
  if (total <= cnt + 2) return 2;

  if (props.windowMode === "forward") {
    // โหมด forward: เริ่มหลังหน้าปัจจุบัน (หน้า 5, cnt=3 → 6 7 8)
    const start = props.currentPage + 1;
    return Math.min(Math.max(2, start), total - cnt);
  } else {
    // โหมด center: หน้าปัจจุบันอยู่กึ่งกลาง
    const half = Math.floor(cnt / 2);
    let start = props.currentPage - half;
    start = Math.max(2, Math.min(start, total - cnt));
    return start;
  }
});

const innerEnd = computed(() => {
  const total = totalPages.value;
  const cnt = innerCountVal.value;
  return Math.min(total - 1, innerStart.value + cnt - 1);
});

const showLeftEllipsis = computed(() => innerStart.value > 2);
const showRightEllipsis = computed(() => innerEnd.value < totalPages.value - 1);

const innerPages = computed(() => {
  const total = totalPages.value;
  const cnt = innerCountVal.value;

  // ถ้า totalPages เล็กพอ แสดงทุกหน้า (ยกเว้น 1/last) ให้ครบ
  if (total <= cnt + 2) {
    const arr = [];
    for (let i = 2; i <= total - 1; i++) arr.push(i);
    return arr;
  }

  const arr = [];
  for (let i = innerStart.value; i <= innerEnd.value; i++) arr.push(i);
  return arr;
});

function change(page) {
  const clamped = Math.min(Math.max(1, page), totalPages.value);
  if (clamped !== props.currentPage) {
    emit("changePage", clamped); // สำหรับ @changePage
    emit("update:currentPage", clamped); // รองรับ v-model:currentPage
  }
}
const goFirst = () => change(1);
const goPrev = () => change(props.currentPage - 1);
const goNext = () => change(props.currentPage + 1);
const goLast = () => change(totalPages.value);

function onLimitChange(e) {
  const target = e.target || e.currentTarget;
  const newLimit = Number(target?.value);
  if (!Number.isFinite(newLimit) || newLimit <= 0) return;

  // คำนวณหน้าใหม่จาก offset ของหน้าเดิม (ยึดรายการตัวแรกที่กำลังเห็นอยู่)
  const oldPage = Number(props.currentPage || 1);
  const oldLimit = Number(props.perPage || 10);
  const total = Number(props.total || 0);

  const offset0 = (oldPage - 1) * oldLimit; // 0-based
  let newPage = Math.floor(offset0 / newLimit) + 1; // 1-based

  // clamp หน้าใหม่กับจำนวนหน้าตาม limit ใหม่
  const newTotalPages = Math.max(1, Math.ceil(total / newLimit));
  if (newPage > newTotalPages) newPage = newTotalPages;
  if (newPage < 1) newPage = 1;

  // อัปเดต perPage และ page
  // (ถ้าพาเรนต์ยิงโหลดเมื่อใดตัวหนึ่งเปลี่ยน แนะนำรวมเป็น handler เดียวฝั่งพาเรนต์)
  emit("update:perPage", newLimit);
  emit("changePage", newPage);
  emit("update:currentPage", newPage);
}
</script>


