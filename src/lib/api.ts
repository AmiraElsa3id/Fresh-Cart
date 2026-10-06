import axios, { AxiosError } from "axios";

export const API_V1 = "https://ecommerce.routemisr.com/api/v1";
export const API_V2 = "https://ecommerce.routemisr.com/api/v2";

const TOKEN_KEYS = ["token", "userToken"] as const;

function readToken(): string | null {
  // Read per request rather than once at module load: the token does not exist
  // yet when the app boots, and a captured value would go stale after login/logout.
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

const api = axios.create({
  baseURL: API_V1,
});

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.token = token;
  }
  return config;
});

/**
 * Pull a human-readable message out of an API failure.
 *
 * Axios errors are untyped by default, so every call site would otherwise need a
 * cast to reach `error.response.data.message`. Keeping the narrowing here means
 * server text is surfaced as plain text and never rendered as markup.
 */
export function apiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (axiosError.code === "ECONNABORTED") return "The request timed out. Please try again.";
    if (!axiosError.response) return "Could not reach the server. Check your connection.";
  }
  return fallback;
}

export default api;