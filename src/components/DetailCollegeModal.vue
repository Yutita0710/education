<template>
  <div>
    <div
      v-if="internalShow"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
      v-bind="$attrs"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl relative h-[70vh] overflow-hidden">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="sticky top-0 z-20 bg-white px-6 pt-6 pb-4 border-b">
            <div class="grid grid-cols-[1fr_auto_1fr] items-center">
              <div></div>
              <h2 class="text-[17px] font-bold text-center">รายละเอียดสถาบัน</h2>

              <div class="justify-self-end flex items-center gap-2">
                <button
                  @click.stop="onEditClick"
                  :aria-describedby="detail?.id ? `tt-edit-${detail.id}` : 'tt-edit'"
                  type="button"
                  class="inline-flex items-center bg-[#F8B15D] text-white w-20 h-10 rounded-full hover:bg-orange-500 transition justify-center"
                  aria-label="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                  </svg>
                  แก้ไข
                </button>

                <button
                  @click="handleClose"
                  type="button"
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="currentColor" class="size-20">
                    <path fill-rule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                          clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-14 py-4 space-y-4 [scrollbar-gutter:stable] overscroll-contain detail-body">
            <!-- Skeleton -->
            <div v-if="isLoading" class="space-y-4 animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            <template v-else>
              <div class="grid grid-cols-[210px_minmax(0,1fr)] gap-6 items-start">
                <div class="md:text-left">
                  <label class="block text-gray-700">
                    <span class="inline-flex items-center gap-1 text-[15px] font-semibold">ชื่อสถาบัน</span>
                  </label>
                </div>
                <div class="min-w-0">
                  <span class="block text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]">
                    {{ safeText(detail.name) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-[210px_1fr] gap-6">
                <div class="md:text-left">
                  <label class="block text-gray-700">
                    <span class="inline-flex items-center gap-1 text-[15px] font-semibold">วิทยาเขต</span>
                  </label>
                </div>
                <div>
                  <span class="text-gray-900 min-w-0 whitespace-normal break-words hyphens-auto text-[14px]">
                    {{ safeText(detail.campus) }}
                  </span>
                </div>
              </div>

              <div v-if="sameGroupAsSelf" class="grid grid-cols-[210px_1fr] gap-6">
                <div class="md:text-left">
                  <label class="block text-gray-700">
                    <span class="inline-flex items-center gap-1 text-[15px] font-semibold">กลุ่มสถาบัน</span>
                  </label>
                </div>
                <div><span class="text-gray-900 text-[14px]">-</span></div>
              </div>

              <div v-else-if="hasGroup" class="mb-6 flex flex-col gap-4">
                <div>
                  <label class="block text-gray-700 mb-2">
                    <span class="flex items-center gap-1 text-[15px] font-semibold">กลุ่มสถาบัน</span>
                  </label>
                </div>
                <div>
                  <div class="relative overflow-x-auto shadow-md sm:rounded-lg"
                       :class="(groupColleges?.length ?? 0) > 3 ? 'overflow-y-auto max-h-[calc(3*3rem+3rem)]' : ''">
                    <table class="w-full table-fixed text-sm text-left rtl:text-right text-gray-500">
                      <thead class="font-medium text-gray-700 uppercase bg-[#E2EDFC] sticky top-0 z-10">
                        <tr>
                          <th scope="col" class="px-6 py-3">ลำดับ</th>
                          <th scope="col" class="px-6 py-3">ชื่อสถาบัน</th>
                          <th scope="col" class="px-6 py-3">วิทยาเขต</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(g, idx) in groupColleges" :key="g.id || idx"
                            class="border-b border-gray-200 odd:bg-white even:bg-gray-50"
                            :class="Number(g.id) === Number(detail.id) ? 'bg-blue-50' : ''">
                          <td class="px-6 py-4">{{ idx + 1 }}</td>
                          <th scope="row" class="px-6 py-4 text-gray-900 min-w-0 whitespace-normal break-words">
                            {{ g.name || '-' }}
                          </th>
                          <td class="px-6 py-4 min-w-0 whitespace-normal break-words">{{ g.campus || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-[210px_1fr] gap-6">
                <div class="md:text-left">
                  <label class="block text-gray-700">
                    <span class="inline-flex items-center gap-1 text-[15px] font-semibold">ประเทศ</span>
                  </label>
                </div>
                <div>
                  <span class="text-gray-900 text-[14px]">{{ safeText(countryDisplay) }}</span>
                </div>
              </div>

              <div class="grid grid-cols-[210px_minmax(0,1fr)] gap-6">
                <div class="md:text-left">
                  <label class="block text-gray-700">
                    <span class="inline-flex items-center gap-1 text-[15px] font-semibold">จังหวัด</span>
                  </label>
                </div>
                <div class="min-w-0">
                  <span class="text-gray-900 text-[14px]">{{ safeText(provinceDisplay) }}</span>
                </div>
              </div>

              <div class="grid grid-cols-[210px_1fr] gap-6">
                <div class="md:text-left">
                  <label class="block text-gray-700">
                    <span class="inline-flex items-center gap-1 text-[15px] font-semibold">จำนวนหลักสูตร</span>
                  </label>
                </div>
                <div>
                  <span class="text-gray-900 text-[14px]">{{ safeText(detail.curriculumCount) }} หลักสูตร</span>
                </div>
              </div>

              <div class="grid grid-cols-[210px_1fr] gap-6">
                <div class="md:text-left">
                  <label class="block text-gray-700">
                    <span class="inline-flex items-center gap-1 text-[15px] font-semibold">สถานะการใช้งาน</span>
                  </label>
                </div>
                <div>
                  <span class="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        :class="Number(detail.active) === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ Number(detail.active) === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditCollegeModal
      :showModal="showEditModal"
      :selectedCollege="selectedCollege"
      @close="closeEditModal"
      @saved="onEditSaved"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, toRaw } from "vue";
import { getCollegesById, countCurriculum, getCollegesGrouped } from "@/services/apiService";
import EditCollegeModal from "./EditCollegeModal.vue";
import { useLookups } from "@/composables/useLookups";

/* ===== Lookups (ประเทศ/จังหวัด) ===== */
const { ensureLoaded, displayCountry, displayProvince } = useLookups();
onMounted(() => { ensureLoaded(); });

defineOptions({ inheritAttrs: false });

/* ===== Props / Emits ===== */
const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, default: () => {} },
  collegeId: { type: [Number, String], default: null },
  initialDetail: { type: Object, default: null },
  // ✅ เปิดทันที พร้อม skeleton
  openAfterLoaded: { type: Boolean, default: false },
});
const emit = defineEmits(["request-edit", "close", "refresh-data", "saved"]);

