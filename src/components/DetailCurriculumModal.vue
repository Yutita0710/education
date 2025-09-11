<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative">
      <!-- แถวหัวข้อ + ปุ่ม -->
      <div class="mb-6 grid grid-cols-[1fr_auto_1fr] items-center">
        <!-- คอลัมน์ซ้าย (ปล่อยว่างไว้ให้บาลานซ์ความกว้างกับขวา) -->
        <div></div>

        <!-- คอลัมน์กลาง: หัวข้ออยู่กึ่งกลางจริง -->
        <h2 class="text-xl font-bold text-center">รายละเอียดหลักสูตร</h2>

        <!-- คอลัมน์ขวา: ปุ่มสองอันชิดขวาและวางติดกัน -->
        <div class="justify-self-end flex items-center gap-2">
          <!-- ปุ่มดินสอ -->
          <button
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
      <div v-if="isLoading" class="py-8 text-center text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
      <div v-else-if="loadError" class="py-6 text-center">
        <p class="text-red-600">ไม่สามารถดึงข้อมูลได้: {{ loadError }}</p>
      </div>

      <!-- Content -->
      <div class="px-14 space-y-6 py-10" v-else>
        <!-- แถวทั่วไป (2 คอลัมน์) -->
        <dl class="grid grid-cols-[210px_1fr] gap-x-6 gap-y-3">
          <dt class="text-gray-600 font-semibold">ชื่อสถาบัน</dt>
          <dd class="text-gray-900">{{ collegeName }}</dd>

          <dt class="text-gray-600 font-semibold">ชื่อหลักสูตร</dt>
          <dd class="text-gray-900 break-words">{{ detail.name ?? "-" }}</dd>

          <dt class="text-gray-600 font-semibold">หลักสูตร</dt>
          <dd class="text-gray-900 break-words">{{ description }}</dd>

          <dt class="text-gray-600 font-semibold">ระดับการศึกษา</dt>
          <dd class="text-gray-900">{{ degreeName }}</dd>

          <dt class="text-gray-600 font-semibold">หลักสูตรสำหรับ</dt>
          <dd class="text-gray-900">{{ typeNames }}</dd>

          <dt class="text-gray-600 font-semibold">รายละเอียด</dt>
          <dd class="text-gray-900 whitespace-pre-wrap">
            {{ detail.remark ?? "-" }}
          </dd>
        </dl>

        <!-- มติ/วันที่ (4 คอลัมน์) -->
        <dl class="mt-4 grid grid-cols-[210px_1fr_210px_1fr] gap-x-6 gap-y-3">
          <dt class="text-gray-600 font-semibold">มติการประชุมครั้งที่</dt>
          <dd class="text-gray-900">{{ meetingNo }}</dd>

          <dt class="text-gray-600 font-semibold">วันที่ประชุม</dt>
          <dd class="text-gray-900">{{ meetingDateTH }}</dd>
        </dl>

        <!-- ปีเริ่ม/สิ้นสุด (4 คอลัมน์) -->
        <dl class="mt-2 grid grid-cols-[210px_1fr_210px_1fr] gap-x-6 gap-y-3">
          <dt class="text-gray-600 font-semibold">ปีที่เริ่มต้น (พ.ศ.)</dt>
          <dd class="text-gray-900">{{ startYear }}</dd>

          <dt class="text-gray-600 font-semibold">ปีที่สิ้นสุด (พ.ศ.)</dt>
          <dd class="text-gray-900">{{ endYear }}</dd>
        </dl>

        <!-- ป้ายสถานะ (2 คอลัมน์) -->
        <dl class="mt-2 grid grid-cols-[210px_1fr] gap-x-6 gap-y-3">
          <dt class="text-gray-600 font-semibold">สถานะการเผยแพร่</dt>
          <dd>
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

          <dt class="text-gray-600 font-semibold">สถานะการใช้งาน</dt>
          <dd>
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

        <!-- ปุ่มปิด
        <div class="flex justify-center pt-6">
          <button
            type="button"
            @click="handleClose"
            class="bg-[#F95668] hover:bg-[#F95668]/90 text-white px-6 py-2 rounded-full shadow transition"
          >
            ปิด
          </button>
        </div> -->
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
import { computed, ref } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/th";
import EditCurriculumModal from "./EditCurriculumModal.vue";
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
  emit('request-edit', { ...(detail.value || {}) });
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
const TYPE_NAME_BY_ID = {
  1: "สมาชิกทุกประเภท",
  2: "สมาชิกสามัญ",
  3: "สมาชิกวิสามัญ",
  4: "สมาชิกสมทบ",
};

const typeNames = computed(() => {
  const v = detail.value ?? {};

  // 1) มีชื่อมาแล้วเป็นออบเจ็กต์ (รองรับทั้ง v.types และ v.type)
  const objArray =
    (Array.isArray(v.types) && v.types.length ? v.types : null) ??
    (Array.isArray(v.type) && typeof v.type[0] === "object" ? v.type : null);

  if (objArray) {
    const names = objArray.map((t) => t?.name).filter(Boolean);
    if (names.includes("สมาชิกทุกประเภท")) return "สมาชิกทุกประเภท";
    return names.join(", ") || "-";
  }

  // 2) มีเป็น id: รองรับ array ของ id, สตริงคอมมา, หรือเลขเดี่ยว
  let ids = [];
  if (Array.isArray(v.type_ids)) {
    ids = v.type_ids;
  } else if (Array.isArray(v.type)) {
    ids = v.type;
  } else if (typeof v.type === "string") {
    ids = v.type.split(",").map((s) => Number(s.trim()));
  } else if (typeof v.type === "number") {
    ids = [v.type];
  }

  ids = Array.from(
    new Set(ids.map((n) => Number(n)).filter((n) => Number.isFinite(n)))
  );
  if (!ids.length) return "-";

  if (ids.includes(1)) return "สมาชิกทุกประเภท";

  const names = ids.map((id) => TYPE_NAME_BY_ID[id]).filter(Boolean);
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
  // ปิด Edit
  showEditModal.value = false;

  // แจ้ง parent ให้รีเฟรชลิสต์
  emit("refreshData", e);
  emit("refresh", e);

  // เปิด Detail กลับ (ใช้ข้อมูลที่แก้ไขแล้ว)
  const id =
    e?.id ?? selectedCurriculum.value?.id ?? detailCurriculum.value?.id ?? null;

  // แบบเร็ว ๆ (ไม่เรียก API): รวม payload เข้ากับที่เคยเปิดอยู่
  if (id) {
    detailCurriculum.value = {
      ...(detailCurriculum.value || {}),
      ...(e?.atch || {}), // payload ที่ Edit ส่งคืน
      id,
    };
  }
  showDetailModal.value = true;
}
</script>

