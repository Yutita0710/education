<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative">
      <!-- ปุ่มปิด -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-8 mr-2"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <h2 class="text-xl font-bold text-center mb-4">รายละเอียดสถาบัน</h2>

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
      <div v-else>
        <!-- ชื่อ -->
        <div class="mb-4 flex flex-row gap-4">
          <div>
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">ชื่อสถาบัน</span>
            </label>
          </div>
          <div>
            <span class="text-gray-900 font-medium">{{
              detail.name || "-"
            }}</span>
          </div>
        </div>

        <!-- วิทยาเขต -->
        <div class="mb-4 flex flex-row gap-4">
          <div>
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">วิทยาเขต</span>
            </label>
          </div>
          <div>
            <span class="text-gray-900 font-medium">{{
              detail.campus || "-"
            }}</span>
          </div>
        </div>

        <!-- กลุ่มสถาบัน (ตาราง) -->
        <div class="mb-6 flex flex-col gap-4">
          <div>
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">กลุ่มสถาบัน</span>
            </label>
          </div>
          <div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table
                class="w-full text-sm text-left rtl:text-right text-gray-500"
              >
                <thead class="font-medium text-gray-700 uppercase bg-[#E2EDFC]">
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
                    <td class="px-6 py-4">
                      {{ g.campus || "-" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ประเทศ -->
        <div class="mb-4 flex flex-row gap-4">
          <div>
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">ประเทศ</span>
            </label>
          </div>
          <div>
            <span class="text-gray-900 font-medium">{{ countryDisplay }}</span>
          </div>
        </div>

        <!-- จังหวัด -->
        <div class="mb-4 flex flex-row gap-4">
          <div>
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">จังหวัด</span>
            </label>
          </div>
          <div>
            <span class="text-gray-900 font-medium">{{ provinceDisplay }}</span>
          </div>
        </div>

        <!-- จำนวนหลักสูตร -->
        <div class="mb-4 flex flex-row gap-4">
          <div>
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold"
                >จำนวนหลักสูตร</span
              >
            </label>
          </div>
          <div>
            <span
              class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
            >
              {{ detail.curriculumCount }} หลักสูตร
            </span>
          </div>
        </div>

        <!-- สถานะการใช้งาน -->
        <div class="mb-4 flex flex-row gap-4">
          <div>
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold"
                >สถานะการใช้งาน</span
              >
            </label>
          </div>
          <div>
            <span
              class="text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
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
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from "vue";
import {
  getCollegesById,
  countryList,
  provinceList,
  countCurriculum,
  getCollegesGrouped,
} from "@/services/apiService";

/** =========== Props ============ */
const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, default: () => {} },
  collegeId: { type: [Number, String], default: null },
});

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

  // จาก payload จริง
  countryName: "",
  provinceName: "",
  curriculumCount: 0,

  active: 0,
  institute_group: null,
  group: [],
});

const countryOptions = ref([]); // [{id,name,code}]
const provinceOptions = ref([]); // [{id,name,country_id?}]
const TH_ID = ref(null);

/** ========== Utils ========== */
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

/** ========== Derived display (ใช้ชื่อจาก payload ก่อน) ========== */
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
  // 1) ถ้า backend ส่งชื่อมาแล้ว ใช้ก่อน
  const byPayload = (detail.provinceName || detail.province_name || "").trim();
  if (byPayload) return byPayload;

  // 2) ถ้ามี province เป็น id/code ให้ลอง map จาก provinceOptions
  const key = (detail.province ?? "").toString().trim();
  if (key) {
    const found = provinceNameById.value.get(key);
    if (found && found.trim()) return found;
    // บาง backend อาจให้ key เป็นตัวเลข/สตริงสลับกัน
    const alt = provinceNameById.value.get(String(Number(key)));
    if (alt && alt.trim()) return alt;
    // ถ้าไม่พบใน map ให้แสดงค่าดิบ (เช่น ต่างประเทศเก็บเป็น free text)
    return key;
  }

  // 3) ไม่พบอะไรเลย
  return "-";
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
    // ไม่ต้อง block การแสดงผล เพราะเรามีชื่อจาก payload อยู่แล้ว
    console.warn("โหลด master options ล้มเหลว (จะใช้ชื่อจาก payload):", e);
  }
}

async function fetchDetail() {
  if (!props.collegeId) return;
  isLoading.value = true;
  loadError.value = "";

  try {
    // 1) ดึงรายละเอียด
    const res = await getCollegesById(props.collegeId);
    const data = res?.data?.data ?? res?.data?.item ?? res?.data ?? null;
    if (!data) throw new Error("ไม่พบข้อมูลจากเซิร์ฟเวอร์");

    // map detail
    detail.id = data.id ?? null;
    detail.name = data.name ?? "";
    detail.campus = data.campus ?? "";
    detail.country = data.country ?? data.country_id ?? data.code ?? null;
    detail.province = data.province ?? data.province_id ?? null;
    detail.province_name = data.province_name ?? null;
    detail.countryName = data.countryName ?? "";
    detail.provinceName = data.provinceName ?? "";
    detail.active = Number(data.active ?? 0) === 1 ? 1 : 0;

    // ✅ normalize institute_group เป็นสตริง (หรือ null ถ้าไม่มี)
    const groupId = data.institute_group != null ? String(data.institute_group) : "";
    detail.institute_group = groupId || null;

    // 2) ดึง count + group (ถ้ามี groupId)
    const [countRes, groupRes] = await Promise.all([
      countCurriculum({}),
      groupId ? getCollegesGrouped(groupId) : Promise.resolve({ data: [] }),
    ]);

    // สร้างแผนที่ count ต่อ college_id
    const countsArr = countRes?.data?.data ?? countRes?.data ?? [];
    const countsMap = {};
    for (const cur of countsArr) {
      // พยายามรองรับหลายฟิลด์ที่อาจมาจาก API
      const key = Number(cur.college_id ?? cur.id ?? cur.collegeId);
      const cnt = Number(cur.curriculum_count ?? cur.count ?? 0);
      if (Number.isFinite(key)) countsMap[key] = Number.isFinite(cnt) ? cnt : 0;
    }
    detail.curriculumCount = countsMap[Number(detail.id)] ?? 0;

    // ดึงรายการในกลุ่ม แล้วกรองให้ตรงกับ groupId (กันกรณี backend ส่งรายการปนมา)
    const raw =
      groupRes?.data?.data ??
      groupRes?.data?.items ??
      groupRes?.data?.rows ??
      groupRes?.data ??
      [];
    const rows = Array.isArray(raw) ? raw : [];

    const filtered = groupId
      ? rows.filter(
          (r) => String(r.institute_group ?? r.group_id ?? r.group) === groupId
        )
      : [];

    // ✅ แมปให้ id = college id จริง ๆ และแนบ institute_group ไว้ด้วย
    groupColleges.value = filtered.map((r) => ({
      id: r.id ?? null, // <-- college id
      name: r.name ?? "",
      campus: r.campus ?? "",
      institute_group: String(r.institute_group ?? groupId ?? ""),
      curriculumCount: countsMap[Number(r.id)] ?? 0,
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
  fetchMasterOptions(); // optional
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
  props.closeModal?.();
}
</script>
