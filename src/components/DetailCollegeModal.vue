<template>
  <!-- ✅ ทำให้มี root เดียว -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative">
      <div class="mb-6 grid grid-cols-[1fr_auto_1fr] items-center">
        <div></div>
        <h2 class="text-xl font-bold text-center">รายละเอียดสถาบัน</h2>

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

          <!-- ปุ่มปิด -->
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

      <!-- Loading -->
      <div v-if="isLoading" class="py-8 text-center text-gray-500">
        กำลังโหลดข้อมูล...
      </div>

      <!-- Error -->
      <div v-else-if="loadError" class="py-6">
        <p class="text-red-600 font-medium text-center">
          ไม่สามารถดึงข้อมูลได้: {{ loadError }}
        </p>
        <div class="flex justify-center mt-4">
          <button
            type="button"
            @click="fetchDetail"
            class="bg-blue-600 hover:bg-blue-600/90 text-white px-4 py-2 rounded-lg"
          >
            ลองใหม่
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="px-14 space-y-4">
        <!-- ชื่อสถาบัน -->
        <div class="grid grid-cols-[210px_1fr] gap-6">
          <div class="md:text-left">
            <label class="block text-gray-700">
              <span class="inline-flex items-center gap-1 font-bold"
                >ชื่อสถาบัน</span
              >
            </label>
          </div>
          <div>
            <span class="text-gray-900 font-medium">{{
              detail.name || "-"
            }}</span>
          </div>
        </div>

        <!-- วิทยาเขต -->
        <div class="grid grid-cols-[210px_1fr] gap-6">
          <div class="md:text-left">
            <label class="block text-gray-700">
              <span class="inline-flex items-center gap-1 font-bold"
                >วิทยาเขต</span
              >
            </label>
          </div>
          <div>
            <span class="text-gray-900 font-medium">{{
              detail.campus || "-"
            }}</span>
          </div>
        </div>

        <!-- กลุ่มสถาบัน (ตาราง) -->
        <div class="mb-6 flex flex-col gap-4" v-if="!sameGroupAsSelf">
          <div>
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">กลุ่มสถาบัน</span>
            </label>
          </div>
          <div>
            <div
              class="relative overflow-x-auto shadow-md sm:rounded-lg"
              :class="
                (groupColleges?.length ?? 0) > 3
                  ? 'overflow-y-auto max-h-[calc(3*3rem+3rem)]'
                  : ''
              "
            >
              <table
                class="w-full text-sm text-left rtl:text-right text-gray-500"
              >
                <thead
                  class="font-medium text-gray-700 uppercase bg-[#E2EDFC] sticky top-0 z-10"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">ลำดับ</th>
                    <th scope="col" class="px-6 py-3">ชื่อสถาบัน</th>
                    <th scope="col" class="px-6 py-3">วิทยาเขต</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="!groupColleges || groupColleges.length === 0"
                    class="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                  >
                    <td colspan="3" class="px-6 py-4 text-center text-gray-400">
                      - ไม่พบกลุ่มสถาบัน -
                    </td>
                  </tr>
                  <tr
                    v-for="(g, idx) in groupColleges"
                    :key="g.id || idx"
                    class="border-b border-gray-200 odd:bg-white even:bg-gray-50"
                    :class="
                      Number(g.id) === Number(detail.id) ? 'bg-blue-50' : ''
                    "
                  >
                    <td class="px-6 py-4">{{ idx + 1 }}</td>
                    <th
                      scope="row"
                      class="px-6 py-4 text-gray-900 whitespace-nowrap"
                    >
                      {{ g.name || "-" }}
                    </th>
                    <td class="px-6 py-4">{{ g.campus || "-" }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- <div v-else  class="grid grid-cols-[210px_1fr] gap-6">
          <div class="md:text-left">
            <label class="block text-gray-700">
              <span class="inline-flex items-center gap-1 font-bold"
                >กลุ่มสถาบัน</span
              >
            </label>
          </div>
          <div>
            <span class="text-gray-500 text-sm" >สถาบันนี้เป็นหัวกลุ่มของตนเอง จึงไม่แสดงรายการกลุ่มสถาบัน</span >
          </div>
        </div>
         -->
        <!-- ประเทศ -->
        <div class="grid grid-cols-[210px_1fr] gap-6">
          <div class="md:text-left">
            <label class="block text-gray-700">
              <span class="inline-flex items-center gap-1 font-bold"
                >ประเทศ</span
              >
            </label>
          </div>
          <div>
            <span class="text-gray-900 font-medium">{{ countryDisplay }}</span>
          </div>
        </div>

        <!-- จังหวัด -->
        <div class="grid grid-cols-[210px_1fr] gap-6">
          <div class="md:text-left">
            <label class="block text-gray-700">
              <span class="inline-flex items-center gap-1 font-bold"
                >จังหวัด</span
              >
            </label>
          </div>
          <div>
            <span class="text-gray-900 font-medium">{{ provinceDisplay }}</span>
          </div>
        </div>

        <!-- จำนวนหลักสูตร -->
        <div class="grid grid-cols-[210px_1fr] gap-6">
          <div class="md:text-left">
            <label class="block text-gray-700">
              <span class="inline-flex items-center gap-1 font-bold"
                >จำนวนหลักสูตร</span
              >
            </label>
          </div>
          <div>
            <span
              class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {{ detail.curriculumCount }} หลักสูตร
            </span>
          </div>
        </div>

        <!-- สถานะการใช้งาน -->
        <div class="grid grid-cols-[210px_1fr] gap-6">
          <div class="md:text-left">
            <label class="block text-gray-700">
              <span class="inline-flex items-center gap-1 font-bold"
                >สถานะการใช้งาน</span
              >
            </label>
          </div>
          <div>
            <span
              class="text-xs font-medium px-2.5 py-0.5 rounded-full"
              :class="
                Number(detail.active) === 1
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              {{ Number(detail.active) === 1 ? "ใช้งาน" : "ไม่ใช้งาน" }}
            </span>
          </div>
        </div>

        <!-- ปุ่มปิด -->
        <div class="flex justify-center gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="handleClose"
            class="bg-[#F95668] hover:bg-[#F95668]/80 text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ✅ ย้ายไว้ใต้ root เดียวกัน และผูก state/handlers ให้ครบ -->
  <EditCollegeModal
    :showModal="showEditModal"
    :selectedCollege="selectedCollege"
    @close="closeEditModal"
    @saved="onEditSaved"
  />
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, toRaw } from "vue";
import {
  getCollegesById,
  countryList,
  provinceList,
  countCurriculum,
  getCollegesGrouped,
} from "@/services/apiService";
import EditCollegeModal from "./EditCollegeModal.vue";

