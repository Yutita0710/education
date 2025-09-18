<template>
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
      @click.self="handleClose"
    >
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative">
        <!-- <div
      class="bg-white rounded-2xl max-w-7xl w-full max- overflow-auto p-6 relative"
    > -->
        <!-- Close button (มุมขวาบน) -->
        <button
          type="button"
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
        <h2 class="text-xl font-bold text-center mb-4">เพิ่มข้อมูลสถาบัน</h2>

        <!-- Form -->
        <form @submit.prevent="saveCollege" class="space-y-4">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">
                ชื่อสถาบัน
                <span class="text-red-500 ml-1">*</span>
              </span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              placeholder="กรอกชื่อสถาบัน"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">
                วิทยาเขต
                <!-- <span class="text-red-500 ml-1">*</span> -->
              </span>
            </label>
            <input
              v-model="form.campus"
              type="text"
              class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              placeholder="กรอกชื่อวิทยาเขต"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">
              <span class="flex items-center gap-1 font-bold">
                กลุ่มสถาบัน
                <!-- <span class="text-red-500 ml-1">*</span> -->
              </span>
            </label>
            <v-select
              v-model="form.selectedCollege"
              :options="colleges"
              label="name"
              track-by="id"
              placeholder="เลือกสถาบัน..."
            />
          </div>

          <!-- ประเทศ -->
          <div class="mb-4">
            <label for="countries" class="block mb-2 font-medium text-gray-900">
              ประเทศ
              <span v-if="showCountryStar" class="text-red-500 ml-1">*</span>
            </label>
            <v-select
              id="countries"
              v-model="form.selectedCountry"
              :options="countryOptions"
              label="name"
              :reduce="(c) => String(c.id)"
              placeholder="เลือกประเทศ"
            />
          </div>

          <!-- จังหวัด (ไทยใช้ select / ต่างประเทศใช้ input) -->
          <div class="mb-4">
            <label for="province" class="block mb-2 font-medium text-gray-900">
              จังหวัด
              <span class="text-red-500 ml-1">*</span>
            </label>

            <div class="relative">
              <!-- ยังไม่เลือกประเทศ -->
              <input
                v-if="!form.selectedCountry"
                disabled
                type="text"
                class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-400 bg-gray-50"
                placeholder="โปรดเลือกประเทศก่อน"
              />

              <!-- ประเทศ = ไทย → ใช้ select จังหวัด -->
              <v-select
                v-else-if="isThaiSelected"
                v-model="form.selectedProvince"
                :options="filteredProvinceOptions"
                label="name"
                :reduce="(p) => String(p.id)"
                placeholder="เลือกจังหวัด"
              />

              <!-- ประเทศ ≠ ไทย → ใช้ input จังหวัด/รัฐ -->
              <input
                v-else
                v-model.trim="form.province"
                type="text"
                maxlength="255"
                class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                placeholder="กรอกชื่อจังหวัด/รัฐ"
              />
            </div>
          </div>

          <div class="mb-4">
            <label for="status" class="block mb-2 font-medium text-gray-900"
              >สถานะการใช้งาน</label
            >
            <Listbox
              v-model="selectedStatus"
              as="div"
              class="relative w-full rounded-lg border px-2 py-[0.15rem]"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-2"
              >
                <span class="truncate">{{
                  selectedStatus?.name || "สถานะการใช้งาน"
                }}</span>
                <ChevronUpDownIcon
                  class="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                />
              </ListboxButton>

              <ListboxOptions
                class="absolute z-20 mt-2 max-h-60 w-full md:w-[14rem] overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 left-0"
              >
                <ListboxOption
                  v-for="status in statusOptions"
                  :key="status.id"
                  :value="status"
                  class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                >
                  <span class="block truncate">{{ status.name }}</span>
                  <span
                    v-if="selectedStatus?.id === status.id"
                    class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                  >
                    <CheckIcon class="w-5 h-5" aria-hidden="true" />
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </Listbox>
          </div>
          <!-- ส่วนปุ่ม action -->
          <div class="flex justify-center gap-3 p-6">
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-[#0085DB] hover:bg-[#0072B1] text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              <span class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6 mr-2"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z"
                    clip-rule="evenodd"
                  />
                </svg>

                บันทึก
              </span>
            </button>
            <button
              type="button"
              @click="handleClose"
              class="bg-[#F95668] hover:bg-[#F95668]/80 text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
/* =========================
 * Imports
 * =======================*/
import {
  reactive,
  ref,
  computed,
  watch,
  onBeforeUnmount,
  onMounted,
} from "vue";
import Swal from "sweetalert2";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import {
  addEducationCollege,
  checkCollegeNameExists,
  countryList,
  provinceList,
  getCollegesPaginated,
} from "@/services/apiService";

/* =========================
 * Constants (static options)
 * =======================*/
const statusOptions = [
  { id: 1, name: "ใช้งาน" },
  { id: 0, name: "ไม่ใช้งาน" },
];
// const ispublicOptions = [
//   { id: 1, value: true, name: "เผยแพร่" },
//   { id: 0, value: false, name: "ไม่เผยแพร่" },
// ];
const emit = defineEmits(["close", "saved"]);
const selectedStatus = ref(statusOptions[0]);
// const selectedIspublic = ref(ispublicOptions[0]);
/* =========================
 * State (single source of truth)
 * =======================*/
const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, default: () => {} },
  optionsKey: { type: Number, default: 0 },
});
const isLoading = ref(false);
// ===== state options =====
const colleges = ref([]);
const countries = ref([]);
const provinces = ref([]);
const optionsLoading = ref(false);
const countryOptions = ref([]); // [{id,name,code}]
const provinceOptions = ref([]); // [{id,name,country_id}]
// ประเทศ: โชว์ * เมื่อ "ยังไม่มีค่า" (ไม่ต้องสน lock ก็ได้ตามที่ต้องการ)
const showCountryStar = computed(() => isEmpty(form.selectedCountry));

