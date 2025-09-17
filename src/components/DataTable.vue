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

    <div
      class="overflow-y-auto md:overflow-y-hidden border border-gray-300 rounded-lg"
    >
      <table class="w-full border-collapse text-[14px]">
        <!-- 👈 fix: บังคับ 14px ทั้งตาราง -->
        <thead>
          <tr class="bg-[#E2EDFC]">
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[50px] text-[14px] font-bold"
            >
              ลำดับ
            </th>

            <!-- ชื่อสถาบัน -->
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[200px] text-[14px] font-bold"
            >
              ชื่อสถาบัน
            </th>

            <!-- ชื่อหลักสูตร -->
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[250px] text-[14px] font-bold"
            >
              ชื่อหลักสูตร
            </th>

            <!-- หลักสูตร (คำอธิบาย) -->
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[200px] text-[14px] font-bold"
            >
              หลักสูตร
            </th>

            <!-- ระดับการศึกษา -->
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] text-[14px] font-bold"
            >
              ระดับการศึกษา
            </th>

            <!-- หลักสูตรสำหรับ -->
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] text-[14px] font-bold"
            >
              หลักสูตรสำหรับ
            </th>

            <!-- ปีที่เริ่มต้น -->
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] text-[14px] font-bold"
            >
              ปีที่เริ่มต้น
            </th>

            <!-- ปีที่สิ้นสุด -->
            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] text-[14px] font-bold"
            >
              ปีที่สิ้นสุด
            </th>

            <th
              class="border px-2 py-[0.7rem] whitespace-nowrap w-[100px] text-[14px] font-bold"
            >
              รายละเอียด
            </th>
          </tr>
        </thead>

        <tbody v-if="Array.isArray(rows) && rows.length > 0">
          <tr
            v-for="(item, index) in rows"
            :key="item.id ?? index"
            class="hover:bg-gray-50 text-gray-600"
          >
            <!-- ลำดับ -->
            <td class="border px-2 py-1 text-center">
              {{
                (Number(meta.per_page) || 0) *
                  ((Number(meta.current_page) || 1) - 1) +
                index +
                1
              }}
            </td>

            <!-- ชื่อสถาบัน -->
            <td class="border px-2 py-1">
              {{
                item.college
                  ? item.college.name +
                    (item.college.campus ? ` ${item.college.campus}` : "")
                  : ""
              }}
            </td>

            <!-- ชื่อหลักสูตร -->
            <td class="border px-2 py-1">
              {{ item.name || "" }}
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

            <!-- ปีที่เริ่มต้น / สิ้นสุด -->
            <td class="border px-2 py-1 text-center">
              {{ item.start_year || "" }}
            </td>
            <td class="border px-2 py-1 text-center">
              {{ item.end_year || "" }}
            </td>

            <!-- หมายเหตุ -->
            <td class="border px-2 py-1">
              {{ item.remark || "" }}
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td colspan="9" class="text-center text-gray-500 py-6">
              ไม่พบข้อมูล
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getTypes } from "@/services/apiService";

const props = defineProps({
  curriculums: { type: Array, required: true },
  meta: { type: Object, required: true },
  total: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  // ✅ รับคีย์ sort/order จากพาเรนต์ เพื่อแสดงลูกศรถูกคอลัมน์
  order: { type: String, default: "ASC" },
  isAdmin: { type: Boolean, default: false },
});
const emit = defineEmits(["refresh"]);

const rows = computed(() =>
  Array.isArray(props.curriculums) ? props.curriculums : []
);

// ---------------------- ประเภทสมาชิก (mapping) ----------------------
const TYPE_ALL_NAME = "สมาชิกทุกประเภท";

const typeLookup = ref({}); // { id: name }
const idByName = ref({}); // { name: id }
const activeTypeIds = ref([]); // [1,2,3,...]

