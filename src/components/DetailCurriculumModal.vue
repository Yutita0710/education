<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative">
      <!-- แถวหัวข้อ + ปุ่ม -->
      <div class="mb-6 grid grid-cols-[1fr_auto_1fr] items-center">
        <!-- คอลัมน์ซ้าย (ปล่อยว่างไว้ให้บาลานซ์ความกว้างกับขวา) -->
        <div></div>

        <!-- คอลัมน์กลาง: หัวข้ออยู่กึ่งกลางจริง -->
        <h2 class="text-[17px] font-bold text-center">รายละเอียดหลักสูตร</h2>

        <!-- คอลัมน์ขวา: ปุ่มสองอันชิดขวาและวางติดกัน -->
        <div class="justify-self-end flex items-center gap-2">
          <!-- ปุ่มดินสอ -->
          <button
            v-if="canEdit"
            @click.stop="onEditClick"
            :aria-describedby="detail?.id ? `tt-edit-${detail.id}` : 'tt-edit'"
            type="button"
            class="inline-flex items-center bg-[#F8B15D] text-white w-20 h-10 rounded-full hover:bg-orange-500 transition justify-center"
            aria-label="Edit"
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
            แก้ไข
          </button>

          <!-- ปุ่มปิด (ย้ายมาวางขวาสุด, เอา absolute ออก) -->
          <button
            @click="handleClose"
            type="button"
            class="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-20"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading / Error -->
      <div v-if="isLoading" class="space-y-4 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div v-else-if="loadError" class="py-6 text-center">
        <p class="text-red-600">ไม่สามารถดึงข้อมูลได้: {{ loadError }}</p>
      </div>

      <!-- Content -->
      <div class="px-14 space-y-6 py-10" v-else>
        <!-- 2 คอลัมน์ -->
        <dl class="grid grid-cols-[210px_minmax(0,1fr)] gap-x-6 gap-y-3">
          <template v-if="detail?.specific_no">
            <dt
              class="text-gray-600 font-semibold whitespace-nowrap text-[15px]"
            >
              หลักสูตรเฉพาะสมาชิก
            </dt>
            <dd
              class="text-gray-900 min-w-0 whitespace-pre-wrap break-words hyphens-auto"
            >
              {{ detail.specific_no }}
            </dd>
          </template>
          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            ชื่อสถาบัน
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeText(collegeName) }}
          </dd>

          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            ชื่อหลักสูตร
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeText(detail.name) }}
          </dd>

          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            หลักสูตร
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeText(description) }}
          </dd>

          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            ระดับการศึกษา
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeText(degreeName) }}
          </dd>

          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            หลักสูตรสำหรับ
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeText(typeNames) }}
          </dd>

          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            รายละเอียด
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-pre-wrap break-words hyphens-auto"
          >
            {{ safeText(detail?.remark) }}
          </dd>
          <template v-if="Number(detail?.is_section_33 ?? 0) === 1">
            <dt
              class="text-gray-600 font-semibold whitespace-nowrap text-[15px]"
            >
              หมายเหตุเพิ่มเติม
            </dt>
            <dd
              class="text-gray-900 min-w-0 whitespace-pre-wrap break-words hyphens-auto"
            >
              ประกาศสภาวิชาชีพบัญชี ฉบับที่ 33/2549
            </dd>
          </template>
        </dl>

        <!-- มติ/วันที่ (4 คอลัมน์) -->
        <dl
          class="mt-4 grid grid-cols-[210px_minmax(0,1fr)_210px_minmax(0,1fr)] gap-x-6 gap-y-3"
        >
          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            มติการประชุมครั้งที่
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeText(meetingNo) }}
          </dd>

          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            วันที่ประชุม
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeText(meetingDateTH) }}
          </dd>
        </dl>

        <!-- ปีเริ่ม/สิ้นสุด (4 คอลัมน์) -->
        <dl
          class="mt-2 grid grid-cols-[210px_minmax(0,1fr)_210px_minmax(0,1fr)] gap-x-6 gap-y-3"
        >
          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            ปีที่เริ่มต้น (พ.ศ.)
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeYear(startYear) }}
          </dd>

          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            ปีที่สิ้นสุด (พ.ศ.)
          </dt>
          <dd
            class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]"
          >
            {{ safeYear(endYear) }}
          </dd>
        </dl>

        <!-- ป้ายสถานะ (2 คอลัมน์) -->
        <dl class="mt-2 grid grid-cols-[210px_minmax(0,1fr)] gap-x-6 gap-y-3">
          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            สถานะการเผยแพร่
          </dt>
          <dd class="min-w-0">
            <span
              class="inline-flex items-center text-xs px-2.5 py-1 rounded-full"
              :class="
                detail.is_curriculum_published
                  ? 'bg-green-100 text-green-800'
                  : 'bg-[#FEF7EF] text-[#F8B15D]'
              "
            >
              {{ detail.is_curriculum_published ? "เผยแพร่" : "ไม่เผยแพร่" }}
            </span>
          </dd>

          <dt class="text-gray-600 font-semibold whitespace-nowrap text-[15px]">
            สถานะการใช้งาน
          </dt>
          <dd class="min-w-0">
            <span
              class="inline-flex items-center text-xs px-2.5 py-1 rounded-full"
              :class="
                Number(detail.active) === 1
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              {{ Number(detail.active) === 1 ? "ใช้งาน" : "ไม่ใช้งาน" }}
            </span>
          </dd>
        </dl>
      </div>
    </div>
  </div>

  <!-- Modal แก้ไข -->
  <EditCurriculumModal
    :showModal="showEditModal"
    :curriculum="selectedCurriculum"
    :closeModal="closeEditModal"
    @refresh-data="handleRefreshData"
  />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/th";
