import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", // Use proxy instead of direct URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDegrees = () => apiClient.get("/education/degrees");
export const getColleges = () => apiClient.get("/education/colleges");
export const getEducationList = (params) => apiClient.get("/education", { params });
export const addEducation = (data) => apiClient.post("/education", data);
