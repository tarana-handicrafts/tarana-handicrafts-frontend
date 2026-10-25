import type { EnquiryStatus, EnquiryType } from "@/lib/mongodb";

export const TYPE_LABELS: Record<EnquiryType, string> = {
  quote: "Quote request",
  contact: "Contact",
  whatsapp_order: "WhatsApp order",
};

export const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  quoted: "bg-amber-100 text-amber-700",
  negotiating: "bg-purple-100 text-purple-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
  closed: "bg-stone-200 text-stone-600",
};

export function formatDate(d: Date) {
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
}
