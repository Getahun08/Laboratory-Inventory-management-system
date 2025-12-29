// lib/utils.ts
import axios from "axios";

// ✅ MUST match Spring Boot HTTPS
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ REQUIRED for CORS + Security
});

export default api;

// className helper (cn)
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
