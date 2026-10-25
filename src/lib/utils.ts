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
    // Fallback for invalid
    return `₹${Math.max(0, safePrice).toLocaleString()}`;
  }
}
