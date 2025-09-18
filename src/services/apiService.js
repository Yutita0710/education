// src/services/apiService.js
import axios from "axios";

/* =========================
 *  CONFIG
 * =======================*/

// ใช้ env ของ Vite ให้ถูกต้อง
const env = import.meta.env;

// Sliding session TTL (ms)
const SESSION_TTL_MS = Number(env.VITE_SESSION_TTL_MS) || 60 * 60 * 1000; // 60 นาที

// อ่านค่า runtime override จาก public/env.js (ถ้ามี)
const RUNTIME_API_BASE =
  typeof window !== "undefined" ? window.__RUNTIME_CONFIG__?.API_BASE?.trim() : undefined;

// อ่านค่า env ตอน build
const ENV_API_BASE = env.VITE_API_BASE?.trim();

/** ลบ / ท้ายสุด */
const stripTrailingSlash = (u) => (u ? u.replace(/\/+$/, "") : u);

/** เติม /api ถ้าไม่มี */
const withApiSuffix = (u) => {
  if (!u) return u;
  const clean = stripTrailingSlash(u);
  return clean.toLowerCase().endsWith("/api") ? clean : `${clean}/api`;
};

// เลือก BASE_URL ตามโหมด
const BASE_URL = env.DEV
  ? "/api" // dev ใช้ Vite proxy
  : stripTrailingSlash(
      // ลำดับ: runtime > env > fallback
      RUNTIME_API_BASE ||
        withApiSuffix(ENV_API_BASE) ||
        "https://master-dev.tfac.or.th/api"
    );

// เตือนถ้าโปรดักชันไม่มีทั้ง runtime และ env (ยังมี fallback ให้)
if (!env.DEV && !RUNTIME_API_BASE && !ENV_API_BASE) {
  // eslint-disable-next-line no-console
  console.warn("[apiService] VITE_API_BASE ไม่ถูกตั้งค่า ใช้ fallback:", BASE_URL);
}

/* =========================
 *  AXIOS INSTANCE
 * =======================*/

export const apiClient = axios.create({
  baseURL: BASE_URL, // ✅ ใช้ตัวแปรที่ถูกต้อง
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // คุณใช้ Bearer token ใน localStorage อยู่แล้ว
});

/* ========== Interceptors ========== */

// Request: แนบ token + ต่ออายุเมื่อมี activity
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem("expiry", String(Date.now() + SESSION_TTL_MS));
  }
  return config;
});

// Response: ต่ออายุเมื่อสำเร็จ + จัดการ 401/419
let isHandlingAuthError = false;

apiClient.interceptors.response.use(
  (res) => {
    if (localStorage.getItem("token")) {
      localStorage.setItem("expiry", String(Date.now() + SESSION_TTL_MS));
    }
    return res;
  },
  (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 419) && !isHandlingAuthError) {
      isHandlingAuthError = true;
      try {
        // ล้าง session ทั้งหมด
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("expiry");

        // แจ้งให้ส่วนกลางรู้ (เช่น App.vue ฟัง event นี้เพื่ออัปเดต UI)
        window.dispatchEvent(new Event("auth-changed"));

        // หลีกเลี่ยง redirect loop ถ้าอยู่หน้า login อยู่แล้ว
        const nowPath = window.location.pathname;
        const nowQuery = window.location.search || "";
        const loginPath = "/admin/login";

        if (!nowPath.startsWith(loginPath)) {
          const redirectTarget = nowPath + nowQuery;
          const url = `${loginPath}?redirect=${encodeURIComponent(redirectTarget)}`;
          window.location.replace(url); // replace กัน back กลับมาหน้าหมดอายุ
        }
      } finally {
        setTimeout(() => (isHandlingAuthError = false), 500);
      }
    }
    return Promise.reject(error);
  }
);

/* =========================
 *  SMALL UTILITIES
 * =======================*/

export const SEARCH_MAX = Number(env.VITE_SEARCH_MAX) || 120;

export function sanitizeSearch(input, maxLen = SEARCH_MAX) {
  if (input == null) return "";
  let s = String(input);
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/[^0-9A-Za-zก-๙\s.,\-_@/()'":]/g, "");
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}

const compact = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );

const toInt = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n)));