// จังหวัด: ให้ขึ้น * เฉพาะตอนที่ “เลือกประเทศแล้ว” แต่ “ยังไม่มีจังหวัด”
const showProvinceStar = computed(() => {
  if (isEmpty(form.selectedCountry)) return false; // ยังไม่เลือกประเทศ → ยังไม่ต้องขึ้น *
  return isThaiSelected.value
    ? isEmpty(form.selectedProvince) // ไทย → ต้องเลือกจาก select
    : isEmpty(form.province); // ต่างประเทศ → ต้องกรอกข้อความ
});
// keep TH id for filtering provinces
const TH_ID = ref(null);
const errors = reactive({ province: "", institute_group: "" });

const isEmpty = (v) =>
  v === null || v === undefined || (typeof v === "string" && v.trim() === "");

// คืนค่าที่ “พร้อมส่งเข้า API” และตั้ง error ถ้าไม่ผ่าน
function normalizeProvinceForSubmit() {
  errors.province = "";

  if (isThaiSelected.value) {
    const v = String(form.selectedProvince || "").trim(); // ไทยส่ง id เป็น string
    if (isEmpty(v)) {
      errors.province = "กรุณาเลือกจังหวัด";
      return null;
    }
    if (v.length > 255) {
      errors.province = "จังหวัดต้องไม่เกิน 255 ตัวอักษร";
      return null;
    }
    return v;
  } else {
    const v = String(form.province || "").trim(); // ต่างประเทศส่งชื่อจังหวัด/รัฐ
    if (isEmpty(v)) {
      errors.province = "กรุณากรอกจังหวัด/รัฐ";
      return null;
    }
    if (v.length > 255) {
      errors.province = "จังหวัดต้องไม่เกิน 255 ตัวอักษร";
      return null;
    }
    return v;
  }
}

// main form (ใช้ตัวเดียวทั้งหน้า)
const form = reactive({
  name: "",
  campus: "",
  // selects (เก็บเป็น id)
  selectedCountry: null, // number|string|null
  selectedProvince: null, // id จังหวัด (เฉพาะไทย)
  province: "", // ข้อความจังหวัด/รัฐ (ต่างประเทศ)
  selectedCollege: null,
  selectedStatus: statusOptions[0], // {id,name}
  // selectedIspublic: ispublicOptions[0], // {id,value,name}
  // others
  active: 1,
  college_id: null,
});

/* =========================
 * Utils
 * =======================*/
function debounce(fn, delay = 350) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
// const num = (v) =>
//   v === null || v === undefined || v === "" ? null : Number(v);
const textOrNull = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

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

/* =========================
 * Computed
 * =======================*/
const isThaiSelected = computed(
  () => String(form.selectedCountry) === String(TH_ID.value)
);

const filteredProvinceOptions = computed(() => {
  // แสดงจังหวัดเฉพาะเมื่อเลือก "ไทย"
  return isThaiSelected.value
    ? provinceOptions.value.filter(
        (p) => String(p.country_id) === String(TH_ID.value)
      )
    : [];
});