/** =========== Props/Emits ============ */
const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, default: () => {} },
  collegeId: { type: [Number, String], default: null },
});
const emit = defineEmits(["request-edit", "close", "refresh-data"]);

/** =========== State ============ */
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
  group: [],
});

/** ✅ State ของ Edit modal */
const showEditModal = ref(false);
const selectedCollege = ref(null);

function onEditClick() {
  // ส่งสำเนา object detail ให้ modal (ตัด proxy ออก)
  selectedCollege.value = { ...toRaw(detail) };
  showEditModal.value = true;

  // ถ้าอยากแจ้งพาเรนต์ด้วยก็ยัง emit ได้นะ
  emit("request-edit", { ...toRaw(detail) });
}

function closeEditModal() {
  showEditModal.value = false;
  selectedCollege.value = null;
}

/** ========== Masters ========== */
const countryOptions = ref([]);
const provinceOptions = ref([]);
const TH_ID = ref(null);

const isThai = (x) => {
  const name = String(x?.name || "")
    .toLowerCase()
    .trim();
  const code = String(x?.code || "")
    .toUpperCase()
    .trim();
  return (
    name === "ไทย" ||
    name === "ประเทศไทย" ||
    name === "thailand" ||
    code === "TH"
  );
};

/** ========== Displays ========== */
const countryDisplay = computed(() => {
  const byPayload = (detail.countryName || "").trim();
  if (byPayload) return byPayload;

  if (detail.country == null || detail.country === "") return "-";
  const found = countryOptions.value.find(
    (c) =>
      String(c.id) === String(detail.country) ||
      String(c.code).toUpperCase() === String(detail.country).toUpperCase()
  );
  return found?.name || String(detail.country);
});