// โหลดประเภทจาก API แล้วทำ mapping
async function loadTypeLookup() {
  try {
    const res = await getTypes();
    const list = Array.isArray(res?.data?.data) ? res.data.data : [];
    const active = list.filter((t) => Number(t.active) === 1);

    // id -> name
    typeLookup.value = Object.fromEntries(
      active.map((t) => [Number(t.id), String(t.type_name || t.name)])
    );
    // name -> id
    idByName.value = Object.fromEntries(
      active.map((t) => [String(t.type_name || t.name), Number(t.id)])
    );
    // เก็บชุด id ที่ active ทั้งหมด เพื่อเช็ค "ทุกประเภท"
    activeTypeIds.value = active
      .map((t) => Number(t.id))
      .filter(Number.isFinite);
  } catch (e) {
    console.error("getTypes error:", e);
    typeLookup.value = {};
    idByName.value = {};
    activeTypeIds.value = [];
  }
}
onMounted(loadTypeLookup);

// แปลงค่าประเภทให้เป็น [number]
function normalizeIds(val) {
  if (Array.isArray(val)) return val.map(Number).filter(Number.isFinite);
  if (typeof val === "string") {
    return val
      .split(/[ ,、，\uFF0C\u3001]+/)
      .map((s) => Number(String(s).trim()))
      .filter(Number.isFinite);
  }
  if (typeof val === "number") return [val];
  return [];
}

// ชุด ids ที่ส่งมา ครอบคลุมทุก id ที่ active ไหม?
function coversAllActive(ids) {
  if (!activeTypeIds.value.length) return false;
  const have = new Set(ids);
  return activeTypeIds.value.every((id) => have.has(id));
}

function renderTypes(item) {
  // 1) รูปแบบเป็น objects ใน item.types
  if (Array.isArray(item.types) && item.types.length) {
    // ถ้ามีชื่อ "สมาชิกทุกประเภท" ติดมาก็คืนทันที
    const rawNames = item.types
      .map((t) => t?.name || t?.type_name)
      .filter(Boolean);

    if (rawNames.includes(TYPE_ALL_NAME)) return TYPE_ALL_NAME;

    // พยายามดึง ids จาก objects (id) หรือ map จากชื่อกลับเป็น id
    let ids = item.types.map((t) => Number(t?.id)).filter(Number.isFinite);

    if (!ids.length && rawNames.length) {
      ids = rawNames.map((n) => idByName.value[n]).filter(Number.isFinite);
    }

    if (coversAllActive(ids)) return TYPE_ALL_NAME;

    // แสดงชื่อที่ได้ (ถ้าไม่ครบทุกประเภท)
    const names = item.types
      .map((t) => t?.name || t?.type_name || typeLookup.value[Number(t?.id)])
      .filter(Boolean);

    return [...new Set(names)].join(", ");
  }

  // 2) รูปแบบเป็น ids: item.type_ids หรือ item.type
  let ids = [];
  if (Array.isArray(item.type_ids) && item.type_ids.length) {
    ids = normalizeIds(item.type_ids);
  } else if (item.type != null) {
    ids = normalizeIds(item.type);

    // กรณี type เป็นสตริงชื่อไทย เช่น "สมาชิกสามัญ"
    if (!ids.length && typeof item.type === "string") {
      const s = item.type.trim();
      if (s === TYPE_ALL_NAME) return TYPE_ALL_NAME;

      // แยกชื่อแล้ว map กลับเป็น id เพื่อตรวจ coversAllActive
      const parts = s
        .split(/[ ,、，\uFF0C\u3001]+/)
        .map((x) => x.trim())
        .filter(Boolean);
      const maybeIds = parts
        .map((n) => idByName.value[n])
        .filter(Number.isFinite);

      if (coversAllActive(maybeIds)) return TYPE_ALL_NAME;
      // ไม่ครบทุกประเภทและเป็นชื่ออยู่แล้ว → คืนชื่อเดิม
      return s;
    }
  }

  if (!ids.length) return "";

  // ✅ “ทุกประเภท” = ครอบคลุมทุก id ที่ active (เช่น 1,2,3 ทั้งหมด)
  if (coversAllActive(ids)) return TYPE_ALL_NAME;

  // แปลงเป็นชื่อทีละ id
  const names = ids.map((id) => typeLookup.value[id]).filter(Boolean);
  return names.join(", ");
}
</script>
