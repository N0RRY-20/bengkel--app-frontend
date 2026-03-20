/**
 * API Utility untuk Token-Based Authentication (Laravel Sanctum API Tokens)
 *
 * File ini menyediakan helper functions untuk melakukan
 * HTTP requests ke backend Laravel dengan API token authentication.
 */

// Base URL untuk API - bisa diubah via environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Response type yang konsisten untuk semua API calls
 */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data: T;
  status: number;
}

/**
 * Mendapatkan token dari localStorage (client-side only)
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Wrapper utama untuk fetch dengan Bearer token authentication
 *
 * @param endpoint - API endpoint (contoh: "/api/users")
 * @param options - RequestInit options tambahan
 * @returns Promise<Response>
 */
export async function api(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  // Tambahkan Authorization header jika token tersedia
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Helper untuk GET request
 *
 * @param endpoint - API endpoint
 * @returns Promise dengan response data
 *
 * @example
 * const { ok, data, status } = await apiGet<User[]>("/api/users");
 */
export async function apiGet<T = unknown>(
  endpoint: string
): Promise<ApiResponse<T>> {
  const response = await api(endpoint, {
    method: "GET",
  });

  const json = await response.json();
  return { ok: response.ok, data: json, status: response.status };
}

/**
 * Helper untuk POST request
 *
 * @param endpoint - API endpoint
 * @param data - Data yang akan dikirim
 * @returns Promise dengan response data
 *
 * @example
 * const { ok, data } = await apiPost("/api/login", { email, password });
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const response = await api(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await response.json();
  return { ok: response.ok, data: json, status: response.status };
}

/**
 * Helper untuk PUT request
 *
 * @param endpoint - API endpoint
 * @param data - Data yang akan dikirim
 * @returns Promise dengan response data
 *
 * @example
 * const { ok, data } = await apiPut("/api/users/1", { name: "John" });
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const response = await api(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const json = await response.json();
  return { ok: response.ok, data: json, status: response.status };
}

/**
 * Helper untuk PATCH request
 *
 * @param endpoint - API endpoint
 * @param data - Data yang akan dikirim (partial update)
 * @returns Promise dengan response data
 *
 * @example
 * const { ok, data } = await apiPatch("/api/users/1", { email: "new@email.com" });
 */
export async function apiPatch<T = unknown>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const response = await api(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const json = await response.json();
  return { ok: response.ok, data: json, status: response.status };
}

/**
 * Helper untuk DELETE request
 *
 * @param endpoint - API endpoint
 * @returns Promise dengan response data
 *
 * @example
 * const { ok, status } = await apiDelete("/api/users/1");
 */
export async function apiDelete<T = unknown>(
  endpoint: string
): Promise<ApiResponse<T>> {
  const response = await api(endpoint, {
    method: "DELETE",
  });

  // Beberapa DELETE requests mungkin tidak mengembalikan body
  let json;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  return { ok: response.ok, data: json as T, status: response.status };
}

/**
 * Helper untuk menyimpan token dan user data setelah login
 *
 * @param token - Access token dari response login
 * @param user - User data object
 */
export function setAuthData(
  token: string,
  user: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Helper untuk menghapus auth data (logout)
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * Helper untuk mendapatkan user data dari localStorage
 *
 * @returns User object atau null
 */
export function getStoredUser<T = Record<string, unknown>>(): T | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as T;
  } catch {
    return null;
  }
}

/**
 * Helper untuk cek apakah user sudah login
 *
 * @returns boolean
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
