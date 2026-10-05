import axios from "axios";

export const API_V1 = "https://ecommerce.routemisr.com/api/v1";
export const API_V2 = "https://ecommerce.routemisr.com/api/v2";

const api = axios.create({
  baseURL: API_V1,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("userToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.token = token;
  }
  return config;
});

export default api;