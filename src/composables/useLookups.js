// src/composables/useLookups.js
import { ref, computed } from "vue";
import { countryList, provinceList, getTypes } from "@/services/apiService";

const countries = ref([]); // [{id,name, code?}]
const provinces = ref([]); // [{id,name, country_id?}]
const types = ref([]);     // [{id,name}]
let once;

/** โหลด master data ทั้งหมดครั้งเดียว (shared across app) */
async function loadAll() {
  const [cRes, pRes, tRes] = await Promise.all([
    countryList().catch(() => ({ data: [] })),
    provinceList().catch(() => ({ data: [] })),
    getTypes().catch(() => ({ data: { data: [] } })),
  ]);

  countries.value = (cRes?.data ?? []).map((c) => ({
    id: c.id ?? c.country_id ?? c.code ?? String(c.name),
    name: c.name ?? c.country_name ?? c.code ?? "",
    code: String(c.code ?? "").toUpperCase(),
  }));

  provinces.value = (pRes?.data ?? []).map((p) => ({
    id: p.id ?? p.province_id ?? String(p.name_th),
    name: p.name_th ?? p.province_name ?? "",
    // ถ้า API ไม่มี country_id ของไทย คุณจะใช้ "TH" เป็น placeholder ก็ได้
    country_id: p.country_id ?? "TH",
  }));

  types.value = (tRes?.data?.data ?? [])
    .filter((t) => Number(t.active) === 1)
    .map((t) => ({ id: Number(t.id), name: String(t.type_name) }));
}

