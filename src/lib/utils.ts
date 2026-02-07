import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price for display with validation
 */
export function formatPrice(
  price: number,
  currency: string = "INR",
  locale: string = "en-IN"
): string {
  // Validate price is a finite number
  const safePrice = typeof price === "number" && isFinite(price) ? price : 0;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Math.max(0, safePrice));
  } catch {
    // Fallback for invalid locale/currency
    return `₹${Math.max(0, safePrice).toLocaleString()}`;
  }
}

/**
 * Truncate text with ellipsis (with validation)
 */
export function truncateText(text: string, maxLength: number): string {
  if (typeof text !== "string") return "";
  if (typeof maxLength !== "number" || maxLength < 0) return text;
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate slug from text (sanitized)
 */
export function slugify(text: string): string {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()
    .slice(0, 200); // Limit length
}

/**
 * Sanitize string to prevent XSS - escapes HTML entities
 */
export function escapeHtml(text: string): string {
  if (typeof text !== "string") return "";
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number format (Indian)
 */
export function isValidPhone(phone: string): boolean {
  if (typeof phone !== "string") return false;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Sanitize URL to prevent javascript: protocol attacks
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== "string") return "";
  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return "";
  }

  return url;
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), Math.max(0, wait));
  };
}
