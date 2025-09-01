<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative">
      <!-- <div
      class="bg-white rounded-2xl max-w-7xl w-full max- overflow-auto p-6 relative"
    > -->
      <!-- Close button (มุมขวาบน) -->
      <button
        @click="closeModal"
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
      <h2 class="text-xl font-bold text-center mb-4">
        เพิ่มข้อมูลสถาบันการศึกษา
      </h2>

      <!-- Form -->
      <form @submit.prevent="saveCurriculum" class="space-y-4">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">
            <span class="flex items-center gap-1 font-bold">
              ชื่อสถาบันการศึกษา
              <span class="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
            placeholder="กรอกชื่อสถาบันการศึกษา"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">
            <span class="flex items-center gap-1 font-bold">
              วิทยาเขต
              <span class="text-red-500 ml-1">*</span>
            </span>
          </label>
          <input
            v-model="form.campus"
            type="text"
            required
            class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
            placeholder="กรอกชื่อวิทยาเขต"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">
            <span class="flex items-center gap-1 font-bold">
              กลุ่มสถาบันการศึกษา
              <span class="text-red-500 ml-1">*</span>
            </span>
          </label>
          <v-select
            v-model="form.selectedCollege"
            :options="colleges"
            label="name"
            :reduce="(c) => c.id"
            placeholder="เลือกสถาบันการศึกษา..."
          />
        </div>

        <div class="flex flex-row mb-4 gap-4">
          <div class="w-full">
            <label for="countries" class="block mb-2 font-medium text-gray-900"
              >ประเทศ
              <span class="text-red-500 ml-1">*</span>
            </label>
            <v-select
              v-model="form.selectedCountry"
              :options="countryOptions"
              label="name"
              :reduce="(c) => c.id"
              placeholder="เลือกประเทศ"
            />
          </div>
          <div class="w-full">
            <label for="province" class="block mb-2 font-medium text-gray-900"
              >จังหวัด
              <span class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <v-select
                v-if="filteredProvinceOptions.length > 0"
                v-model="form.selectedProvince"
                :options="filteredProvinceOptions"
                label="name"
                :reduce="(p) => p.id"
                placeholder="เลือกจังหวัด"
              />
              <input
                v-else
                v-model="form.province"
                type="text"
                class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                placeholder="กรอกชื่อจังหวัด"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-row mb-4 gap-4">
          <div class="w-full">
            <label for="ispublic" class="block mb-2 font-medium text-gray-900"
              >สถานะการเผยแพร่</label
            >
            <Listbox
              v-model="selectedIspublic"
              as="div"
              class="relative w-full rounded-lg border px-2 py-[0.15rem]"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-2"
              >
                <span class="truncate">{{
                  selectedIspublic?.name || "สถานะการเผยแพร่"
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
                  v-for="ispublic in ispublicOptions"
                  :key="ispublic.id"
                  :value="ispublic"
                  class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                >
                  <span class="block truncate">{{ ispublic.name }}</span>
                  <span
                    v-if="selectedIspublic?.id === ispublic.id"
                    class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                  >
                    <CheckIcon class="w-5 h-5" aria-hidden="true" />
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </Listbox>
          </div>
          <div class="w-full">
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
        </div>
        <!-- ส่วนปุ่ม action -->
        <div class="flex justify-center gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-[#0085DB] hover:bg-[#0072B1] text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
          >
            <span v-if="!isLoading" class="flex items-center">
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
            <span v-else class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 mr-2"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                  clip-rule="evenodd"
                />
              </svg>

              บันทึก...
            </span>
          </button>
          <button
            type="button"
            @click="closeModal"
            class="bg-[#F95668] hover:bg-[#F95668]/80 text-white px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
/* =========================
 * Imports
 * =======================*/
import { reactive, ref, computed, watch, onMounted } from "vue";
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
const ispublicOptions = [
  { id: 1, value: true, name: "เผยแพร่" },
  { id: 0, value: false, name: "ไม่เผยแพร่" },
];

const selectedStatus = ref(statusOptions[0]);
const selectedIspublic = ref(ispublicOptions[0]);
/* =========================
 * State (single source of truth)
 * =======================*/
const props = defineProps({
  showModal: { type: Boolean, default: false },
  closeModal: { type: Function, default: () => {} },
});
const isLoading = ref(false);

// options data
const countryOptions = ref([]); // [{id,name,code}]
const provinceOptions = ref([]); // [{id,name,country_id}]
const colleges = ref([]); // [{id,name}]

// keep TH id for filtering provinces
const TH_ID = ref(null);

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
  selectedIspublic: ispublicOptions[0], // {id,value,name}
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
const num = (v) =>
  v === null || v === undefined || v === "" ? null : Number(v);
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

watch(
  () => props.showModal,
  (open) => {
    if (open) {
      clearForm();
      fetchCollegesDebounced();
    }
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

    colleges.value = rows.map((r) => ({
      id: r.id ?? r.code ?? String(r.name ?? ""),
      name: r.campus ? `${r.name} (${r.campus})` : r.name ?? "",
    }));
  } catch (e) {
    console.error("fetchColleges failed:", e);
    colleges.value = [];
  }
};
const fetchCollegesDebounced = debounce(fetchColleges, 300);

function clearForm() {
  form.name = "";
  form.campus = "";
  form.selectedCountry = null;
  form.selectedProvince = null;
  form.province = "";
  form.selectedCollege = null;
  form.selectedStatus = statusOptions[0];
  form.selectedIspublic = ispublicOptions[0];
  form.active = 1;
  form.college_id = null;
}

async function saveCurriculum() {
  const nameTrimmed = (form.name ?? "").trim();
  if (!nameTrimmed) {
    await Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อสถาบันการศึกษา" });
    return;
  }

  // ตรวจชื่อซ้ำ
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

  // ---- payload (ไทย → province id, ต่างประเทศ → province_name) ----
  const payload = {
    name: nameTrimmed,
    campus: form.campus ?? "",
    country: String(form.selectedCountry),
    institute_group: String(form.selectedCollege),

    ...(isThaiSelected.value
      ? { province: String(form.selectedProvince) } // ถ้า backend ใช้ province_id ให้เปลี่ยนชื่อคีย์ได้เลย
      : { province_name: textOrNull(form.province) }), // ชื่อจังหวัดแบบข้อความ

    is_published: Number(form.selectedIspublic?.id) === 1,
    active: Number(form.selectedStatus?.id ?? form.active ?? 1) === 1 ? 1 : 0, // ส่ง 1/0 ไม่ใช่ boolean
  };
  // ลบคีย์ undefined (กัน payload สกปรก)
  Object.keys(payload).forEach(
    (k) => payload[k] === undefined && delete payload[k]
  );

  console.log("👉 payload:", payload);
  isLoading.value = true;
  try {
    await addEducationCollege(payload);
    await Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลสำเร็จ!",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    clearForm();
    props.closeModal?.();
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

function closeModal() {
  if (isLoading.value) return; // กันปิดตอนกำลังโหลด
  props.closeModal?.();
}
</script>


