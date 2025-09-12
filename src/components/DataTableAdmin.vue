<template>
  <div class="text-[#707781]">
    <div class="mb-2 flex justify-start">
      <p class="text-lg font-bold mb-3 sm:mb-0">
        จำนวน
        {{
          Number(
            total ?? meta?.total ?? curriculums?.length ?? 0
          ).toLocaleString("th-TH-u-nu-latn")
        }}
        หลักสูตร
      </p>
    </div>

    <!-- ตาราง -->
    <div
      class="overflow-y-auto md:overflow-y-hidden border border-gray-300 rounded-lg"
    >
      <table class="w-full border-collapse sm:text-base table-fixed">
        <thead>
          <tr class="bg-[#E2EDFC]">
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[50px] font-bold"
            >
              ลำดับ
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[200px] font-bold"
            >
              ชื่อสถาบัน
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[250px] font-bold"
            >
              ชื่อหลักสูตร
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[200px] font-bold"
            >
              หลักสูตร
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] font-bold"
            >
              ระดับการศึกษา
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] font-bold"
            >
              หลักสูตรสำหรับ
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[50px] font-bold"
            >
              ปีที่เริ่มต้น
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[50px] font-bold"
            >
              ปีที่สิ้นสุด
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] font-bold"
            >
              รายละเอียด
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] font-bold"
            >
              สถานะ
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] font-bold"
            >
              จัดการ
            </th>
          </tr>
        </thead>

        <tbody v-if="Array.isArray(curriculums) && curriculums.length > 0">
          <tr
            v-for="(item, index) in curriculums"
            :key="item.id"
            :class="[
              'hover:bg-gray-50',
              item.college.active === 0 || item.active === 0
                ? 'bg-gray-100 text-gray-400'
                : '',
            ]"
          >
            <!-- ลำดับ -->
            <td class="border px-2 py-1 text-center">
              {{ meta.per_page * (meta.current_page - 1) + index + 1 }}
            </td>

            <!-- ชื่อสถาบัน -->
            <td class="border px-2 py-1">
              {{
                item.college
                  ? item.college.name +
                    (item.college.campus ? ` ${item.college.campus}` : "")
                  : ""
              }}

              <span
                v-if="item.college"
                class="inline-flex items-center text-xs px-2.5 py-1 rounded-full ml-2"
                :class="
                  item.college.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
              >
                {{ item.college.active ? "ใช้งาน" : "ไม่ใช้งาน" }}
              </span>
            </td>

            <!-- ชื่อหลักสูตร -->
            <td class="border px-2 py-1">
              {{ item.name || "" }}
              <span
                class="inline-flex items-center text-xs px-2.5 py-1 rounded-full ml-2"
                :class="
                  item.is_curriculum_published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-[#FEF7EF] text-[#F8B15D]'
                "
              >
                {{ item.is_curriculum_published ? "เผยแพร่" : "ไม่เผยแพร่" }}
              </span>
            </td>

            <!-- คำอธิบายหลักสูตร -->
            <td class="border px-2 py-1">
              {{ item.description || "" }}
            </td>

            <!-- ระดับการศึกษา -->
            <td class="border px-2 py-1 text-center">
              {{ item.degree?.name || "" }}
            </td>

            <!-- หลักสูตรสำหรับ -->
            <td class="border px-2 py-1 text-center">
              {{ renderTypes(item) }}
            </td>

            <!-- ปีที่เริ่มต้น / สิ้นสุด -->
            <td class="border px-2 py-1 text-center">
              {{ item.start_year || "" }}
            </td>
            <td class="border px-2 py-1 text-center">
              {{ item.end_year || "" }}
            </td>

            <!-- หมายเหตุ -->
            <td class="border px-2 py-1 break-words">{{ item.remark || "" }}</td>

            <!-- สถานะ -->
            <td class="border px-2 py-1 text-center">
              <span
                class="inline-flex items-center text-xs px-2.5 py-1 rounded-full"
                :class="
                  item.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
              >
                {{ item.active ? "ใช้งาน" : "ไม่ใช้งาน" }}
              </span>
            </td>

            <!-- จัดการ -->
            <td class="border px-2 py-1">
              <div class="flex flex-row gap-2 items-center justify-center">
                <!-- View Detail -->
                <div class="relative inline-block group">
                  <button
                    @click.stop="openDetailModal(item)"
                    :aria-describedby="`tt-view-${item.id}`"
                    class="inline-flex items-center bg-[#0085DB] text-white w-10 h-10 rounded-full hover:bg-blue-500 transition justify-center"
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" class="size-7">
                      <path
                        d="M4.5 12.5C7.5 6 16.5 6 19.5 12.5"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <div
                    :id="`tt-view-${item.id}`"
                    role="tooltip"
                    class="pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 invisible transition-opacity duration-200 group-hover:opacity-100 group-hover:visible"
                  >
                    View detail
                    <span
                      class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"
                    ></span>
                  </div>
                </div>

                <!-- Edit -->
                <div class="relative inline-block group">
                  <button
                    @click.stop="openEditModal(item)"
                    :aria-describedby="`tt-edit-${item.id}`"
                    class="inline-flex items-center bg-[#F8B15D] text-white w-10 h-10 rounded-full hover:bg-orange-500 transition justify-center"
                    type="button"
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
                  <div
                    :id="`tt-edit-${item.id}`"
                    role="tooltip"
                    class="pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 invisible transition-opacity duration-200 group-hover:opacity-100 group-hover:visible"
                  >
                    Edit
                    <span
                      class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"
                    ></span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="9" class="text-center text-gray-500 py-6">
              ไม่พบข้อมูล
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <EditCurriculumModal
    v-if="showEditModal"
    :key="selectedCurriculum?.id ?? 'new'"
    :showModal="showEditModal"
    :curriculum="selectedCurriculum"
    :closeModal="closeEditModal"
    @refresh-data="handleEditSaved"
  />

  <!-- Modal รายละเอียด -->
  <DetailCurriculumModal
    :showModal="showDetailModal"
    :curriculum="detailCurriculum"
    :closeModal="closeDetailModal"
    @request-edit="openEditFromDetail"
  />
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue"; // ✅ เพิ่ม onMounted
import EditCurriculumModal from "./EditCurriculumModal.vue";
import DetailCurriculumModal from "./DetailCurriculumModal.vue"; // ✅ ถ้าใช้โมดัลรายละเอียด
import { getTypes } from "@/services/apiService";

const emit = defineEmits(["refresh", "refreshData"]);
// props: เปลี่ยน default เป็น null
const props = defineProps({
  curriculums: { type: Array, required: true },
  meta: { type: Object, required: true },
  total: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

/// ---------------------- Edit modal ----------------------
const showEditModal = ref(false);
const selectedCurriculum = ref(null);

function openEditModal(item) {
  selectedCurriculum.value = { ...item };
  showEditModal.value = true;
}

// ✅ เรียกจาก DetailCurriculumModal
function openEditFromDetail(curr) {
  showDetailModal.value = false;
  selectedCurriculum.value = { ...(curr || detailCurriculum.value || {}) };
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  selectedCurriculum.value = null;
}

async function handleEditSaved(e) {
  // ปิด Edit ก่อน
  showEditModal.value = false;

  // หา id ที่เชื่อถือได้
  const id =
    e?.id ?? selectedCurriculum.value?.id ?? detailCurriculum.value?.id ?? null;

  // รวม payload ล่าสุดกลับเข้า detailCurriculum
  detailCurriculum.value = {
    ...(detailCurriculum.value || {}),
    ...(selectedCurriculum.value || {}),
    ...(e?.atch || {}), // payload ที่ emit มาจาก EditCurriculumModal
    id,
  };

  // ให้ DOM อัปเดตก่อน แล้วค่อยเปิด Detail (กันอาการกะพริบ/ซ้อน)
  await nextTick();
  showDetailModal.value = true;

  // แจ้งให้พาเรนต์รีเฟรชตาราง ถ้าต้องการ
  emit("refreshData", e);
  emit("refresh", e);
}
// ---------------------- Detail modal ----------------------
const showDetailModal = ref(false);
const detailCurriculum = ref(null);
function openDetailModal(item) {
  detailCurriculum.value = { ...item };
  showDetailModal.value = true;
}
function closeDetailModal() {
  showDetailModal.value = false;
  detailCurriculum.value = null;
}

// ---------------------- ประเภทสมาชิก (mapping) ----------------------
const TYPE_ALL_NAME = "สมาชิกทุกประเภท";
const ALL_SET = new Set([1, 2, 3]);
const typeLookup = ref({});
async function loadTypeLookup() {
  try {
    const res = await getTypes();
    const list = Array.isArray(res?.data?.data) ? res.data.data : [];
    const active = list.filter((t) => Number(t.active) === 1);
    typeLookup.value = Object.fromEntries(
      active.map((t) => [Number(t.id), String(t.type_name)])
    );
  } catch (e) {
    console.error("getTypes error:", e);
  }
}
onMounted(async () => {
  await loadTypeLookup();
  console.log("typeLookup:", typeLookup.value); // {1: 'สมาชิกสามัญ', 2: 'สมาชิกวิสามัญ', 3: 'สมาชิกสมทบ', ...}
});
// ✅ เรียกหลัง import แล้ว
const typeNameToId = computed(() => {
  const m = new Map();
  for (const [id, name] of Object.entries(typeLookup.value)) {
    if (name) m.set(String(name).trim(), Number(id));
  }
  return m;
});

// id ของประเภท "จริง" ทั้งหมด (ยกเว้น "สมาชิกทุกประเภท")
const realTypeIds = computed(() =>
  Object.entries(typeLookup.value)
    .filter(([, name]) => String(name).trim() !== TYPE_ALL_NAME)
    .map(([id]) => Number(id))
    .filter(Number.isFinite)
);

function normalizeIds(val) {
  if (Array.isArray(val))
    return val.map((n) => Number(n)).filter(Number.isFinite);
  if (typeof val === "string")
    return val
      .split(/[,\uFF0C\u3001\s]+/)
      .map((s) => Number(s.trim()))
      .filter(Number.isFinite);
  if (typeof val === "number") return [val];
  return [];
}

function renderTypes(item) {
  // 1) ดึง raw จากหลายฟิลด์ที่เป็นไปได้ (ตามโครงสร้างระบบคุณ)
  const raw =
    (Array.isArray(item?.types) && item.types.length && item.types) ||
    (Array.isArray(item?.type_ids) && item.type_ids.length && item.type_ids) ||
    (Array.isArray(item?.type) && item.type.length && item.type) ||
    item?.type ||
    null;

  // 2) แปลงให้กลายเป็น array ของตัวเลข ids
  const toIds = (v) => {
    const out = [];
    const pushId = (x) => {
      const n = Number(x);
      if (Number.isFinite(n)) out.push(n);
    };
    if (Array.isArray(v)) {
      for (const it of v) {
        if (it && typeof it === "object" && it.id != null) pushId(it.id);
        else if (typeof it === "number") pushId(it);
        else if (typeof it === "string") {
          // สตริงเลขเดี่ยว
          if (/^-?\d+(\.\d+)?$/.test(it.trim())) pushId(it.trim());
          else {
            // กรณีเป็นชื่อ (เช่น “สมาชิกวิสามัญ”) ปล่อยผ่านไว้ เพราะกรณีนี้ของคุณส่งมาเป็นตัวเลขอยู่แล้ว
          }
        }
      }
      return out;
    }
    if (typeof v === "string") {
      // ✅ เคสหลักของคุณ: "1,2,3" / "2,3"
      return v
        .split(/[,\uFF0C\u3001\s]+/)
        .map((s) => Number(s.trim()))
        .filter(Number.isFinite);
    }
    if (typeof v === "number") return [v];
    return out;
  };

  let ids = toIds(raw);

  // 3) dedupe รักษาลำดับ
  const seen = new Set();
  ids = ids.filter((n) => (seen.has(n) ? false : (seen.add(n), true)));

  // 4) ถ้าเป็นชุดครบทุกประเภท {1,2,3} → แสดง "สมาชิกทุกประเภท"
  if (
    ids.length &&
    ALL_SET.size === ids.length &&
    [...ALL_SET].every((id) => ids.includes(id))
  ) {
    return TYPE_ALL_NAME;
  }

  // 5) map id -> name จาก lookup (โหลดจาก getTypes)
  const nameById = typeLookup.value || {};
  const names = ids
    .map((id) => nameById[id])
    .filter((s) => typeof s === "string" && s.trim().length);

  // 6) ถ้า lookup ยังไม่มา (หรือบาง id ยังหาชื่อไม่เจอ) ให้ fallback เป็น id
  if (names.length === 0) {
    // ถ้า raw เดิมเป็น string (เช่น "2,3") ให้แสดงมันก่อนเป็น fallback
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    // ไม่งั้นก็แสดงเป็น id คั่น comma
    return ids.join(", ");
  }

  return names.join(", ");
}
</script>
