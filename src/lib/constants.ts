// Site configuration constants

export const siteConfig = {
  name: "Tarana Handicrafts",
  description:
    "Discover exquisite handcrafted art, home decor, and traditional handicrafts.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://taranahandicrafts.com",
  ogImage: "/og-image.jpg",
  links: {
    facebook: "https://facebook.com/taranahandicrafts",
    instagram: "https://instagram.com/taranahandicrafts",
    twitter: "https://twitter.com/taranahandicrafts",
  },
  contact: {
    email: "info@taranahandicrafts.com",
    phone: "+91 XXXXXXXXXX",
  },
};

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
    { href: "/categories", label: "Categories" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/bestsellers", label: "Bestsellers" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping" },
    { href: "/returns", label: "Returns" },
    { href: "/track-order", label: "Track Order" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};
