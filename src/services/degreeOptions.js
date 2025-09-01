// สร้างตัวเลือก degree จากผลลัพธ์ /education + map กับ /degrees
// ใช้กับฟังก์ชันจาก apiService ของคุณ:
//   - getDegrees()
//   - getEducationPaginated(page = 1, limit = 10, filters = {})

import { getDegrees, getEducationPaginated } from "@/services/apiService";

const DEFAULT_LABELS = { all: "แสดงระดับการศึกษาทั้งหมด" };
// จัดลำดับพิเศษก่อน แล้วค่อยเรียงชื่อ
const CUSTOM_ORDER = [6, 5, 4];

// cache ตามชุดฟิลเตอร์ เพื่อลดการยิง API ซ้ำ
const cache = new Map();

function makeFilterKey(filters = {}) {
  // อย่ารวม type เพราะเราต้องการ “รวมทุก degree” ตอนสร้าง options
  const {
    search = "",
    sort = 0,
    order = "ASC",
    college_active = "",
    curriculum_active = "",
    degree_active = "",
    college_name = "",
    start_year = "",
    end_year = "",
  } = filters;
  return JSON.stringify({
    search,
    sort,
    order,
    college_active,
    curriculum_active,
    degree_active,
    college_name,
    start_year,
    end_year,
  });
}

function extractDegreeId(row) {
  // รองรับหลายทรง payload
  return row?.degree?.id ?? row?.degree_id ?? row?.degreeId ?? null;
}

/**
 * สร้าง options ของ degree ตามฟิลเตอร์ปัจจุบัน (ยกเว้น type)
 * @param {Object} filters - ฟิลเตอร์ที่หน้า list ใช้อยู่ (search/year/etc)
 * @param {Object} opts - ตัวเลือกเสริม
 * @param {number} opts.pageSize - จำนวนรายการต่อหน้าเวลาสแกน /education
 * @param {number} opts.maxPages - จำกัดจำนวนหน้าที่จะสแกน (กันยิง API มากเกิน)
 * @returns {Promise<{ options: Array<{id:number|string,name:string}>, counts: Map<number, number> }>}
 */
export async function buildDegreeOptionsFromEducation(filters = {}, opts = {}) {
  const pageSize = Number(opts.pageSize ?? 100);
  const maxPages = Number(opts.maxPages ?? 20);

  const key = makeFilterKey(filters);
  if (cache.has(key)) return cache.get(key);

  try {
    // 1) โหลด master /degrees
    const degRes = await getDegrees();
    const master = Array.isArray(degRes?.data?.data) ? degRes.data.data : [];
    const masterById = new Map(
      master.map((d) => [Number(d.id), { id: Number(d.id), name: d.name }])
    );

    // 2) ไล่หน้า /education เพื่อหา degree ที่ “มีจริง” ภายใต้ฟิลเตอร์อื่น ๆ (ยกเว้น type)
    const scanFilters = { ...filters, type: "" };

    const foundIds = new Set();
    const counts = new Map();

    let page = 1;
    let totalPages = 1;

    do {
      const res = await getEducationPaginated(page, pageSize, scanFilters);
      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];

      for (const row of rows) {
        const id = extractDegreeId(row);
        if (id === null || id === "") continue;
        const n = Number(id);
        foundIds.add(n);
        counts.set(n, (counts.get(n) || 0) + 1);
      }

      const meta = res?.data?.meta ?? {};
      totalPages = Number(
        meta?.total_pages ?? meta?.totalPages ?? res?.data?.totalPages ?? page
      );
      if (!Number.isFinite(totalPages) || totalPages < page) totalPages = page;

      page += 1;
    } while (page <= totalPages && page <= maxPages);

    // 3) map id → master + เรียงลำดับ (CUSTOM_ORDER ก่อน แล้วค่อยตามชื่อ)
    const optsList = [...foundIds]
      .map((id) => masterById.get(id))
      .filter(Boolean)
      .sort((a, b) => {
        const ia = CUSTOM_ORDER.indexOf(a.id);
        const ib = CUSTOM_ORDER.indexOf(b.id);
        if (ia !== -1 || ib !== -1) {
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        }
        return String(a.name).localeCompare(String(b.name), "th");
      });

    const result = {
      options: [{ id: "", name: DEFAULT_LABELS.all }, ...optsList],
      counts, // Map<degreeId, number>
    };
    cache.set(key, result);
    return result;
  } catch (e) {
    console.error("[buildDegreeOptionsFromEducation] error:", e);
    // คืนค่า default อย่างน้อยให้ UI ทำงานต่อได้
    return {
      options: [{ id: "", name: DEFAULT_LABELS.all }],
      counts: new Map(),
    };
  }
}

export function clearDegreeOptionsCache() {
  cache.clear();
}
