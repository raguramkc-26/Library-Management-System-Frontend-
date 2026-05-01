import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
console.log("BASE URL:",
import.meta.env.VITE_API_URL);
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("Interceptor token:", token); // DEBUG

  if (!token) {
    console.warn("No token found!");
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;    