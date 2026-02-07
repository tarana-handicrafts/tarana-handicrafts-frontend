// API utility functions for making HTTP requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Maximum request timeout (10 seconds)
const DEFAULT_TIMEOUT = 10000;

// Allowed URL protocols
const ALLOWED_PROTOCOLS = ["http:", "https:"];

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Validates that a URL is safe to fetch
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol);
  } catch {
    // If it's a relative URL, it's fine
    return url.startsWith("/") || url.startsWith(API_BASE_URL);
  }
}

/**
 * Custom fetch wrapper with timeout and error handling
 */
export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  // Validate endpoint
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  if (!isValidUrl(fullUrl)) {
    throw new Error("Invalid URL");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), Math.min(timeout, 30000));

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...fetchOptions.headers,
      },
      // Security: Don't send credentials to unknown origins
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Validate content type before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("Invalid response type");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
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
