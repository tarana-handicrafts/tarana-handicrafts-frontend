/**
 * Secure API Client with Automatic Token Refresh
 * - Handles token expiration transparently
 * - Prevents multiple concurrent refresh requests
 * - Secure token storage
 * - Request/response interceptors
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Token storage keys (only in memory + localStorage for persistence)
const TOKEN_KEY = "admin_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const USER_KEY = "admin_user";

// State for refresh token mutex
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// ─── Token Management ───
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setUser(user: object): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// ─── Refresh Token ───
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    setTokens(data.token, data.refreshToken);
    return data.token;
  } catch {
    clearTokens();
    return null;
  }
}

// ─── Secure Fetch with Auto-Refresh ───
export async function secureFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url.startsWith("http") ? url : `${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // If token expired, attempt refresh
  if (response.status === 401) {
    const data = await response.json().catch(() => ({}));

    if (data.code === "TOKEN_EXPIRED") {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          // Retry original request with new token
          const retryHeaders: HeadersInit = {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          };
          const retryResponse = await fetch(
            url.startsWith("http") ? url : `${API_URL}${url}`,
            { ...options, headers: retryHeaders, credentials: "include" }
          );
          if (!retryResponse.ok) {
            const retryData = await retryResponse.json().catch(() => ({}));
            throw new Error(retryData.error || `Request failed: ${retryResponse.status}`);
          }
          return retryResponse.json();
        } else {
          // Refresh failed - redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/admin/login";
          }
          throw new Error("Session expired. Please login again.");
        }
      } else {
        // Wait for the ongoing refresh
        return new Promise<T>((resolve, reject) => {
          addRefreshSubscriber(async (newToken) => {
            try {
              const retryHeaders: HeadersInit = {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              };
              const retryResponse = await fetch(
                url.startsWith("http") ? url : `${API_URL}${url}`,
                { ...options, headers: retryHeaders, credentials: "include" }
              );
              resolve(retryResponse.json());
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    }

    // Not a token expiry - handle normally
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error(data.error || "Authentication failed");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

// ─── Convenience Methods ───
export const apiClient = {
  get: <T>(url: string) => secureFetch<T>(url),

  post: <T>(url: string, body?: unknown) =>
    secureFetch<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(url: string, body?: unknown) =>
    secureFetch<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(url: string, body?: unknown) =>
    secureFetch<T>(url, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    }),

  upload: async <T>(url: string, formData: FormData): Promise<T> => {
    const token = getAccessToken();
    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Upload failed: ${response.status}`);
    }
    return response.json();
  },
};

