import axios from "axios";
import.meta.env.VITE_API_URL
import.meta.env.VITE_SOCKET_URL

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
