
// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://tcc-admin-back.test/api',
//   withCredentials: true, 
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("auth_token");
//       localStorage.removeItem("auth_user");
//       localStorage.removeItem("type");

//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;


import axios from "axios";

// Base Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://tcc-admin-back.test/api",
  withCredentials: true, // 🔹 required for Sanctum
  headers: {
    Accept: "application/json",
  },
});

// Add Bearer token if using token-based auth
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("type");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;


export const getCsrfCookie = async () => {
  await axios.get("/sanctum/csrf-cookie");
};