/* =========================
 * Watchers
 * =======================*/
watch(
  () => form.selectedCountry,
  (newVal, oldVal) => {
    if (String(newVal) !== String(oldVal)) {
      if (isThaiSelected.value) {
        // โหมดไทย: ล้างช่องข้อความ
        form.province = "";
      } else {
        // โหมดต่างประเทศ: ล้าง select จังหวัด
        form.selectedProvince = null;
      }
    }
  }
);

function handleClose() {
  if (isLoading.value) return;
  clearForm(); // เคลียร์ค่าก่อนทุกครั้ง
  emit("close"); // ให้พาเรนต์ปิด v-if
  props.closeModal?.(); // เผื่อพาเรนต์ส่งฟังก์ชันมา
}

watch(
  () => form.selectedCollege,
  () => {
    errors.institute_group = "";
  }
);

// ถ้าพาเรนต์ปิด (showModal=false) ให้ล้างฟอร์มด้วย
watch(
  () => props.showModal,
  (open) => {
    if (!open) clearForm();
  }
);

async function fetchCollegesForSelect() {
  const resp = await getCollegesPaginated({
    page: 1,
    limit: 10000,
    order: "ASC",
    sort: "id",
    _t: Date.now(),
  }); // _t กัน cache
  const payload = resp?.data;

  const rows =
    (Array.isArray(payload?.data) && payload.data) ||
    (Array.isArray(payload?.items) && payload.items) ||
    (Array.isArray(payload?.rows) && payload.rows) ||
    (Array.isArray(payload?.result) && payload.result) ||
    (Array.isArray(payload) && payload) ||
    [];

  const activeRows = rows.filter((r) => Number(r?.active ?? 0) === 1);

  const norm = (v) => (v == null ? "" : String(v).trim());
  const toNum = (s) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };
  const cmpStr = (a, b) =>
    String(a).localeCompare(String(b), "th", {
      numeric: true,
      sensitivity: "base",
    });

  const mapped = activeRows.map((r) => {
    const idStr = norm(r?.id ?? r?.code ?? r?.name ?? "");
    const groupStr = norm(r?.institute_group ?? r?.id ?? "");
    const name =
      r?.campus && norm(r.campus) !== ""
        ? `${r?.name ?? ""} (${r.campus})`
        : r?.name ?? "";
    return {
      id: idStr,
      name,
      institute_group: groupStr,
      _idNum: toNum(idStr),
      _groupNum: toNum(groupStr),
      _isParent: idStr !== "" && idStr === groupStr,
    };
  });

  mapped.sort((a, b) => {
    let g =
      a._groupNum != null && b._groupNum != null
        ? a._groupNum - b._groupNum
        : cmpStr(a.institute_group, b.institute_group);
    if (g !== 0) return g;

    if (a._isParent !== b._isParent) return a._isParent ? -1 : 1;

    let i =
      a._idNum != null && b._idNum != null
        ? a._idNum - b._idNum
        : cmpStr(a.id, b.id);
    if (i !== 0) return i;

    return cmpStr(a.name, b.name);
  });

  colleges.value = mapped;
}

// ===== โหลด master อื่น ๆ =====
async function fetchMasterOptions() {
  const [cRes, pRes] = await Promise.all([countryList(), provinceList()]);
  countries.value = (cRes?.data?.data ?? cRes?.data ?? []).map((c) => ({
    id: c.id ?? c.country_id ?? c.code ?? c.name,
    name: c.name ?? c.country_name ?? c.code ?? "",
    code: (c.code ?? "").toUpperCase(),
  }));
  provinces.value = (pRes?.data?.data ?? pRes?.data ?? []).map((p) => ({
    id: p.id ?? p.province_id ?? p.name_th,
    name: p.name_th ?? p.province_name ?? "",
  }));
}

// ===== ดึง options ทั้งหมดพร้อมกัน =====
async function fetchAllOptions() {
  optionsLoading.value = true;
  try {
    await Promise.all([fetchCollegesForSelect(), fetchMasterOptions()]);
  } finally {
    optionsLoading.value = false;
  }
}

// ✅ รีเฟรชทุกครั้งที่ "เปิดโมดัล"
watch(
  () => props.showModal,
  (open, prev) => {
    if (open) fetchAllOptions();
  },
  { immediate: false }
);

// ✅ และรีเฟรชเมื่อพาเรนต์ bump optionsKey (กันกรณีเปิดติด ๆ กัน)
watch(
  () => props.optionsKey,
  () => {
    if (props.showModal) fetchAllOptions();
  }
);
/* =========================
 * Lifecycle
 * =======================*/