/* ===== Local State ===== */
const internalShow = ref(false);
let reqId = 0;

const isLoading = ref(false);
const loadError = ref("");
const groupColleges = ref([]);

const detail = reactive({
  id: null,
  name: "",
  campus: "",
  country: null,
  province: null,
  province_name: null,
  countryName: "",
  provinceName: "",
  curriculumCount: 0,
  active: 0,
  institute_group: null,
  institute_group_name: "",
  group: [],
});

/* ===== Edit Modal State ===== */
const showEditModal = ref(false);
const selectedCollege = ref(null);

function onEditClick() {
  selectedCollege.value = { ...toRaw(detail) };
  showEditModal.value = true;
  emit("request-edit", { ...toRaw(detail) });
}
function closeEditModal() {
  showEditModal.value = false;
  selectedCollege.value = null;
}

/* ===== Display via lookups ===== */
const countryDisplay  = computed(() => displayCountry(detail.countryName || detail.country || detail.country_id, "-"));
const provinceDisplay = computed(() => displayProvince(detail.provinceName || detail.province || detail.province_id, "-"));

const sameGroupAsSelf = computed(() => {
  const id  = detail?.id != null ? String(detail.id) : "";
  const gid = detail?.institute_group != null ? String(detail.institute_group) : "";
  return gid !== "" && id !== "" && gid === id;
});
const hasGroup = computed(() => Array.isArray(groupColleges.value) && groupColleges.value.length > 0);

/* ===== Utils ===== */
const isFilled = (v) => v !== null && v !== undefined && String(v).trim() !== "";
const pickFirst = (...vals) => vals.find(isFilled);
const toIntOrNull = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };

function prefillFromInitial() {
  if (!props.initialDetail) return;
  const src = props.initialDetail;
  const fields = ["id","name","campus","country","province","province_name","countryName","provinceName","curriculumCount","active","institute_group","institute_group_name","group"];
  for (const k of fields) {
    const v = src?.[k];
    if (v !== undefined && v !== null) detail[k] = v;
  }
}

