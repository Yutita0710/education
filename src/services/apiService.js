// apiService.js
import axios from "axios";

const base =
  import.meta.env.MODE === "development"
    ? "/api"
    : "https://master-dev.tfac.or.th";

const apiClient = axios.create({
  baseURL: base, // Use proxy instead of direct URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Degrees
export const getDegrees = () => apiClient.get("/education/degrees");

// services/apiService.js
export const getCollegesPaginated = (
  page = null,
  limit = null,
  filters = {}
) => {
  const raw = {
    page,
    limit,
    search: filters.search ?? "",
    sort: filters.sort ?? "id",
    order: String(filters.order ?? "ASC").toUpperCase(),
    province: filters.province ?? "",
    country: filters.country ?? "",
    is_published: filters.is_published ?? "", // ว่าง = ไม่กรอง
    status: filters.status ?? "", // ว่าง = ไม่กรอง
  };

  // ตัดค่าว่าง/undefined/null ออกจาก params ที่จะส่งจริง
  const params = Object.fromEntries(
    Object.entries(raw).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null
    )
  );

  // แปลงชนิดเมื่อมีค่าจริง
  if (params.status !== undefined) params.status = Number(params.status);
  if (params.is_published !== undefined) {
    const s = String(params.is_published).toLowerCase();
    params.is_published = s === "1" || s === "true";
  }

  return apiClient.get("/education/colleges", { params });
};

export const getCollegesById = (id) =>
  apiClient.get(`/education/colleges/${id}`);

export const getCollegesGrouped = (id) =>
  apiClient.get(`/education/colleges/grouped/${id}`);

export const addEducationCollege = (data) =>
  apiClient.post("/education/college", data);

export const updateEducationCollege = (id, data) =>
  apiClient.patch(`/education/college/${id}`, data);

// ✅ Education Curriculum
/**
 * Get paginated education data with filters
 * @param {number} page - หน้าที่ต้องการ (เริ่มจาก 1)
 * @param {number|null} limit - จำนวนรายการต่อหน้า (null = ทั้งหมด)
 * @param {object} filters - ตัวกรองเพิ่มเติม
 */
// export const getEducationPaginated = (page = 1, limit = null, filters = {}) => {
//   const params = {
//     page,
//     limit,
//     search: filters.search ?? "",
//     sort: filters.sort ?? 0,
//     order: filters.order ?? "ASC",
//     type: filters.type ?? "",
//     college_active: filters.college_active ?? "",
//     curriculum_active: filters.curriculum_active ?? "",
//     degree_active: filters.degree_active ?? "",
//     college_name: filters.college_name ?? "",
//     meeting_resolution: filters.meeting_resolution ?? true,
//     curriculum_published: filters.curriculum_published ?? "",
//     start_year: filters.start_year ?? "",
//     end_year: filters.end_year ?? "",
//   };

//   return apiClient.get("/education/curriculums", { params });
// };

export const getEducationPaginated = (page = 1, limit, filters = {}) => {
  const params = { page };

  // แนบ limit เฉพาะเป็น number จริง
  if (typeof limit === "number" && Number.isFinite(limit)) {
    params.limit = limit;
  }

  const f = filters ?? {};

  // ---- ปรับตรงนี้: แนบ sort เฉพาะกรณีเป็น "numeric string" ----
  const isNumericString = (v) =>
    (typeof v === "string" && /^\d+$/.test(v)) ||
    (typeof v === "number" && Number.isFinite(v));

  if (isNumericString(f.sort)) {
    params.sort = String(f.sort); // "0", "1", ...
  }
  // แนบ order เฉพาะตอนมี sort (บาง backend บังคับคู่กัน)
  if (params.sort && typeof f.order === "string") {
    const ord = f.order.toUpperCase();
    if (ord === "ASC" || ord === "DESC") params.order = ord;
  }

  // ที่เหลือตามเดิม (แนบเฉพาะค่าที่ไม่ว่าง)
  const others = {
    search: f.search,
    type: f.type,
    college_active: f.college_active,
    curriculum_active: f.curriculum_active,
    degree_active: f.degree_active,
    college_name: f.college_name,
    meeting_resolution:
      typeof f.meeting_resolution === "boolean"
        ? f.meeting_resolution
        : undefined,
    curriculum_published: f.curriculum_published,
    start_year: f.start_year,
    end_year: f.end_year,
  };
  for (const [k, v] of Object.entries(others)) {
    if (v !== "" && v !== null && v !== undefined) params[k] = v;
  }

  return apiClient.get("/education/curriculums", { params });
};

export const getEducationById = (id) =>
  apiClient.get(`/education/curriculums/${id}`);

export const getCurriculumsListAll = () =>
  apiClient.get("/education/curriculumsListAll");

export const addEducation = (data) =>
  apiClient.post("/education/curriculum", data);

export const updateEducation = (id, data) =>
  apiClient.patch(`/education/curriculum/${id}`, data);

export const countCurriculum = () =>
  apiClient.get("/education/countCurriculums");

export const checkCollegeNameExists = (name) =>
  apiClient.get(`/education/collegeExists/${name}`);

/**
 * Search education data with pagination
 * @param {string} query - คำค้นหา
 * @param {number} page - หน้าที่ต้องการ
 * @param {number} limit - จำนวนรายการต่อหน้า
 * @param {object} filters - ตัวกรองเพิ่มเติม
 */
export const searchEducation = (query, page = 1, limit = 10, filters = {}) => {
  const params = {
    q: query,
    page,
    per_page: limit,
    ...filters,
  };
  return apiClient.get("/education/search", { params });
};

export const getallYears = () =>
  apiClient.get("/education/getstartYears/listBE");

export const provinceList = () => apiClient.get("/locations/provinces");

export const countryList = () => apiClient.get("/locations/countries");

export const getTypes = () => apiClient.get("/education/types");

// Export default API client for other uses
export default apiClient;
