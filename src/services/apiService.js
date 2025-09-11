// apiService.js
import axios from "axios";
// ❌ ไม่ต้อง import router ถ้าใช้ window.location.replace

const base =
  import.meta.env.MODE === "development" ? "/api" : "https://master-dev.tfac.or.th";

const apiClient = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
});

// ---- Request: แนบ token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🟢 วางบล็อกนี้ต่อจาก request interceptor
let isHandlingAuthError = false;
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if ((status === 401 || status === 419) && !isHandlingAuthError) {
      isHandlingAuthError = true;
      try {
        // 1) เคลียร์ auth
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        // 2) แจ้งให้ App.vue อัปเดต reactive state (storage event ไม่ยิงในแท็บเดียว)
        window.dispatchEvent(new Event("auth-changed"));

        // 3) ✅ ใช้ fallback redirect ด้วย window.location.replace ตรงนี้
        const redirect = window.location.pathname + window.location.search;
        window.location.replace(
          `/admin/login?redirect=${encodeURIComponent(redirect)}`
        );
      } finally {
        // ป้องกันยิงซ้ำจากหลายคำขอพร้อมกัน
        setTimeout(() => (isHandlingAuthError = false), 500);
      }
    }

    return Promise.reject(error);
  }
);


// =============== APIs ===============
export const getDegrees = () => apiClient.get("/education/degrees");

export const getCollegesPaginated = (params = {}) => {
  const compact = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined && v !== null));

  const toInt = (v, d) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : d;
  };

  const queryBase = {
    page: toInt(params.page, 1),
    limit: toInt(params.limit, ""), // ต้องการแนบเสมอ
    sort: params.sort || "institute_group",
    order: (params.order || "ASC").toUpperCase(),
  };

  const queryExtra = {};
  if (typeof params.search === "string" && params.search.trim() !== "") {
    queryExtra.search = params.search.trim();
  }
  if (params.country) queryExtra.country = String(params.country);
  if (params.province) queryExtra.province = String(params.province);
  if (params.status === 0 || params.status === 1 || params.status === "0" || params.status === "1") {
    queryExtra.status = Number(params.status);
  }

  const query = compact({ ...queryBase, ...queryExtra });
  return apiClient.get("/education/colleges", { params: query });
};

export const getCollegesById = (id) => apiClient.get(`/education/colleges/${id}`);
export const getCollegesGrouped = (id) => apiClient.get(`/education/colleges/grouped/${id}`);
export const addEducationCollege = (data) => apiClient.post("/education/college", data);
export const updateEducationCollege = (id, data) => apiClient.patch(`/education/college/${id}`, data);

// ---- Curriculum
export const getEducationPaginated = (page = 1, limit, filters = {}) => {
  const params = { page };

  if (typeof limit === "number" && Number.isFinite(limit)) params.limit = limit;

  const f = filters ?? {};
  const isNumericString = (v) =>
    (typeof v === "string" && /^\d+$/.test(v)) || (typeof v === "number" && Number.isFinite(v));

  if (isNumericString(f.sort)) params.sort = String(f.sort);
  if (params.sort && typeof f.order === "string") {
    const ord = f.order.toUpperCase();
    if (ord === "ASC" || ord === "DESC") params.order = ord;
  }

  const others = {
    search: f.search,
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
export const checkCollegeNameExists = (name) => apiClient.get(`/education/collegeExists/${name}`);

export const searchEducation = (query, page = 1, limit = 10, filters = {}) => {
  const params = { q: query, page, per_page: limit, ...filters };
  return apiClient.get("/education/search", { params });
};

export const getallYears = () => apiClient.get("/education/getstartYears/listBE");
export const provinceList = () => apiClient.get("/locations/provinces");
export const countryList = () => apiClient.get("/locations/countries");
export const getTypes = () => apiClient.get("/education/types");

export default apiClient;