onMounted(async () => {
  try {
    // 1) countries
    const countryRes = await countryList();
    let countries = (countryRes?.data ?? []).map((c) => ({
      id: c.id ?? c.country_id ?? c.code ?? String(c.name),
      name: c.name ?? c.country_name ?? c.code ?? "",
      code: (c.code ?? "").toUpperCase(),
    }));

    // ไทยขึ้นก่อน แล้วค่อย A->Z ภาษาไทย
    countries = countries.sort((a, b) => {
      const aThai = isThai(a),
        bThai = isThai(b);
      if (aThai && !bThai) return -1;
      if (!aThai && bThai) return 1;
      return String(a.name).localeCompare(String(b.name), "th");
    });
    countryOptions.value = countries;

    // หา TH_ID
    const th = countries.find(isThai);
    TH_ID.value = th ? th.id : null;

    // 2) provinces (ผูก country_id = TH_ID)
    const provinceRes = await provinceList();
    let provinces = (provinceRes?.data ?? []).map((p) => ({
      id: p.id ?? p.province_id ?? String(p.name_th),
      name: p.name_th ?? p.province_name ?? "",
      country_id: TH_ID.value, // ให้ไทยทั้งหมดอยู่กลุ่มเดียวกัน
    }));
    provinces = provinces.sort((a, b) =>
      String(a.name).localeCompare(String(b.name), "th")
    );
    provinceOptions.value = provinces;

    // 3) colleges
    await fetchColleges();
  } catch (err) {
    console.error("Error loading options:", err);
  }
});

/* =========================
 * Actions (fetch / save / clear)
 * =======================*/
const fetchColleges = async () => {
  try {
    const resp = await getCollegesPaginated();
    const payload = resp?.data;

    const rows =
      (Array.isArray(payload?.data) && payload.data) ||
      (Array.isArray(payload?.items) && payload.items) ||
      (Array.isArray(payload?.rows) && payload.rows) ||
      (Array.isArray(payload?.result) && payload.result) ||
      (Array.isArray(payload) && payload) ||
      [];

    // แสดงเฉพาะที่ active
    const activeRows = rows.filter((r) => Number(r?.active ?? 0) === 1);

    // map เป็น options ที่ v-select ใช้ได้ทันที
    const mapped = activeRows.map((r) => {
      const name = r?.campus ? `${r?.name ?? ""} (${r.campus})` : r?.name ?? "";
      return {
        id: String(r?.id ?? r?.code ?? r?.name ?? "").trim(),
        name,
        // เก็บ group สำหรับใช้ตอนบันทึก
        institute_group: String(r?.institute_group ?? r?.id ?? "").trim(),
      };
    });

    // (ออปชัน) จัดเรียง: group เดียวกันอยู่ติดกัน และให้ parent (id === institute_group) ขึ้นก่อน
    // ช่วยแปลงเป็นตัวเลข (ถ้าเป็นได้) เพื่อใช้เรียงตัวเลข
    // แปลงเป็นตัวเลขถ้าเป็นไปได้
    const toNum = (s) => {
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    };

    // เปรียบเทียบ key แบบ "เลขก่อน ถ้าไม่ใช่เลขให้เทียบสตริง"
    const cmpByKey = (a, b, key) => {
      const ax = toNum(a[key]);
      const bx = toNum(b[key]);
      if (ax !== null && bx !== null) return ax - bx;
      return String(a[key]).localeCompare(String(b[key]), "th", {
        numeric: true,
        sensitivity: "base",
      });
    };

    // ====== แบบ A: เรียง institute_group -> id (ไม่บังคับ parent ก่อน) ======
    mapped.sort((a, b) => {
      const g = cmpByKey(a, b, "institute_group");
      if (g !== 0) return g;

      const i = cmpByKey(a, b, "id"); // tie-breaker ด้วย id
      if (i !== 0) return i;

      // เผื่อชนกันจริง ๆ ค่อยดูชื่อ
      return String(a.name).localeCompare(String(b.name), "th", {
        numeric: true,
        sensitivity: "base",
      });
    });

    colleges.value = mapped;
  } catch (e) {
    console.error("fetchColleges failed:", e);
    colleges.value = [];
  }
};

