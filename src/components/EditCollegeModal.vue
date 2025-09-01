<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 text-gray-700"
  >
    <div
      class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl relative overflow-y-auto"
    >
      <!-- Close button -->
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

      <h2 class="text-xl font-bold text-center mb-4">
        แก้ไขข้อมูลสถาบันการศึกษา
      </h2>

      <form @submit.prevent="saveCollege" class="space-y-4">
        <!-- ชื่อสถาบัน (ล็อค) -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">
            <span class="flex items-center gap-1 font-bold"
              >ชื่อสถาบันการศึกษา <span class="text-red-500 ml-1">*</span></span
            >
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="ชื่อสถาบันการศึกษา"
            class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700"
          />
        </div>

        <!-- วิทยาเขต (แก้ได้) -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">
            <span class="flex items-center gap-1 font-bold">วิทยาเขต</span>
          </label>
          <input
            v-model.trim="form.campus"
            type="text"
            class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
            placeholder="เช่น บางเขน"
          />
        </div>

        <!-- กลุ่มสถาบัน (ถ้ามี) -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">
            <span class="flex items-center gap-1 font-bold"
              >กลุ่มสถาบันการศึกษา</span
            >
          </label>
          <v-select
            v-model="form.selectedCollege"
            :options="colleges"
            label="name"
            :reduce="(c) => String(c.id)"
            placeholder="เลือกสถาบันการศึกษา..."
          />
        </div>

        <div class="flex flex-row mb-4 gap-4">
          <!-- ประเทศ -->
          <div class="w-full">
            <label class="block mb-2 font-medium text-gray-900"
              >ประเทศ <span class="text-red-500 ml-1">*</span></label
            >
            <v-select
              v-model="form.selectedCountry"
              :options="countryOptions"
              label="name"
              :reduce="(c) => c.id"
              placeholder="เลือกประเทศ"
            />
          </div>

          <!-- จังหวัด (ไทยใช้ select / ต่างประเทศใช้ input) -->
          <div class="w-full">
            <label class="block mb-2 font-medium text-gray-900"
              >จังหวัด
              <span
                v-if="filteredProvinceOptions.length > 0"
                class="text-red-500 ml-1"
                >*</span
              >
            </label>
            <div class="relative">
              <v-select
                v-if="filteredProvinceOptions.length > 0"
                v-model="form.selectedProvince"
                :options="filteredProvinceOptions"
                label="name"
                :reduce="(p) => String(p.id)"
                placeholder="เลือกจังหวัด"
              />
              <input
                v-else
                v-model.trim="form.province"
                type="text"
                class="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                placeholder="กรอกชื่อจังหวัด/รัฐ"
              />
            </div>
          </div>
        </div>

        <!-- สถานะการเผยแพร่ / การใช้งาน -->
        <div class="flex flex-row mb-4 gap-4">
          <div class="w-full">
            <label class="block mb-2 font-medium text-gray-900"
              >สถานะการเผยแพร่</label
            >
            <Listbox
              v-model="form.selectedIspublic"
              as="div"
              class="relative w-full rounded-lg border px-2 py-[0.15rem]"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-2"
              >
                <span class="truncate">{{
                  form.selectedIspublic?.name || "สถานะการเผยแพร่"
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
                  v-for="p in ispublicOptions"
                  :key="p.id"
                  :value="p"
                  class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-blue-50"
                >
                  <span class="block truncate">{{ p.name }}</span>
                  <span
                    v-if="form.selectedIspublic?.id === p.id"
                    class="absolute inset-y-0 left-3 flex items-center text-blue-600"
                    ><CheckIcon class="w-5 h-5" aria-hidden="true"
                  /></span>
                </ListboxOption>
              </ListboxOptions>
            </Listbox>
          </div>

          <div class="w-full">
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
        </div>
        <!-- <div class="flex flex-row mb-8 gap-4">
          <div class="w-full">
            <label class="block mb-2 font-medium text-gray-900"
              >เหตุผลการแก้ไขข้อมูล
              <span class="text-red-500 ml-1">*</span>
            </label>
            <Listbox
              v-model="form.selectedRemark"
              as="div"
              class="relative w-full rounded-lg border px-2 py-[0.15rem]"
            >
              <ListboxButton
                class="relative w-full inline-flex items-center justify-between px-3 py-2"
              >
                <span class="truncate">{{
                  form.selectedRemark?.name || "เหตุผลการแก้ไขข้อมูล"
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
                  v-for="s in remarkOptions"
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
        </div> -->
        <!-- Action -->
        <div
          class="flex justify-center gap-3 pt-6 border-t border-gray-200 mb-10"
        >
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-[#0085DB] hover:bg-[#0072B1] text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
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
                class="size-6 mr-2 animate-spin"
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
            @click="handleClose"
            class="bg-[#F95668] hover:bg-[#F95668]/80 text-white px-4 py-2 rounded-full font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from "vue";
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

const remarkOptions = [
  { id: 1, name: "เปลี่ยนชื่อสถาบันการศึกษา" },
  { id: 2, name: "เลิกใช้งาน" },
  { id: 3, name: "อื่นๆ" },
];
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
  selectedCollege: null,
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

// ------- Computed -------
const isThaiSelected = computed(
  () => String(form.selectedCountry) === String(TH_ID.value)
)

const filteredProvinceOptions = computed(() =>
  isThaiSelected.value
    ? provinceOptions.value.filter(
        (p) => String(p.country_id) === String(TH_ID.value)
      )
    : []
)


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

    // colleges (for grouping field)
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
    console.error("bootstrapOptions failed:", e);
  }
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
}

function loadFormData() {
  const c = props.selectedCollege || {};
  form.id = c.id ?? null;
  form.name = c.name ?? "";
  form.campus = c.campus ?? "";

  // ประเทศ
  const countryId = c.country ?? c.country_id ?? c.countryCode ?? null;
  form.selectedCountry = countryId ? String(countryId) : null;

  // จังหวัด
  if (String(form.selectedCountry) === String(TH_ID.value)) {
    // ถ้าไทย → ใช้ province id
    form.selectedProvince = c.province ?? c.province_id ?? null;
    form.selectedProvince = form.selectedProvince
      ? String(form.selectedProvince)
      : null;
    form.province = "";
  } else {
    // ถ้าไม่ใช่ไทย → ให้แสดงชื่อจังหวัด/รัฐ ใน input
    form.selectedProvince = null;
    form.province = c.province_name ?? c.province ?? "";
  }

  // กลุ่มสถาบัน
  form.selectedCollege = c.institute_group ?? c.group_id ?? null;
  form.selectedCollege = form.selectedCollege
    ? String(form.selectedCollege)
    : null;

  // สถานะ
  form.selectedStatus =
    Number(c.active) === 1 ? statusOptions[0] : statusOptions[1];
  form.selectedIspublic = Boolean(c.is_published)
    ? ispublicOptions[0]
    : ispublicOptions[1];
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
    await Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อสถาบันการศึกษา" });
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

  const payload = {
    name: form.name.trim(),
    campus: form.campus ?? "",
    country: String(form.selectedCountry),
    institute_group: form.selectedCollege ? String(form.selectedCollege) : null,
    ...(isThaiSelected.value
      ? { province: String(form.selectedProvince) }
      : { province: textOrNull(form.province) }),
    is_published: Number(form.selectedIspublic?.id) === 1,
    active: Number(form.selectedStatus?.id) === 1 ? 1 : 0,
  };
  Object.keys(payload).forEach(
    (k) => payload[k] === undefined && delete payload[k]
  );

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
</script>

<style scoped>
/* ป้องกัน v-select หลุด container */
:deep(.vs__dropdown-menu) {
  max-height: 16rem;
}
</style>