/* ===== Detail Fetch (fast-first, then background) ===== */
async function fetchDetail() {
  if (!props.collegeId) return;
  const myReq = ++reqId;

  isLoading.value = true;
  loadError.value = "";

  try {
    // 1) โหลดข้อมูลหลักก่อน
    const res = await getCollegesById(props.collegeId);
    const data = res?.data?.data ?? res?.data?.item ?? res?.data ?? null;
    if (!data) throw new Error("ไม่พบข้อมูลจากเซิร์ฟเวอร์");
    if (myReq !== reqId) return;

    detail.id = data.id ?? null;
    detail.name = data.name ?? "";
    detail.campus = data.campus ?? "";
    detail.country = data.country ?? data.country_id ?? data.code ?? null;
    detail.province = data.province ?? data.province_id ?? null;
    detail.province_name = data.province_name ?? null;
    detail.countryName = data.countryName ?? "";
    detail.provinceName = data.provinceName ?? "";
    detail.active = Number(data.active ?? 0) === 1 ? 1 : 0;

    const rawGroupId = pickFirst(data.institute_group_id, data.institute_group, data.group_id, data.group?.id);
    const rawGroupName = pickFirst(data.institute_group_name, data.group_name, data.group?.name);
    detail.institute_group = isFilled(rawGroupId) ? String(rawGroupId) : null;
    if (rawGroupName) detail.institute_group_name = rawGroupName;

    // 2) ปล่อย skeleton หายก่อน
    isLoading.value = false;

    // 3) งานเบื้องหลัง (ไม่บล็อก UI)
    const groupIdNum = toIntOrNull(detail.institute_group);

    // 3.1 นับหลักสูตรทั้งหมด
    countCurriculum({})
      .then((countRes) => {
        if (myReq !== reqId) return;
        const arr = countRes?.data?.data ?? countRes?.data ?? [];
        const map = {};
        for (const cur of arr) {
          const key = Number(cur.college_id ?? cur.id ?? cur.collegeId);
          const cnt = Number(cur.curriculum_count ?? cur.count ?? 0);
          if (Number.isFinite(key)) map[key] = Number.isFinite(cnt) ? cnt : 0;
        }
        detail.curriculumCount = map[Number(detail.id)] ?? detail.curriculumCount ?? 0;

        // อัปเดตจำนวนในรายการกลุ่ม (ถ้ามี)
        groupColleges.value = groupColleges.value.map(r => ({
          ...r,
          curriculumCount: r.id != null ? (map[r.id] ?? r.curriculumCount ?? 0) : (r.curriculumCount ?? 0),
        }));
      })
      .catch(() => {/* เงียบไว้ */});

    // 3.2 โหลดสมาชิกกลุ่ม
    if (groupIdNum) {
      getCollegesGrouped(groupIdNum)
        .then((groupRes) => {
          if (myReq !== reqId) return;

          const inferredGroupName = pickFirst(
            groupRes?.data?.group_name,
            groupRes?.data?.group?.name,
            groupRes?.data?.name
          );
          if (!detail.institute_group_name && inferredGroupName) {
            detail.institute_group_name = inferredGroupName;
          }

          let rawRows =
            (Array.isArray(groupRes?.data?.data) && groupRes.data.data) ||
            (Array.isArray(groupRes?.data?.items) && groupRes.data.items) ||
            (Array.isArray(groupRes?.data?.rows) && groupRes.data.rows) ||
            (Array.isArray(groupRes?.data?.colleges) && groupRes.data.colleges) ||
            (Array.isArray(groupRes?.data?.members) && groupRes.data.members) ||
            (Array.isArray(groupRes?.data?.group?.colleges) && groupRes.data.group.colleges) ||
            (Array.isArray(groupRes?.data) && groupRes.data) ||
            [];

          const normalized = rawRows.map((r) => {
            const rid = toIntOrNull(pickFirst(r.institute_group_id, r.institute_group, r.group_id, r.group?.id));
            const cid = toIntOrNull(pickFirst(r.id, r.college_id, r.collegeId));
            return {
              id: cid,
              name: r.name ?? r.college_name ?? "",
              campus: r.campus ?? r.campus_name ?? "",
              rGroupId: rid,
            };
          });

          const hasRid = normalized.some((x) => x.rGroupId != null);
          const matched = hasRid ? normalized.filter((x) => x.rGroupId === groupIdNum) : normalized;

          groupColleges.value = matched.map((r) => ({
            id: r.id ?? null,
            name: r.name ?? "",
            campus: r.campus ?? "",
            institute_group: String(groupIdNum ?? ""),
          }));
        })
        .catch(() => {/* เงียบไว้ */});
    } else {
      groupColleges.value = [];
    }
  } catch (e) {
    if (myReq !== reqId) return;
    console.error(e);
    loadError.value = e?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
    isLoading.value = false;
  }
}

/* ===== Lifecycle / Watchers ===== */
onMounted(() => {
  // ไม่ต้องโหลด countries/provinces เองแล้ว ใช้ useLookups()
});

watch(
  [() => props.showModal, () => props.collegeId],
  async (newVals, oldVals = []) => {
    try {
      const [open, id] = Array.isArray(newVals) ? newVals : [false, null];

      if (!open || !id) {
        internalShow.value = false;
        return;
      }

      // เปิดทันที (หรือรอ ถ้าผู้ใช้กำหนดไว้)
      if (props.openAfterLoaded) {
        internalShow.value = false;
      } else {
        internalShow.value = true;
        prefillFromInitial?.();
      }

      await fetchDetail();

      // ถ้าเลือกโหมดเปิดหลังโหลดเสร็จ
      if (props.openAfterLoaded) internalShow.value = true;
    } catch (err) {
      console.error("[DetailCollegeModal] open watcher failed:", err);
      internalShow.value = false;
    }
  },
  { immediate: true }
);

/* ===== Actions ===== */
function handleClose() {
  if (isLoading.value) return;
  props.closeModal?.();
  internalShow.value = false;
  emit("close");
}
function onEditSaved(payload) {
  showEditModal.value = false;
  selectedCollege.value = null;
  fetchDetail();
  emit("saved", payload);
}

/* ===== helpers ===== */
const safeText = (val, fallback = "-") => {
  if (val === null || val === undefined) return fallback;
  if (Array.isArray(val)) val = val.join(", ");
  const s = String(val).trim();
  return s ? s : fallback;
};
const safeYear = (val, fallback = "-") => {
  const s = String(val ?? "").trim();
  const n = Number(s);
  return s.length === 4 && Number.isFinite(n) ? s : fallback;
};
</script>
