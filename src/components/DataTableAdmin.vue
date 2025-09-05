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
      <table class="w-full border-collapse sm:text-base">
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
              ชื่อสถาบันการศึกษา
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
              ปีเริ่มต้น
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[50px] font-bold"
            >
              ปีสิ้นสุด
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] font-bold"
            >
              รายละเอียด
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[30px] font-bold"
            >
              สถานะ
            </th>
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[30px] font-bold"
            >
              จัดการ
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in curriculums"
            :key="item.id"
            :class="[
              'hover:bg-gray-50',
              item.active === 0 ? 'bg-gray-100 text-gray-300' : '',
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

            <!-- ปีเริ่มต้น / สิ้นสุด -->
            <td class="border px-2 py-1 text-center">
              {{ item.start_year || "" }}
            </td>
            <td class="border px-2 py-1 text-center">
              {{ item.end_year || "" }}
            </td>

            <!-- หมายเหตุ -->
            <td class="border px-2 py-1">{{ item.remark || "" }}</td>

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
      </table>
    </div>
  </div>

  <!-- Modal แก้ไข -->
  <EditCurriculumModal
    :showModal="showEditModal"
    :curriculum="selectedCurriculum"
    :closeModal="closeEditModal"
    @refresh-data="handleRefreshData"
  />

  <!-- Modal รายละเอียด -->
  <DetailCurriculumModal
    :showModal="showDetailModal"
    :curriculum="detailCurriculum"
    :closeModal="closeDetailModal"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue"; // ✅ เพิ่ม onMounted
import EditCurriculumModal from "./EditCurriculumModal.vue";
import DetailCurriculumModal from "./DetailCurriculumModal.vue"; // ✅ ถ้าใช้โมดัลรายละเอียด
import { getTypes } from "@/services/apiService";

// props: เปลี่ยน default เป็น null
const props = defineProps({
  curriculums: { type: Array, required: true },
  meta: { type: Object, required: true },
  total: { type: Number, default: 0 },
});

// ---------------------- Edit modal ----------------------
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
const handleRefreshData = (e) => emit("refreshData", e);

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
const typeLookup = ref({}); // { id: name }
const typeAllId = ref(null); // id ของ "สมาชิกทุกประเภท"

async function loadTypeLookup() {
  try {
    const res = await getTypes();
    const list = Array.isArray(res?.data?.data) ? res.data.data : [];
    const active = list.filter((t) => Number(t.active) === 1);
    typeLookup.value = Object.fromEntries(
      active.map((t) => [Number(t.id), String(t.type_name)])
    );
    typeAllId.value =
      active.find((t) => t.type_name === TYPE_ALL_NAME)?.id ?? 1;
  } catch (e) {
    console.error("getTypes error:", e);
  }
}
onMounted(loadTypeLookup); // ✅ เรียกหลัง import แล้ว

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
  // 1) ถ้ามาเป็น objects [{id,name}]
  if (Array.isArray(item.types) && item.types.length) {
    const names = item.types
      .map((t) => t?.name || typeLookup.value[Number(t?.id)])
      .filter(Boolean);
    if (!names.length) return "";
    if (names.includes(TYPE_ALL_NAME)) return TYPE_ALL_NAME;
    return [...new Set(names)].join(", ");
  }
  // 2) ถ้ามี ids (type_ids) หรือ field type
  let ids = [];
  if (Array.isArray(item.type_ids) && item.type_ids.length) {
    ids = normalizeIds(item.type_ids);
  } else if (item.type != null) {
    ids = normalizeIds(item.type);
    if (!ids.length && typeof item.type === "string") {
      // เผื่อ API ส่งเป็นชื่ออยู่แล้ว
      if (item.type.includes("สมาชิก")) return item.type;
    }
  }
  if (!ids.length) return "";
  const allId = Number(typeAllId.value ?? 1);
  if (ids.includes(allId)) return TYPE_ALL_NAME;
  return ids
    .map((id) => typeLookup.value[id])
    .filter(Boolean)
    .join(", ");
}
</script>