function clearForm() {
  form.name = "";
  form.campus = "";
  form.selectedCountry = null;
  form.selectedProvince = null;
  form.province = "";
  form.selectedCollege = null;
  // form.selectedStatus = statusOptions[0];
  selectedStatus.value = statusOptions[0];
  // form.selectedIspublic = ispublicOptions[0];
  form.active = 1;
  form.college_id = null;
}

async function saveCollege() {
  const nameTrimmed = cleanStr(form.name);
  if (!nameTrimmed) {
    await Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อสถาบัน" });
    return;
  }

  // ตรวจชื่อซ้ำ (ใช้ชื่อที่ trim แล้ว)
  try {
    const resp = await checkCollegeNameExists(nameTrimmed);
    if (resp?.data?.statusCode === 400) {
      await Swal.fire({
        icon: "warning",
        title: "ชื่อสถาบันศึกษาซ้ำกับชื่อสถาบันอื่น",
        text: "กรุณากรอกชื่อสถาบันใหม่",
      });
      return;
    }
  } catch (err) {
    console.error("Error checking duplicate:", err);
    await Swal.fire({
      icon: "error",
      title: "ไม่สามารถตรวจสอบชื่อสถาบันได้",
      text: "กรุณาลองใหม่อีกครั้ง",
    });
    return;
  }

  // ---- validate ประเทศ/จังหวัดตามโหมด ----
  if (!form.selectedCountry) {
    await Swal.fire({ icon: "warning", title: "กรุณาเลือกประเทศ" });
    return;
  }
  if (isThaiSelected.value) {
    if (!form.selectedProvince) {
      await Swal.fire({ icon: "warning", title: "กรุณาเลือกจังหวัด" });
      return;
    }
  } else {
    if (!textOrNull(form.province)) {
      await Swal.fire({ icon: "warning", title: "กรุณากรอกจังหวัด/รัฐ" });
      return;
    }
  }

  // ถ้ามีฟังก์ชัน normalizeProvinceForSubmit อยู่แล้วก็ใช้ต่อ
  const provinceValue = normalizeProvinceForSubmit
    ? normalizeProvinceForSubmit()
    : isThaiSelected.value
    ? idStrOrUndef(form.selectedProvince)
    : textOrUndef(form.province);

  if (provinceValue === null) {
    // สมมติว่าฟังก์ชัน normalizeProvinceForSubmit เซ็ต error ไว้แล้ว
    return;
  }

  // รองรับทั้งกรณี selectedCollege เป็น object/id
  const instituteGroupRaw =
    form.selectedCollege?.institute_group ?? form.selectedCollege ?? "";
  const instituteGroup = idStrOrUndef(instituteGroupRaw);

  // --- สร้าง payload โดยกันค่าว่างทุกฟิลด์ ---
  const payload = compact({
    name: nameTrimmed, // ผ่าน trim แน่ๆ
    campus: textOrUndef(form.campus), // ค่าว่างจะไม่ถูกส่ง
    country: idStrOrUndef(form.selectedCountry),
    province: textOrUndef(provinceValue),
    institute_group: instituteGroup,
    active: Number(form.selectedStatus?.id ?? form.active ?? 1) === 1 ? 1 : 0,
  });

  // console.log("👉 payload:", payload);

  isLoading.value = true;
  try {
    const res = await addEducationCollege(payload);
    const newId =
      res?.data?.data?.id ??
      res?.data?.item?.id ??
      res?.data?.id ??
      res?.id ??
      null;

    await Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    emit("saved", { id: newId, ...payload });
    clearForm();
    handleClose();
  } catch (error) {
    console.error(error);
    await Swal.fire({
      icon: "error",
      title: "ไม่สามารถบันทึกข้อมูลได้",
      text: "กรุณาลองใหม่อีกครั้ง",
    });
  } finally {
    isLoading.value = false;
  }
}

// --- helpers ---
const cleanStr = (v) => (typeof v === "string" ? v.trim() : v);
const textOrUndef = (v) => {
  const s = (v ?? "").toString().trim();
  return s ? s : undefined; // ค่าว่าง -> undefined
};
const idStrOrUndef = (v) => {
  const s = (v ?? "").toString().trim();
  return s ? s : undefined; // ใช้กับค่า id ที่เป็นสตริง
};
const compact = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
function lockBodyScroll(lock) {
  const sbw = window.innerWidth - document.documentElement.clientWidth; // scrollbar width
  if (lock) {
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
  } else {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
}

watch(
  () => props.showModal,
  (open) => lockBodyScroll(open),
  { immediate: true }
);
onBeforeUnmount(() => lockBodyScroll(false));
</script>


