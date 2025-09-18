// ---- src/utils/sanitize.js ----
export const MAX_SEARCH_LEN = 120;

// ตัด zero-width, ยุบช่องว่าง, trim, และ normalize รูปแบบตัวอักษร
export const normalizeText = (v) =>
  String(v ?? "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width
    .replace(/\s+/g, " ")
    .trim();

// ปลอดภัยสำหรับช่องค้นหา: กัน < > " ` $ \ และ escape % _
export const sanitizeSearch = (v) => {
  let s = normalizeText(v);
  s = s.replace(/[<>"`$\\]/g, "");  // กัน XSS-ish
  s = s.replace(/[%_]/g, "\\$&");   // escape สำหรับ SQL LIKE
  return s.slice(0, MAX_SEARCH_LEN);
};

// ดึง id ออกจาก option ถ้าไม่มีให้เป็น ""
export const toIdOrEmpty = (opt) =>
  opt?.id === null || opt?.id === undefined || opt?.id === "" ? "" : String(opt.id);

// ปีต้องเป็นเลข 4 หลักในช่วงที่ยอมรับ (นอกช่วงคืน "")
export const sanitizeYear = (optOrVal) => {
  const raw = optOrVal?.id ?? optOrVal;        // รับได้ทั้ง object {id,name} หรือ primitive
  const s = String(raw ?? "").trim();

  // ต้องเป็นตัวเลข 4 หลัก
  if (!/^\d{4}$/.test(s)) return "";

  const n = Number(s);
  // รองรับทั้ง ค.ศ. และ พ.ศ.
  const isCE = n >= 1900 && n <= 2100;
  const isBE = n >= 2400 && n <= 2799;

  return (isCE || isBE) ? s : "";
};
// ค่าที่เป็น "" หรือ undefined/null → ตัดออก
export const compactObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v != null));

// สร้าง payload สำหรับ onSearch ทีเดียวจบ
export const buildSearchPayload = ({
  type,
  search,
  startYear,
  endYear,
  curriculum_published,
  curriculum_active,
}) =>
  compactObject({
    type: toIdOrEmpty(type),
    search: sanitizeSearch(search),
    startYear: sanitizeYear(startYear),
    endYear: sanitizeYear(endYear),
    curriculum_published: toIdOrEmpty(curriculum_published),
    curriculum_active: toIdOrEmpty(curriculum_active),
  });
