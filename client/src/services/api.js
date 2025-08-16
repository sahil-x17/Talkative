import axios from "axios";

const API = axios.create({
  // Use env variable for backend URL
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

// Automatically add token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
