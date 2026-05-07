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
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/coming-soon", label: "Categories" },
    { href: "/coming-soon", label: "New Arrivals" },
    { href: "/coming-soon", label: "Bestsellers" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/coming-soon", label: "Careers" },
  ],
  support: [
    { href: "/coming-soon", label: "FAQ" },
    { href: "/coming-soon", label: "Shipping" },
    { href: "/coming-soon", label: "Returns" },
    { href: "/coming-soon", label: "Track Order" },
  ],
  legal: [
    { href: "/coming-soon", label: "Privacy Policy" },
    { href: "/coming-soon", label: "Terms of Service" },
    { href: "/coming-soon", label: "Cookie Policy" },
  ],
};