const provinceNameById = computed(() => {
  const m = new Map();
  for (const p of provinceOptions.value) {
    const id = String(p.id ?? "");
    if (id) m.set(id, p.name ?? "");
  }
  return m;
});

const provinceDisplay = computed(() => {
  const byPayload = (detail.provinceName || detail.province_name || "").trim();
  if (byPayload) return byPayload;

  const key = (detail.province ?? "").toString().trim();
  if (key) {
    const found =
      provinceNameById.value.get(key) ??
      provinceNameById.value.get(String(Number(key)));
    return found && found.trim() ? found : key;
  }
  return "-";
});
const sameGroupAsSelf = computed(() => {
  const id = detail?.id != null ? String(detail.id) : "";
  const gid =
    detail?.institute_group != null ? String(detail.institute_group) : "";
  return gid !== "" && id !== "" && gid === id;
});
/** ========== Fetchers ========== */
async function fetchMasterOptions() {
  try {
    const countryRes = await countryList();
    let countries = (countryRes?.data ?? []).map((c) => ({
      id: c.id ?? c.country_id ?? c.code ?? String(c.name),
      name: c.name ?? c.country_name ?? c.code ?? "",
      code: (c.code ?? "").toUpperCase(),
    }));
    countries = countries.sort((a, b) => {
      const aThai = isThai(a),
        bThai = isThai(b);
      if (aThai && !bThai) return -1;
      if (!aThai && bThai) return 1;
      return String(a.name).localeCompare(String(b.name), "th");
    });
    countryOptions.value = countries;

    const th = countries.find(isThai);
    TH_ID.value = th ? th.id : null;

    const provinceRes = await provinceList();
    let provinces = (provinceRes?.data ?? []).map((p) => ({
      id: p.id ?? p.province_id ?? String(p.name_th),
      name: p.name_th ?? p.province_name ?? "",
      country_id: TH_ID.value,
    }));
    provinces = provinces.sort((a, b) =>
      String(a.name).localeCompare(String(b.name), "th")
    );
    provinceOptions.value = provinces;
  } catch (e) {
    console.warn("โหลด master options ล้มเหลว (จะใช้ชื่อจาก payload):", e);
  }
}

const isFilled = (v) =>
  v !== null && v !== undefined && String(v).trim() !== "";
const pickFirst = (...vals) => vals.find(isFilled);
const toIntOrNull = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