/** รวม lookup สำหรับประเทศ/จังหวัด/ประเภท */
export function useLookups() {
  async function ensureLoaded() {
    if (!once) once = loadAll();
    await once;
  }

  // ===== maps =====
  const countryMap = computed(() => {
    const m = new Map();
    countries.value.forEach((c) => m.set(String(c.id), c.name));
    return m;
  });
  const provinceMap = computed(() => {
    const m = new Map();
    provinces.value.forEach((p) => m.set(String(p.id), p.name));
    return m;
  });
  const typeMap = computed(() => {
    const m = new Map();
    types.value.forEach((t) => m.set(Number(t.id), t.name));
    return m;
  });
  const typeNameToId = computed(() => {
    const m = new Map();
    types.value.forEach((t) => m.set(String(t.name).trim(), Number(t.id)));
    return m;
  });

  // ถ้าต้องการเช็คพร้อมจริง ๆ ให้รวม provinces ด้วย
  const readyAll = computed(
    () =>
      countries.value.length > 0 &&
      provinces.value.length > 0 &&
      types.value.length > 0
  );

  // ===== helpers =====
  const isNil = (v) => v === null || v === undefined;
  const hasVal = (v) => !isNil(v) && String(v).trim() !== "";

  function normalizeIds(v) {
    // รองรับ: [1,2], ["1","2"], [{id:1},{id:2}], "1,2", "1 2", 1
    if (Array.isArray(v)) {
      return v
        .map((x) => (typeof x === "object" ? x?.id : x))
        .map((n) => Number(n))
        .filter(Number.isFinite);
    }
    if (typeof v === "string") {
      const s = v.trim();
      // ถ้าสตริงมีตัวเลขล้วน → แปลงเป็น ids
      const ids = s
        .split(/[,\uFF0C\u3001\s]+/)
        .map((p) => Number(p.trim()))
        .filter(Number.isFinite);
      return ids;
    }
    if (typeof v === "number") return [v];
    return [];
  }

  function normalizeTypeNames(v) {
    // รองรับ: "สมาชิกสามัญ, สมาชิกวิสามัญ", ["สมาชิกสามัญ", "สมาชิกวิสามัญ"], [{name:"สมาชิกสามัญ"}]
    if (Array.isArray(v)) {
      return v
        .map((x) =>
          typeof x === "object" ? x?.name ?? x?.type_name : String(x ?? "")
        )
        .map((s) => String(s).trim())
        .filter(Boolean);
    }
    if (typeof v === "string") {
      return v
        .split(/[,\uFF0C\u3001\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }

  // รับได้ทั้ง id | object | name-string
  function displayCountry(val, fallback = " ") {
    if (isNil(val)) return fallback;
    // object { id, name }
    if (typeof val === "object") {
      const name =
        val?.name ??
        val?.country_name ??
        val?.thai_name ??
        val?.name_th ??
        val?.label;
      if (hasVal(name)) return String(name);
      const id = val?.id ?? val?.country_id ?? val?.code;
      if (hasVal(id)) return countryMap.value.get(String(id)) ?? fallback;
      return fallback;
    }
    // สตริงชื่ออยู่แล้ว
    if (typeof val === "string" && !/^\d+$/.test(val.trim())) {
      return val.trim() || fallback;
    }
    // id number/string
    return countryMap.value.get(String(val)) ?? fallback;
  }

  function displayProvince(val, fallback = " ") {
    if (isNil(val)) return fallback;
    if (typeof val === "object") {
      const name =
        val?.name ??
        val?.province_name ??
        val?.thai_name ??
        val?.name_th ??
        val?.label;
      if (hasVal(name)) return String(name);
      const id = val?.id ?? val?.province_id;
      if (hasVal(id)) return provinceMap.value.get(String(id)) ?? fallback;
      return fallback;
    }
    if (typeof val === "string" && !/^\d+$/.test(val.trim())) {
      return val.trim() || fallback;
    }
    return provinceMap.value.get(String(val)) ?? fallback;
  }

  const ALL_SET = new Set([1, 2, 3]); // ปรับตามระบบจริงของคุณ

  function displayTypes(raw, fallback = " ") {
    // 1) ลองตีเป็น ids ก่อน
    let ids = normalizeIds(raw);

    // 2) ถ้าไม่มี ids และ raw เป็นชื่อ → map ชื่อกลับเป็น id
    if (!ids.length) {
      const names = normalizeTypeNames(raw);
      if (names.length) {
        ids = names
          .map((n) => typeNameToId.value.get(n))
          .filter(Number.isFinite);
        // ถ้ายังไม่มี id เลย แปลว่า raw คือชื่อที่ไม่อยู่ใน lookup → คืนชื่อเดิม
        if (!ids.length) return names.join(", ") || fallback;
      }
    }

    if (!ids.length) return fallback;

    // “ทุกประเภท” = ครบชุดที่ระบบกำหนด
    if (ids.length === ALL_SET.size && [...ALL_SET].every((n) => ids.includes(n)))
      return "สมาชิกทุกประเภท";

    // แสดงชื่อจาก id (ไม่เจอ → กรองทิ้ง)
    const names = ids.map((i) => typeMap.value.get(i)).filter(Boolean);
    return names.length ? names.join(", ") : fallback;
  }

  /** แต่งแถวไว้ใช้ในตาราง: รับดิบ → เติมชื่อประเทศ/จังหวัดให้แน่นอน */
  function decorateRow(row = {}) {
    const countryRaw = row.countryName ?? row.country_name ?? row.country ?? row.country_id;
    const provinceRaw = row.provinceName ?? row.province_name ?? row.province ?? row.province_id;
    return {
      ...row,
      countryName: displayCountry(countryRaw, ""),
      provinceName: displayProvince(provinceRaw, ""),
      // ถ้าต้องการ: typesDisplay: displayTypes(row.type ?? row.type_ids ?? row.types, " "),
    };
  }

  return {
    // loader
    ensureLoaded,
    readyAll,

    // display helpers
    displayCountry,
    displayProvince,
    displayTypes,
    decorateRow,

    // raw maps ถ้าจำเป็นต้องแตะ
    countryMap,
    provinceMap,
    typeMap,
  };
}

/** คอมโพสเอเบิลย่อยเฉพาะ "ประเภทสมาชิก" (คงชื่อเดิมเพื่อใช้งานต่อ) */
export function useTypeLookup() {
  async function ensureReady() {
    if (!once) once = loadAll();
    await once;
  }
  const ready = computed(() => types.value.length > 0);
  const typeLookup = computed(() =>
    Object.fromEntries(types.value.map((t) => [t.id, t.name]))
  );
  return { ready, typeLookup, ensureReady };
}
