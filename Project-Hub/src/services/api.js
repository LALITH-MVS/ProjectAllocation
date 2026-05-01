import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:8080",
  baseURL: "https://projectallocation-production.up.railway.app",
});

// ✅ Attach JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle 401/403 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Auth error — token may be expired or missing.");
      // Optionally redirect: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;