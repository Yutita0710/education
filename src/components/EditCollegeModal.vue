<template>
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
      @click.self="handleClose"
    >
      <!-- แพแนลหลัก: ไม่มี overflow, ใช้ flex-col + overflow-hidden -->
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 sm:mx-6 relative flex flex-col overflow-hidden max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header: sticky -->
        <div
          class="sticky top-0 z-20 flex items-center justify-center bg-white px-4 sm:px-6 py-3 sm:py-4 border-b"
        >
          <!-- ปุ่มปิด (ยึดอยู่กับ header) -->
          <button
            @click="handleClose"
            class="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-7 h-7 sm:w-8 sm:h-8"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <h2 class="text-lg sm:text-xl font-bold text-center">
            แก้ไขข้อมูลสถาบัน
          </h2>
        </div>

        <!-- Body: overflow เลื่อนเฉพาะเนื้อหา -->
        <div class="px-4 sm:px-6 py-4 overflow-y-auto overscroll-contain">
          <form @submit.prevent="saveCollege" class="space-y-4">
            <!-- … (ฟอร์มเดิมทั้งหมดของคุณ วางต่อได้เลย) … -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                <span class="flex items-center gap-1 font-bold"
                  >ชื่อสถาบัน
                </span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="ชื่อสถาบัน"
                readonly
                class="bg-gray-100 w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700"
              />
            </div>

            <!-- วิทยาเขต (แก้ได้) -->
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-2">
                <label class="block text-gray-700">
                  <span class="flex items-center gap-1 font-bold"
                    >วิทยาเขต</span
                  >
                </label>
              </div>

              <input
                v-model.trim="form.campus"
                type="text"
                :readonly="lockCampus"
                :class="[
                  'w-full border-2 border-gray-200 px-4 py-3 rounded-xl transition-all duration-200 text-gray-700 placeholder-gray-400',
                  lockCampus
                    ? 'bg-gray-100 focus:ring-0'
                    : 'focus:ring-4 focus:ring-blue-100 focus:border-blue-500',
                ]"
                :placeholder="lockCampus ? 'เช่น บางเขน' : 'กรอกชื่อวิทยาเขต'"
              />
            </div>

            <!-- กลุ่มสถาบัน (ถ้ามี) -->
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">
                <span class="flex items-center gap-1 font-bold"
                  >กลุ่มสถาบัน</span
                >
              </label>

              <!-- อ่านอย่างเดียว -->
              <div
                v-if="lockGroup"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-700"
              >
                {{ displayGroupName }}
              </div>

              <!-- เลือกได้ -->
              <v-select
                v-else
                v-model="form.selectedCollege"
                :options="filteredCollegesForGroup"
                label="name"
                :reduce="(c) => String(c.id)"
                placeholder="เลือกสถาบัน..."
              />
            </div>

            <!-- ประเทศ -->
            <div class="mb-4">
              <label class="block mb-2 font-medium text-gray-900">
                ประเทศ
                <span v-if="showCountryStar" class="text-red-500 ml-1">*</span>
              </label>

              <!-- อ่านอย่างเดียว -->
              <div
                v-if="lockCountry"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-700"
              >
                {{ displayCountryName }}
              </div>

              <!-- เลือกได้ -->
              <v-select
                v-else
                v-model="form.selectedCountry"
                :options="countryOptions"
                label="name"
                :reduce="(c) => c.id"
                placeholder="เลือกประเทศ"
              />
            </div>

            <!-- จังหวัด (ไทยใช้ select / ต่างประเทศใช้ input) -->
            <div class="mb-4">
              <label class="block mb-2 font-medium text-gray-900">
                จังหวัด
                <span class="text-red-500 ml-1">*</span>
              </label>

              <!-- อ่านอย่างเดียว (มีค่าจาก API) -->
              <div
                v-if="lockProvince"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-700"
              >
                {{ displayProvinceName }}
              </div>

              <!-- ต้องกรอก/เลือก (ไม่มีค่าจาก API) -->
              <div v-else class="relative">
                <!-- ยังไม่เลือกประเทศ -->
                <input
                  v-if="!form.selectedCountry"
                  disabled
                  type="text"
                  class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl text-gray-400 bg-gray-50"
                  placeholder="โปรดเลือกประเทศก่อน"
                />

                <!-- ประเทศ = ไทย -> ใช้ select จังหวัด -->
                <v-select
                  v-else-if="isThaiSelected"
                  v-model="form.selectedProvince"
                  :options="filteredProvinceOptions"
                  label="name"
                  :reduce="(p) => String(p.id)"
                  placeholder="เลือกจังหวัด"
                />

                <!-- ประเทศ ≠ ไทย -> ใช้ input -->
                <input
                  v-else
                  v-model.trim="form.province"
                  type="text"
                  class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                  placeholder="กรอกชื่อจังหวัด/รัฐ"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block mb-2 font-medium text-gray-900"
                >สถานะการใช้งาน</label
              >
              <Listbox
                v-model="form.selectedStatus"
                as="div"
                class="relative w-full rounded-lg border px-2 py-[0.15rem]"
              >
                <ListboxButton
                  class="relative w-full inline-flex items-center justify-between px-3 py-2"
                >
                  <span class="truncate">{{
                    form.selectedStatus?.name || "สถานะการใช้งาน"
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
                    v-for="s in statusOptions"
                    :key="s.id"
                    :value="s"
                    class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                  >
                    <span class="block truncate">{{ s.name }}</span>
                    <span
                      v-if="form.selectedStatus?.id === s.id"
                      class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                      ><CheckIcon class="w-5 h-5" aria-hidden="true"
                    /></span>
                  </ListboxOption>
                </ListboxOptions>
              </Listbox>
            </div>
            <!-- Action (option): ติดล่างให้เห็นปุ่มตลอด -->
            <div
              class="sticky bottom-0 z-10 bg-white pt-3 mt-2 -mx-4 sm:-mx-6 px-4 sm:px-6 border-t"
            >
              <div class="flex justify-center gap-3 py-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="bg-[#0085DB] hover:bg-[#0072B1] text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6 mr-2"
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
                </button>

                <button
                  type="button"
                  @click="handleClose"
                  class="bg-[#F95668] hover:bg-[#F95668]/80 text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transition-all duration-200 flex items-center"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {
  reactive,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Swal from "sweetalert2";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

// ------- API -------
import {
  countryList,
  provinceList,
  getCollegesPaginated,
  updateEducationCollege,
} from "@/services/apiService";
import { h } from "vue";

// ------- Props & Emits -------
const props = defineProps({
  showModal: { type: Boolean, required: true },
  selectedCollege: { type: Object, default: () => ({}) }, // ข้อมูลแถวที่กดแก้ไขจากตาราง
});
const emit = defineEmits(["close", "saved"]);

// ------- Static options -------
const statusOptions = [
  { id: 1, name: "ใช้งาน" },
  { id: 0, name: "ไม่ใช้งาน" },
];
const ispublicOptions = [
  { id: 1, value: true, name: "เผยแพร่" },
  { id: 0, value: false, name: "ไม่เผยแพร่" },
];

const initial = reactive({
  groupId: null,
  countryId: null,
  provinceId: null, // ใช้ตอนประเทศ=TH
  provinceName: null, // ใช้ตอนประเทศ≠TH
});

const displayGroupName = computed(() => {
  // ถ้าไม่มีค่า → ว่าง
  if (!form.selectedCollege) return "";

  // ถ้าเลือกเป็นตัวเอง (กันเผื่อ) → ว่าง
  if (String(form.selectedCollege) === String(form.id)) return "";

  const opt = colleges.value.find(
    (o) => String(o.id) === String(form.selectedCollege)
  );
  return opt?.name || "";
});

const displayCountryName = computed(() => {
  const opt = countryOptions.value.find(
    (o) => String(o.id) === String(form.selectedCountry)
  );
  return opt?.name || "-";
});
const displayProvinceName = computed(() => {
  if (!form.selectedCountry) return "-";
  if (String(form.selectedCountry) === String(TH_ID.value)) {
    const opt = filteredProvinceOptions.value.find(
      (p) => String(p.id) === String(form.selectedProvince)
    );
    return opt?.name || "-";
  }
  return textOrNull(form.province) || "-";
});

const lockGroup = computed(() => !!initial.groupId);
const lockCountry = computed(() => !!initial.countryId);
const lockProvince = computed(() => {
  if (!initial.countryId) return false; // ยังไม่รู้ประเทศ ก็ยังไม่ล็อคจังหวัด
  // ถ้าเป็นไทย -> ต้องมี provinceId ถึงจะล็อค
  if (String(initial.countryId) === String(TH_ID.value)) {
    return !!initial.provinceId;
  }
  // ถ้าไม่ใช่ไทย -> ต้องมี provinceName ถึงจะล็อค
  return !!textOrNull(initial.provinceName);
});
// helper เช็คค่าว่าง
const isEmpty = (v) => textOrNull(v) === null;

// ประเทศ: โชว์ * เมื่อ "ยังไม่มีค่า" (ไม่ต้องสน lock ก็ได้ตามที่ต้องการ)
const showCountryStar = computed(() => isEmpty(form.selectedCountry));

// จังหวัด: ให้ขึ้น * เฉพาะตอนที่ “เลือกประเทศแล้ว” แต่ “ยังไม่มีจังหวัด”
const showProvinceStar = computed(() => {
  if (isEmpty(form.selectedCountry)) return false; // ยังไม่เลือกประเทศ → ยังไม่ต้องขึ้น *
  return isThaiSelected.value
    ? isEmpty(form.selectedProvince) // ไทย → ต้องเลือกจาก select
    : isEmpty(form.province); // ต่างประเทศ → ต้องกรอกข้อความ
});

const filteredCollegesForGroup = computed(() =>
  colleges.value.filter((c) => String(c.id) !== String(form.id))
);
const collegeById = (id) =>
  colleges.value.find((c) => String(c.id) === String(id)) || null;

// ------- Reactive state -------
const isLoading = ref(false);
const countryOptions = ref([]); // [{id,name,code}]
const provinceOptions = ref([]); // [{id,name,country_id}]
const colleges = ref([]); // [{id,name}]
const TH_ID = ref(null);

const form = reactive({
  id: null,
  name: "",
  campus: "",
  selectedCountry: null,
  selectedProvince: null,
  province: "",
  selectedCollege: "",
  selectedStatus: statusOptions[0],
  selectedIspublic: ispublicOptions[0],
});

// ------- Utils -------
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
const textOrNull = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

// 🔒 ใช้คุมว่า “ล็อกเพราะมีค่าจาก API” หรือไม่
const lockCampus = ref(false);

// ------- Computed -------
const isThaiSelected = computed(
  () => String(form.selectedCountry) === String(TH_ID.value)
);

const filteredProvinceOptions = computed(() =>
  isThaiSelected.value
    ? provinceOptions.value.filter(
        (p) => String(p.country_id) === String(TH_ID.value)
      )
    : []
);

// ------- Watchers -------
watch(
  () => form.selectedCountry,
  (nv, ov) => {
    if (String(nv) !== String(ov)) {
      if (isThaiSelected.value) form.province = "";
      else form.selectedProvince = null;
    }
  }
);

watch(
  () => props.showModal,
  async (open) => {
    if (open) {
      await bootstrapOptions();
      loadFormData();
    } else {
      clearForm();
    }
  }
);

watch(
  () => props.selectedCollege,
  () => {
    if (props.showModal) loadFormData();
  },
  { deep: true }
);

// ------- Lifecycle -------
onMounted(async () => {
  await bootstrapOptions();
  if (typeof form.selectedCollege === "number") {
    form.selectedCollege = String(form.selectedCollege);
  }

  // กรณีมีค่าเดิมมาเป็น object (เช่นทั้งแถวของ college) -> ดึง id มาเก็บ
  // @ts-ignore
  if (
    form.selectedCollege &&
    typeof form.selectedCollege === "object" &&
    "id" in form.selectedCollege
  ) {
    // @ts-ignore
    form.selectedCollege = String(form.selectedCollege.id);
  }
});

async function bootstrapOptions() {
  try {
    // countries
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

    // provinces (assign country_id = TH_ID)
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

    const params = {
      sort: "institute_group",
      order: "ASC",
      status: 1,
    };
    const resp = await getCollegesPaginated(params);
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
      name: r.campus ? `${r.name} (${r.name})` : r.name ?? "",
      // ✅ เก็บ institute_group มาด้วย
      institute_group: r.institute_group ?? null,
    }));
  } catch (e) {
    console.error("bootstrapOptions failed:", e);
  }
}
function resolveGroupRootId(selectedId) {
  if (!selectedId) return null;
  let node = collegeById(selectedId);
  const seen = new Set();

  while (
    node &&
    node.institute_group &&
    String(node.institute_group) !== String(node.id)
  ) {
    if (seen.has(String(node.id))) break; // กันวนลูปผิดปกติ
    seen.add(String(node.id));
    node = collegeById(node.institute_group);
  }
  // ถ้าเจอหัวกลุ่ม → คืนหัวกลุ่ม; ไม่งั้น fallback เป็นตัวที่เลือก
  return node ? String(node.id) : String(selectedId);
}
function clearForm() {
  form.id = null;
  form.name = "";
  form.campus = "";
  form.selectedCountry = null;
  form.selectedProvince = null;
  form.province = "";
  form.selectedCollege = null;
  form.selectedStatus = statusOptions[0];
  form.selectedIspublic = ispublicOptions[0];
  lockCampus.value = false;
}

function loadFormData() {
  const c = props.selectedCollege || {};
  form.id = c.id ?? null;
  form.name = c.name ?? "";
  form.campus = c.campus ?? "";
  lockCampus.value = !!textOrNull(c.campus);
  // ---- ประเทศ ----
  const countryId = c.country ?? c.country_id ?? c.countryCode ?? null;
  form.selectedCountry = countryId ? String(countryId) : null;

  // ---- จังหวัด ----
  if (String(form.selectedCountry) === String(TH_ID.value)) {
    form.selectedProvince = c.province ?? c.province_id ?? null;
    form.selectedProvince = form.selectedProvince
      ? String(form.selectedProvince)
      : null;
    form.province = "";
  } else {
    form.selectedProvince = null;
    form.province = c.province_name ?? c.province ?? "";
  }

  // ---- กลุ่มสถาบัน ----
  let groupId = c.institute_group ?? c.group_id ?? null;
  groupId = groupId ? String(groupId) : null;

  // ✅ ถ้า groupId เท่ากับ id ตัวเอง ให้ถือว่า "ไม่มีการจัดกลุ่ม"
  if (groupId && String(groupId) === String(c.id)) {
    groupId = null;
  }
  form.selectedCollege = groupId;

  // ---- สถานะ ----
  form.selectedStatus =
    Number(c.active) === 1 ? statusOptions[0] : statusOptions[1];

  // ====== เก็บค่าเดิมจาก API ไว้ตัดสินใจล็อค ======
  initial.countryId = form.selectedCountry;

  // ✅ อัปเดต initial.groupId หลัง normalize แล้ว (จะเป็น null ถ้าเท่ากับตัวเอง)
  initial.groupId = form.selectedCollege;

  if (String(form.selectedCountry) === String(TH_ID.value)) {
    initial.provinceId = form.selectedProvince;
    initial.provinceName = null;
  } else if (form.selectedCountry) {
    initial.provinceId = null;
    initial.provinceName = textOrNull(form.province);
  } else {
    initial.provinceId = null;
    initial.provinceName = null;
  }
}

function handleClose(force = false) {
  if (isLoading.value && !force) return; // กันผู้ใช้กดปิดกลางคัน แต่ allow force
  emit("close"); // parent ต้อง set showEditModal=false
}

async function saveCollege() {
  if (!form.id) {
    await Swal.fire({ icon: "error", title: "ไม่พบข้อมูลที่ต้องการแก้ไข" });
    return;
  }
  if (!form.name.trim()) {
    await Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อสถาบัน" });
    return;
  }
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
  const groupToSaveRaw = form.selectedCollege
    ? resolveGroupRootId(form.selectedCollege)
    : null;

  // 2) กันไม่ให้บันทึกเป็น id ของตัวเอง (ถือว่าไม่จัดกลุ่ม)
  const normalizedGroupId =
    groupToSaveRaw && String(groupToSaveRaw) !== String(form.id)
      ? groupToSaveRaw
      : null;

  const payloadRaw = {
    name: cleanStr(form.name),
    campus: textOrUndef(form.campus),
    country: idOrUndef(form.selectedCountry),
    // ⬇️ ใช้หัวกลุ่มจริงแทนค่า select ตรง ๆ
    institute_group: idOrUndef(normalizedGroupId),
    ...(isThaiSelected.value
      ? { province: idOrUndef(form.selectedProvince) }
      : { province: textOrUndef(form.province) }),
    active: Number(form.selectedStatus?.id) === 1 ? 1 : 0,
  };

  Object.keys(payloadRaw).forEach(
    (k) => payloadRaw[k] === undefined && delete payloadRaw[k]
  );

  const payload = payloadRaw;

  isLoading.value = true;

  try {
    await updateEducationCollege(form.id, payload);
    await Swal.fire({
      icon: "success",
      title: "อัปเดตข้อมูลสำเร็จ!",
      timer: 1400,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    emit("saved", { id: form.id, ...payload });
    handleClose(true); // ✅ ปิดตรงนี้เลย
  } catch (error) {
    console.error("update failed:", error);
    let msg = "ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง";
    if (error?.response?.status === 422) msg = "ข้อมูลที่กรอกไม่ถูกต้อง";
    else if (error?.response?.status === 404)
      msg = "ไม่พบข้อมูลที่ต้องการแก้ไข";
    else if (error?.response?.status === 403)
      msg = "คุณไม่มีสิทธิ์ในการแก้ไขข้อมูลนี้";
    else if (error?.response?.status === 500)
      msg = "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์";
    await Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: msg });
  } finally {
    isLoading.value = false;
  }
}

// ===== helpers (วางนอกฟังก์ชัน หรือบนไฟล์เดียวกัน) =====
const cleanStr = (v) => (typeof v === "string" ? v.trim() : v);
const textOrUndef = (v) => {
  const s = (v ?? "").toString().trim();
  return s ? s : undefined; // ค่าว่าง => undefined (จะถูกลบออก)
};
const idOrUndef = (v) => {
  const s = (v ?? "").toString().trim();
  return s ? s : undefined; // เอาเป็น string id ที่ไม่ว่าง
};
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

<style scoped>
/* ป้องกัน v-select หลุด container */
:deep(.vs__dropdown-menu) {
  max-height: 16rem;
}
</style>