import EditCurriculumModal from "./EditCurriculumModal.vue";
import { getTypes } from "@/services/apiService";
import { fa } from "vuetify/locale";

dayjs.locale("th");

const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, required: true },
  curriculum: { type: Object, default: null },
});
const emit = defineEmits(["refresh-data", "close", "request-edit"]);
const isLoading = ref(false);
const loadError = ref("");
let fetchToken = 0;
// ย่อ reference
const detail = computed(() => props.curriculum ?? {});

function onEditClick() {
  emit("request-edit", { ...(detail.value || {}) });
}
// helper: วันที่ไทย
function toThai(dateStr) {
  if (!dateStr) return "-";
  const d = dayjs(dateStr);
  return d.isValid() ? d.add(543, "year").format("DD/MM/YYYY") : "-";
}

// ชื่อสถาบัน
const collegeName = computed(() => {
  const c = detail.value?.college;
  if (!c) return "-";
  const campus = c.campus ? ` (${c.campus})` : "";
  return `${c.name ?? "-"}` + campus;
});

// คำอธิบาย (หลักสูตร)
const description = computed(() => detail.value?.description || "-");

// ระดับการศึกษา
const degreeName = computed(() => detail.value?.degree?.name ?? "-");

// ---------- แก้ตรงนี้ ----------
const typesMaster = ref([]);
const typeIdToName = computed(() => {
  const m = new Map();
  for (const t of typesMaster.value) {
    const id = Number(t?.id);
    const name = String(t?.type_name ?? t?.name ?? "").trim();
    if (Number.isFinite(id) && name) m.set(id, name);
  }
  return m;
});

async function loadTypesMasterOnce() {
  if (typesMaster.value.length) return;
  try {
    const res = await getTypes();
    typesMaster.value = (res?.data?.data ?? []).filter(
      (t) => Number(t?.active ?? 1) === 1
    );
  } catch (e) {
    console.warn("loadTypesMasterOnce error:", e);
    typesMaster.value = [];
  }
}

// โหลดเมื่อโมดัลเปิด (และโหลดครั้งเดียว)
watch(
  () => props.showModal,
  async (open) => {
    if (open) await loadTypesMasterOnce();
  },
  { immediate: true }
);