async function fetchDetail() {
  if (!props.collegeId) return;
  isLoading.value = true;
  loadError.value = "";

  try {
    const res = await getCollegesById(props.collegeId);
    const data = res?.data?.data ?? res?.data?.item ?? res?.data ?? null;
    if (!data) throw new Error("ไม่พบข้อมูลจากเซิร์ฟเวอร์");

    // ===== map หลัก =====
    detail.id = data.id ?? null;
    detail.name = data.name ?? "";
    detail.campus = data.campus ?? "";
    detail.country = data.country ?? data.country_id ?? data.code ?? null;
    detail.province = data.province ?? data.province_id ?? null;
    detail.province_name = data.province_name ?? null;
    detail.countryName = data.countryName ?? "";
    detail.provinceName = data.provinceName ?? "";
    detail.active = Number(data.active ?? 0) === 1 ? 1 : 0;

    // ===== group id / name (รองรับหลายฟิลด์ + เก็บทั้งคู่) =====
    const rawGroupId = pickFirst(
      data.institute_group_id,
      data.institute_group,
      data.group_id,
      data.group?.id
    );
    const rawGroupName = pickFirst(
      data.institute_group_name,
      data.group_name,
      data.group?.name
    );

    detail.institute_group = isFilled(rawGroupId) ? String(rawGroupId) : null;
    detail.institute_group_name = rawGroupName || "";

    const groupIdNum = toIntOrNull(detail.institute_group);

    // ===== ดึง count + สมาชิกในกลุ่ม (ส่งเลขให้แน่ใจ) =====
    const [countRes, groupRes] = await Promise.all([
      countCurriculum({}),
      groupIdNum
        ? getCollegesGrouped(groupIdNum)
        : Promise.resolve({ data: [] }),
    ]);

    // ===== นับหลักสูตรของแต่ละสถาบัน =====
    const countsArr = countRes?.data?.data ?? countRes?.data ?? [];
    const countsMap = {};
    for (const cur of countsArr) {
      const key = Number(cur.college_id ?? cur.id ?? cur.collegeId);
      const cnt = Number(cur.curriculum_count ?? cur.count ?? 0);
      if (Number.isFinite(key)) countsMap[key] = Number.isFinite(cnt) ? cnt : 0;
    }
    detail.curriculumCount = countsMap[Number(detail.id)] ?? 0;

    // ===== เดา group name จาก response ถ้ายังว่าง =====
    const inferredGroupName = pickFirst(
      groupRes?.data?.group_name,
      groupRes?.data?.group?.name,
      groupRes?.data?.name
    );
    if (!detail.institute_group_name && inferredGroupName) {
      detail.institute_group_name = inferredGroupName;
    }

    // ===== normalize รายการสมาชิกกลุ่มจาก response หลายรูปแบบ =====
    let rawRows =
      (Array.isArray(groupRes?.data?.data) && groupRes.data.data) ||
      (Array.isArray(groupRes?.data?.items) && groupRes.data.items) ||
      (Array.isArray(groupRes?.data?.rows) && groupRes.data.rows) ||
      (Array.isArray(groupRes?.data?.colleges) && groupRes.data.colleges) ||
      (Array.isArray(groupRes?.data?.members) && groupRes.data.members) ||
      (Array.isArray(groupRes?.data?.group?.colleges) &&
        groupRes.data.group.colleges) ||
      (Array.isArray(groupRes?.data) && groupRes.data) ||
      [];

    const normalized = rawRows.map((r) => {
      const rid = toIntOrNull(
        pickFirst(
          r.institute_group_id,
          r.institute_group,
          r.group_id,
          r.group?.id
        )
      );
      const cid = toIntOrNull(pickFirst(r.id, r.college_id, r.collegeId));
      return {
        id: cid,
        name: r.name ?? r.college_name ?? "",
        campus: r.campus ?? r.campus_name ?? "",
        rGroupId: rid,
      };
    });

    // ถ้า response ใส่ group id มาให้ → filter ให้เหลือเฉพาะกลุ่มเดียวกัน
    // ถ้าไม่มี rGroupId เลย (endpoint คืนเฉพาะกลุ่มอยู่แล้ว) → ใช้ทั้งหมด
    const hasRid = normalized.some((x) => x.rGroupId != null);
    const matched =
      groupIdNum != null
        ? hasRid
          ? normalized.filter((x) => x.rGroupId === groupIdNum)
          : normalized
        : [];

    groupColleges.value = matched.map((r) => ({
      id: r.id ?? null,
      name: r.name ?? "",
      campus: r.campus ?? "",
      institute_group: String(groupIdNum ?? ""),
      curriculumCount: r.id != null ? countsMap[r.id] ?? 0 : 0,
    }));
  } catch (e) {
    console.error(e);
    loadError.value = e?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
  } finally {
    isLoading.value = false;
  }
}

/** ========== Lifecycle & watchers ========== */
onMounted(async () => {
  fetchMasterOptions();
  if (props.showModal && props.collegeId) await fetchDetail();
});

watch(
  () => props.showModal,
  async (open) => {
    if (open && props.collegeId) await fetchDetail();
  }
);

watch(
  () => props.collegeId,
  async (id, oldId) => {
    if (props.showModal && id && String(id) !== String(oldId))
      await fetchDetail();
  }
);

/** ========== Actions ========== */
function handleClose() {
  if (isLoading.value) return;
  props.closeModal?.(); // ปิดแบบ prop function
  emit("close"); // และส่ง event เผื่อพาเรนต์ฟัง @close
}

function onEditSaved(payload) {
  showEditModal.value = false;
  selectedCollege.value = null;
  // ดึงใหม่ให้ detail อัปเดต หรือจะ merge เฉพาะฟิลด์ก็ได้
  fetchDetail(); // ✅ ชัวร์สุดเพราะดึงจาก backend
  emit("refresh-data", payload); // ถ้าพาเรนต์ต้องรีเฟรช list ด้วย
}
</script>
