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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log("Auth failed -> clearing token");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;    