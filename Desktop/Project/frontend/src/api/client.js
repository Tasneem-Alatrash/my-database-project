import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.detail || fallback;
}

export const classifyWasteImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/api/classify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createFactory = (payload) => apiClient.post("/api/factories", payload);
export const listFactories = () => apiClient.get("/api/factories");

export const createListing = (payload) => apiClient.post("/api/listings", payload);
export const listListings = (params) => apiClient.get("/api/listings", { params });
export const getListing = (id) => apiClient.get(`/api/listings/${id}`);
export const getListingMatches = (id) => apiClient.get(`/api/listings/${id}/matches`);

export const getDashboardStats = () => apiClient.get("/api/dashboard");