/* =========================
 *  API FUNCTIONS
 * =======================*/

// Degrees
export const getDegrees = () => apiClient.get("/education/degrees");

/* -------- Colleges -------- */

export const getCollegesPaginated = (params = {}) => {
  // คำนวณ limit แบบ optional: มีค่อยส่ง ไม่มีอย่าส่ง
  const rawLimit = toInt(params.limit, undefined);
  const limit =
    Number.isFinite(rawLimit) ? clamp(rawLimit, 1, 100) : undefined;

  // ถ้ามี limit ค่อยส่ง page ด้วย
  const rawPage = toInt(params.page, 1);

  const queryBase = compact({
    ...(limit !== undefined ? { page: rawPage } : {}),
    ...(limit !== undefined ? { limit } : {}),
    sort: String(params.sort || "institute_group"),
    order:
      String(params.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC",
  });

  const queryExtra = {};
  if (typeof params.search === "string") {
    const q = sanitizeSearch(params.search);
    if (q) queryExtra.search = q;
  }
  if (params.country) queryExtra.country = String(params.country);
  if (params.province) queryExtra.province = String(params.province);
  if (
    params.status === 0 || params.status === 1 ||
    params.status === "0" || params.status === "1"
  ) {
    queryExtra.status = Number(params.status);
  }

  const query = compact({ ...queryBase, ...queryExtra });
  return apiClient.get("/education/colleges", { params: query });
};


export const getCollegesById = (id) => apiClient.get(`/education/colleges/${id}`);
export const getCollegesGrouped = (id) => apiClient.get(`/education/colleges/grouped/${id}`);
export const addEducationCollege = (data) => apiClient.post("/education/college", data);
export const updateEducationCollege = (id, data) => apiClient.patch(`/education/college/${id}`, data);

/* -------- Curriculum -------- */

export const getEducationPaginated = (page = 1, limit, filters = {}) => {
  const params = { page: toInt(page, 1) };
  if (Number.isFinite(limit)) params.limit = clamp(Number(limit), 1, 100);

  const f = filters ?? {};

  if (typeof f.sort === "string" && f.sort.trim()) params.sort = f.sort.trim();
  if (typeof f.order === "string") {
    const ord = f.order.toUpperCase();
    if (ord === "ASC" || ord === "DESC") params.order = ord;
  }

  const others = {
    search:
      typeof f.search === "string" && sanitizeSearch(f.search)
        ? sanitizeSearch(f.search)
        : undefined,
    type: f.type,
    college_active: f.college_active,
    curriculum_active: f.curriculum_active,
    degree_active: f.degree_active,
    college_name: f.college_name,
    meeting_resolution: typeof f.meeting_resolution === "boolean" ? f.meeting_resolution : undefined,
    curriculum_published: f.curriculum_published,
    start_year: f.start_year,
    end_year: f.end_year,
  };

  for (const [k, v] of Object.entries(others)) {
    if (v !== "" && v !== null && v !== undefined) params[k] = v;
  }

  return apiClient.get("/education/curriculums", { params });
};

export const getEducationById = (id) => apiClient.get(`/education/curriculums/${id}`);
export const getCurriculumsListAll = () => apiClient.get("/education/curriculumsListAll");
export const addEducation = (data) => apiClient.post("/education/curriculum", data);
export const updateEducation = (id, data) => apiClient.patch(`/education/curriculum/${id}`, data);
export const countCurriculum = () => apiClient.get("/education/countCurriculums");
export const checkCollegeNameExists = (name) =>
  apiClient.get(`/education/collegeExists/${encodeURIComponent(name)}`);

/** Full-text search endpoint */
export const searchEducation = (query, page = 1, limit = 10, filters = {}) => {
  const q = sanitizeSearch(query);
  const params = {
    q,
    page: toInt(page, 1),
    per_page: clamp(toInt(limit, 10), 1, 100),
    ...filters,
  };
  return apiClient.get("/education/search", { params });
};

export const getallYears = () => apiClient.get("/education/getstartYears/listBE");
export const provinceList = () => apiClient.get("/locations/provinces");
export const countryList = () => apiClient.get("/locations/countries");
export const getTypes = () => apiClient.get("/education/types");

export default apiClient;
