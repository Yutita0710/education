<template>
  <div class="relative">
    <!-- Header -->
    <header
      class="bg-custom-gradient px-4 py-10 md:py-20 rounded-md mb-4 md:mb-20 flex flex-col justify-center items-center text-center shadow-md"
    >
      <div class="flex items-start px-4"></div>
      <div class="px-4 md:px-0">
        <img
          class="mx-auto h-20 md:h-28 mt-2"
          src="../assets/img/tfac.ico"
          alt=""
        />
        <h1
          class="text-[#111C2D]/80 text-lg md:text-3xl font-bold drop-shadow-sm mt-4"
        >
          สถาบันการศึกษาที่ผ่านการรับรองจากสภาวิชาชีพบัญชี ในพระบรมราชูปถัมภ์
        </h1>
      </div>
    </header>

    <!-- Filter Section -->
    <div
      class="bg-white rounded-[1.4rem] border shadow-lg px-4 py-4 md:px-6 md:py-5 w-full h-auto md:-mt-[8rem] md:w-[90%] mt-0 mx-auto text-[#111C2D]/80"
    >
      <div
        class="flex flex-col gap-2 lg:grid lg:grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] lg:gap-6 w-full"
      >
        <!-- Search Box -->
        <div class="w-full">
          <div
            class="relative w-full flex items-center px-3 py-2 space-x-2 border border-gray-300 rounded-lg"
          >
            <svg
              class="w-5 h-5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              v-model="searchText"
              @keyup.enter="doSearch"
              type="text"
              placeholder="ค้นหาชื่อสถาบัน/วิทยาเขต"
              class="flex-1 min-w-0 bg-transparent placeholder-gray-400 text-gray-900 outline-none px-2 py-[0.15rem] text-sm md:text-base"
            />
          </div>
        </div>

        <div>
          <v-select
            v-model="selectedCountry"
            :options="countryOptions"
            label="name"
            :reduce="(country) => country.id"
            class="font-[15px]"
            placeholder="เลือกประเทศ"
          />
        </div>
        <div>
          <v-select
            v-model="selectedProvince"
            :options="filteredProvinceOptions"
            label="name"
            :reduce="(provinces) => provinces.id"
            class="font-[15px]"
            placeholder="เลือกจังหวัด"
            @input="selectedProvince = $event ? $event.id : null"
          />
        </div>

        <div>
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
        <div>
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

        <!-- ปุ่มล้างค่า -->
        <div class="flex justify-center items-center">
          <button
            @click="reset"
            class="shrink-0 bg-[#F8B15D] hover:bg-[#FE7743] text-white px-6 py-3 rounded-full shadow font-medium inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-5"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                d="M20 8c-1.403-2.96-4.463-5-8-5a9 9 0 1 0 0 18a9 9 0 0 0 9-9m0-9v6h-6"
              />
            </svg>
            ล้างค่า
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { countryList, provinceList } from "../services/apiService";
import { ref, onMounted, computed, watch, toRaw } from "vue";
import { useRoute } from "vue-router";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

const emit = defineEmits(["update:filters", "search"]);
const route = useRoute();

// ===== DEBUG helpers =====
const DEBUG = true; // หรือใช้ !!import.meta.env.DEV
const dbg = (...a) => {
  if (DEBUG) console.log("[SearchCollegeAdmin]", ...a);
};

// ===== state =====
const countryOptions = ref([]);
const provinceOptions = ref([]);

const searchText = ref("");
const selectedCountry = ref(null); // id|null
const selectedProvince = ref(null); // id|null
const selectedStatus = ref(null); // {id:'0'|'1', name} | null
const selectedIspublic = ref(null); // {id:'0'|'1', value:boolean, name} | null

const statusOptions = [
  { id: "1", name: "ใช้งาน" },
  { id: "0", name: "ไม่ใช้งาน" },
];
const ispublicOptions = [
  { id: "1", value: true, name: "เผยแพร่" },
  { id: "0", value: false, name: "ไม่เผยแพร่" },
];

// จังหวัดตามประเทศ
const filteredProvinceOptions = computed(() => {
  if (!selectedCountry.value) return provinceOptions.value;
  return provinceOptions.value.filter(
    (p) => String(p.country_id) === String(selectedCountry.value)
  );
});

// เปลี่ยนประเทศ รีเซ็ตจังหวัด
watch(
  () => selectedCountry.value,
  () => {
    selectedProvince.value = null;
  }
);

// “ค่าจาก UI” (raw) -> ปล่อยว่างได้
const paramsRaw = computed(() => ({
  search: (searchText.value || "").trim(),
  country: selectedCountry.value || "",
  province: selectedProvince.value || "",
  is_published: selectedIspublic.value?.value ?? "", // boolean | ""
  status: selectedStatus.value?.id ?? "", // "0" | "1" | ""
  page: 1,
  limit: 10,
  order: "id",
  sort: "ASC",
}));
// แปลงค่าหลายรูปแบบ -> boolean | undefined (undefined = ไม่กรอง)
const toBoolish = (v) => {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  if (v === false || v === "false" || v === 0 || v === "0") return false;
  return undefined;
};