const typeNames = computed(() => {
  const v = detail.value ?? {};

  // รวบรวมเป็นเลข id[]
  let ids = [];

  // 1) array ของ object (เช่น v.types = [{id,name}, ...])
  const objArr =
    (Array.isArray(v.types) && v.types.length ? v.types : null) ??
    (Array.isArray(v.type) && typeof v.type[0] === "object" ? v.type : null);

  if (objArr) {
    ids = objArr.map((o) => Number(o?.id)).filter(Number.isFinite);
    // ถ้าบางตัวไม่มี id แต่มี name → เดาจาก master
    for (const o of objArr) {
      if (o?.id == null && o?.name) {
        const guess = [...typeIdToName.value.entries()].find(
          ([, n]) => n === String(o.name).trim()
        )?.[0];
        if (Number.isFinite(guess)) ids.push(guess);
      }
    }
  }

  // 2) กรณีอื่น
  if (!ids.length && Array.isArray(v.type_ids)) ids = v.type_ids;
  else if (!ids.length && Array.isArray(v.type)) ids = v.type;
  else if (!ids.length && typeof v.type === "string")
    ids = v.type.split(/[,\uFF0C\u3001\s]+/);
  else if (!ids.length && typeof v.type === "number") ids = [v.type];

  const idSet = new Set(ids.map((n) => Number(n)).filter(Number.isFinite));
  if (idSet.size === 0) return "-";

  // ✅ ALL เฉพาะมีครบ {1,2,3}
  const ALL_SET = new Set([1, 2, 3]);
  const isAll =
    idSet.size === ALL_SET.size && [...ALL_SET].every((id) => idSet.has(id));
  if (isAll) return "สมาชิกทุกประเภท";

  // แปลงชื่อจาก API
  const names = [...idSet]
    .map((id) => typeIdToName.value.get(id) ?? String(id))
    .filter((s) => s && s.trim().length);

  return names.length ? names.join(", ") : "-";
});

// ---------- จบการแก้ ----------

// มติ/วันที่/ปี
const meetingNo = computed(
  () => detail.value?.meeting_resolution ?? detail.value?.meeting_no ?? "-"
);
const meetingDateTH = computed(() => toThai(detail.value?.meeting_date));
const startYear = computed(() => detail.value?.start_year ?? "-");
const endYear = computed(() => detail.value?.end_year ?? "-");

// ปิดโมดัล
function handleClose() {
  props.closeModal?.();
}

// ---------------------- Edit modal ----------------------
const showEditModal = ref(false);
const selectedCurriculum = ref(null);
function openEditModal(it) {
  selectedCurriculum.value = { ...(it ?? {}) };
  showEditModal.value = true;
}
function closeEditModal() {
  showEditModal.value = false;
  selectedCurriculum.value = null;
}
async function handleRefreshData(e) {
  showEditModal.value = false;
  // ส่งผลลัพธ์ขึ้นพาเรนต์ให้รวม/เปิดโมดัลตาม flow ของพาเรนต์
  emit("refresh-data", e);
}

// กันค่าว่าง + trim (รองรับ array ด้วย)
const safeText = (val, fallback = "-") => {
  if (val === null || val === undefined) return fallback;
  if (Array.isArray(val)) val = val.join(", ");
  const s = String(val).trim();
  return s ? s : fallback;
};

// ถ้าต้องเช็คปี (4 หลักเท่านั้น) ใช้ตัวนี้
const safeYear = (val, fallback = "-") => {
  const s = String(val ?? "").trim();
  const n = Number(s);
  return s.length === 4 && Number.isFinite(n) ? s : fallback;
};

// helper
const isBlank = (v) => v == null || String(v).trim() === "";

// ✅ กดแก้ไขได้ “เมื่อเป็น ม.33” และ “specific_no ว่าง”
const canEdit = computed(() => {
  const d = detail.value ?? {};
  const s33 = d.is_section_33 === 1;
  // console.log("👉 s33:", s33);
  const specificBlank = isBlank(d.specific_no); // true = ไม่มีค่า
  // console.log("👉 specificBlank:", specificBlank);
  // ถ้า specificBlank เป็น true ปุ่มควรเปิด ก็ต่อเมื่อยังเป็น ม.33
  if (s33 === true && specificBlank === true) return false;
  // ถ้า specificBlank เป็น false ปุ่มควรเปิด ก็ตอเมื่อไม่เป็น ม.33
  if (s33 === false && specificBlank === true) return true;
});

</script>

