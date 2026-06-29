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
    email: "taranahandicrafts@gmail.com",
    phone: "+91 9509669135",
  },
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/use-cases", label: "Use Cases" },
    { href: "/rfq", label: "Wholesale / Bulk" },
    { href: "/sample-order", label: "Order Samples" },
    { href: "/rfq", label: "Request a Quote" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
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