const paramsForApi = computed(() => {
  const r = { ...paramsRaw.value };
  // ตัดเฉพาะค่าว่าง แต่ **คง false/0** ไว้
  const out = Object.fromEntries(
    Object.entries(r).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );

  if ("status" in out) out.status = Number(out.status); // "0"/"1" -> 0/1

  if ("is_published" in out) {
    const b = toBoolish(out.is_published);
    if (b === undefined) delete out.is_published; // ไม่กรอง = ไม่ส่ง
    else out.is_published = b; // boolean true/false
  }
  return out;
});

// กัน emit ระหว่าง init
const ready = ref(false);

// ยิง update:filters อัตโนมัติ (debounce 300ms)
let t;
watch(
  [
    searchText,
    selectedCountry,
    selectedProvince,
    selectedStatus,
    selectedIspublic,
  ],
  () => {
    if (!ready.value) return; // ยัง init อยู่ ไม่ต้อง emit
    clearTimeout(t);
    t = setTimeout(() => {
      dbg("emit update:filters (raw):", toRaw(paramsRaw.value));
      emit("update:filters", paramsRaw.value);
      // เพิ่มได้ถ้าชอบ:
      emit("search", paramsForApi.value);
      // ให้แม่ sync URL
    }, 300);
  },
  { deep: true }
);

// Enter / ปุ่มค้นหา
const doSearch = () => {
  dbg("doSearch raw:", toRaw(paramsRaw.value));
  dbg("doSearch for API:", toRaw(paramsForApi.value));
  emit("update:filters", paramsRaw.value);
  // เพิ่มได้ถ้าชอบ:
  emit("search", paramsForApi.value);

  emit("search", paramsRaw.value); // ถ้าแม่อยากยิงทันที
};

// เติมค่าจาก URL ให้ selection
function prefillFromUrl() {
  const q = route.query;

  // search
  if (q.search != null) searchText.value = String(q.search);

  // country / province
  if (q.country != null && String(q.country).trim() !== "") {
    selectedCountry.value = String(q.country);
  }
  if (q.province != null && String(q.province).trim() !== "") {
    selectedProvince.value = String(q.province);
  }

  // status ("0"|"1")
  if (q.status === "0" || q.status === "1") {
    selectedStatus.value =
      statusOptions.find((o) => o.id === String(q.status)) ?? null;
  }

  // is_published (รองรับ "1"|"0"|"true"|"false"|boolean)
  if (q.is_published !== undefined) {
    const v = q.is_published;
    let boolish = null;
    if (v === true || v === "true" || v === "1") boolish = true;
    else if (v === false || v === "false" || v === "0") boolish = false;

    selectedIspublic.value =
      boolish === null
        ? null
        : ispublicOptions.find((o) => o.value === boolish) ?? null;
  }
}

// โหลด options
onMounted(async () => {
  try {
    // ===== countries =====
    const countryRes = await countryList();
    let countries = (countryRes?.data ?? []).map((c) => ({
      id: c.id ?? c.country_id ?? c.code ?? String(c.name),
      name: c.name ?? c.country_name ?? c.code ?? "Unknown",
      code: c.code ?? null,
    }));

    const isThai = (x) => {
      const n = String(x.name || "")
        .toLowerCase()
        .trim();
      const code = String(x.code || "")
        .toUpperCase()
        .trim();
      return (
        n === "ไทย" || n === "ประเทศไทย" || n === "thailand" || code === "TH"
      );
    };

    countries = countries.sort((a, b) => {
      const aThai = isThai(a),
        bThai = isThai(b);
      if (aThai && !bThai) return -1;
      if (!aThai && bThai) return 1;
      return String(a.name).localeCompare(String(b.name), "th");
    });
    countryOptions.value = countries;

    // อย่าเซ็ต selectedCountry เอง (เพื่อไม่ให้ country ค้าง "87")
    const th = countries.find(isThai);
    const TH_ID = th ? th.id : null;

    // ===== provinces (ติด tag country_id = TH_ID เพื่อให้ฟิลเตอร์ทำงานเมื่อเลือก "ไทย") =====
    const provinceRes = await provinceList();
    let provinces = (provinceRes?.data ?? []).map((p) => ({
      id: p.id ?? p.province_id ?? String(p.name_th),
      name: p.name_th ?? p.province_name ?? "Unknown",
      country_id: TH_ID, // ให้เป็นรหัสไทย (ถ้าพบ) เพื่อใช้ฟิลเตอร์
    }));
    provinces = provinces.sort((a, b) =>
      String(a.name).localeCompare(String(b.name), "th")
    );
    provinceOptions.value = provinces;

    // ===== เติมค่าจาก URL -> แล้วค่อยอนุญาตให้ watcher ยิง =====
    prefillFromUrl();
    ready.value = true;

    // emit แรกหลัง init
    dbg("mounted emit (raw):", toRaw(paramsRaw.value));
    emit("update:filters", paramsRaw.value);
    // เพิ่มได้ถ้าชอบ:
    emit("search", paramsForApi.value);
  } catch (err) {
    console.error("Error fetching options:", err);
    ready.value = true; // ป้องกันค้าง
  }
});

// ปุ่มล้างค่า
const reset = () => {
  selectedCountry.value = null;
  selectedProvince.value = null;
  selectedStatus.value = null;
  selectedIspublic.value = null;
  searchText.value = "";
  dbg("reset (raw):", toRaw(paramsRaw.value));
  emit("update:filters", paramsRaw.value);
  // เพิ่มได้ถ้าชอบ:
  emit("search", paramsForApi.value);
};
</script>


