<template>
  <div class="text-[#414957]">
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
      <table class="w-full border-collapse table-fixed text-[14px]">
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
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] font-bold"
            >
              ปีที่เริ่มต้น
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] font-bold"
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
        <div v-if="!lookupReady" class="loading-overlay">
          <div class="loader">
            <div class="circle" tabindex="0"></div>
            <div class="circle" tabindex="0"></div>
            <div class="circle" tabindex="0"></div>
            <div class="circle" tabindex="0"></div>
            <div class="circle" tabindex="0"></div>
          </div>
        </div>

        <tbody v-else-if="Array.isArray(curriculums) && curriculums.length > 0">
          <tr
            v-for="(item, index) in curriculums"
            :key="item.id"
            :class="[
              'hover:bg-gray-50',
              item.college?.active === 0 || item.active === 0
                ? 'bg-gray-100 text-[#A0A4AB]'
                : '',
            ]"
          >
            <!-- ลำดับ -->
            <td class="border px-2 py-1 text-center">
              {{ rowNo(index) }}
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
              <span
                v-if="Number(item.is_section_33) === 1"
                class="inline-flex items-center text-xs rounded-full p-1 bg-[#F8B15D]/10 text-[#F8B15D]"
              >
                33
              </span>
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
            <td class="border px-2 py-1 break-words">
              {{ item.remark || "" }}
            </td>

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
                <div
                  v-if="canEditRow(item)"
                  class="relative inline-block group"
                >
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
import { ref, onMounted, nextTick, computed } from "vue";
import EditCurriculumModal from "./EditCurriculumModal.vue";
import DetailCurriculumModal from "./DetailCurriculumModal.vue";
import { useTypeLookup } from "@/composables/useLookups";

const {
  ready: lookupReady,
  typeLookup,
  ensureReady: ensureTypeLookupReady,
} = useTypeLookup();
onMounted(async () => {
  await ensureTypeLookupReady();
});

const emit = defineEmits(["refresh", "refreshData"]);
const props = defineProps({
  curriculums: { type: Array, required: true },
  meta: { type: Object, required: true },
  total: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const showEditModal = ref(false);
const selectedCurriculum = ref(null);
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
  showEditModal.value = false;
  const id =
    e?.id ?? selectedCurriculum.value?.id ?? detailCurriculum.value?.id ?? null;
  detailCurriculum.value = {
    ...(detailCurriculum.value || {}),
    ...(selectedCurriculum.value || {}),
    ...(e?.atch || {}),
    id,
  };
  await nextTick();
  showDetailModal.value = true;
  emit("refreshData", e);
  emit("refresh", e);
}

const showDetailModal = ref(false);
const detailCurriculum = ref(null);

async function openDetailModal(item) {
  await ensureTypeLookupReady();
  detailCurriculum.value = { ...item };
  showDetailModal.value = true;
}

async function openEditModal(item) {
  await ensureTypeLookupReady();
  selectedCurriculum.value = { ...item };
  showEditModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  detailCurriculum.value = null;
}

const TYPE_ALL_NAME = "สมาชิกทุกประเภท";
const ALL_SET = new Set([1, 2, 3]);

function rowNo(i) {
  const per = Number(props.meta?.per_page ?? props.meta?.limit ?? 10) || 10;
  const page = Number(props.meta?.current_page ?? 1) || 1;
  return per * (page - 1) + i + 1;
}

function renderTypes(item) {
  if (!lookupReady.value) return "-";
  const raw =
    (Array.isArray(item?.types) && item.types.length && item.types) ||
    (Array.isArray(item?.type_ids) && item.type_ids.length && item.type_ids) ||
    (Array.isArray(item?.type) && item.type.length && item.type) ||
    item?.type ||
    null;

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
        else if (typeof it === "string" && /^-?\d+(\.\d+)?$/.test(it.trim()))
          pushId(it.trim());
      }
      return out;
    }
    if (typeof v === "string") {
      return v
        .split(/[,\uFF0C\u3001\s]+/)
        .map((s) => Number(s.trim()))
        .filter(Number.isFinite);
    }
    if (typeof v === "number") return [v];
    return out;
  };

  let ids = toIds(raw);
  const seen = new Set();
  ids = ids.filter((n) => (seen.has(n) ? false : (seen.add(n), true)));

  if (
    ids.length &&
    ALL_SET.size === ids.length &&
    [...ALL_SET].every((id) => ids.includes(id))
  ) {
    return TYPE_ALL_NAME;
  }

  const nameById = typeLookup.value || {};
  const names = ids
    .map((id) => nameById[id])
    .filter((s) => typeof s === "string" && s.trim().length);

  if (names.length === 0) {
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    return ids.join(", ");
  }
  return names.join(", ");
}
// helpers
const isBlank = (v) => v == null || String(v).trim() === "";

// ใช้ได้กับแต่ละแถว
const canEditRow = (row) => {
  if (!row) return false; // กัน null/undefined
  const s33 = Number(row.is_section_33) === 1;
  const specificBlank = isBlank(row.specific_no);
  if (s33 === true && specificBlank === true) return false; // ม.33 และ specific_no ว่าง)
  if (s33 === false && specificBlank === true) return true; // ไม่ม.33 และ specific_no ว่าง
};
</script>

