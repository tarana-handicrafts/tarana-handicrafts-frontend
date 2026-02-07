// API utility functions for making HTTP requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Custom fetch wrapper with timeout and error handling
 */
export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * GET request helper
 */
export async function get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return fetchApi<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request helper
 */
export async function post<T>(
  endpoint: string,
  data: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUT request helper
 */
export async function put<T>(
  endpoint: string,
  data: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchApi<T>(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request helper
 */
export async function del<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return fetchApi<T>(endpoint, { ...options, method: "DELETE" });
}
