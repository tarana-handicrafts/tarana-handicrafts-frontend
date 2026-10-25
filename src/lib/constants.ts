// Site configuration constants (source of truth: content/site.json)
import site from "@content/site.json";

export const siteConfig = {
  name: site.name,
  description: site.description,
  url: process.env.NEXT_PUBLIC_SITE_URL || site.url,
  ogImage: "/og-image.jpg",
  whatsapp: site.whatsapp,
  links: site.socials as Record<string, string>,
  contact: {
    email: site.email,
    phone: site.phone,
  },
  address: site.address,
  hours: site.hours,
};

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/use-cases", label: "Use Cases" },
    { href: "/rfq", label: "Wholesale / Bulk" },
    { href: "/rfq", label: "Request a Quote" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping & Delivery" },
    { href: "/returns", label: "Returns & Refunds" },
    { href: "/contact", label: "Track Order" },
    { href: "/wishlist", label: "Wishlist" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy-policy", label: "Cookie Policy" },
  ],
};
