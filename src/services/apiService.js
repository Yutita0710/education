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

// ✅ Degrees
export const getDegrees = () => apiClient.get("/education/degrees");

export const getColleges = (params = {}) =>
  apiClient.get("/education/colleges", { params });

export const getCollegesById = (id) =>
  apiClient.get(`/education/colleges/${id}`);
export const addEducationCollege = (data) =>
  apiClient.post("/education/college", data);
export const updateEducationCollege = (id, data) =>
  apiClient.patch(`/education/college/${id}`, data);

// ✅ Education Curriculum
export const getEducationList = (params) =>
  apiClient.get("/education", { params });
export const getEducationById = (id) =>
  apiClient.get(`/education/curriculums/${id}`);
export const addEducation = (data) =>
  apiClient.post("/education/curriculum", data);
export const updateEducation = (id, data) =>
  apiClient.patch(`/education/curriculum/${id}`, data);
export const countCurriculum = () => 
  apiClient.get("/education/countCurriculums");
export const checkCollegeNameExists = (name) =>
  apiClient.get(`/education/collegeExists/${name}`);