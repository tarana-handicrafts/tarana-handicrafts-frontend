import productsJson from "@/data/products.json";

// Product type definition
export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductReview {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  avatar?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  material: string;
  image: string;
  images?: ProductImage[];
  tag?: string;
  description?: string;
  longDescription?: string;
  specifications?: ProductSpecification[];
  features?: string[];
  inStock?: boolean;
  stockCount?: number;
  sku?: string;
  weight?: string;
  dimensions?: string;
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
}

// Cart item extends Product with cartId
export interface CartItem extends Product {
  cartId: number;
}

// Products data loaded from JSON file
export const productsData: Product[] = productsJson.products as Product[];

// Helper function to get product by ID
export function getProductById(id: number): Product | undefined {
  return productsData.find((product) => product.id === id);
}

// Helper function to get similar products
export function getSimilarProducts(product: Product, limit: number = 4): Product[] {
  return productsData
    .filter((p) => p.id !== product.id && (p.category === product.category || p.material === product.material))
    .slice(0, limit);
}

// Helper function to get products by category
export function getProductsByCategory(category: string, limit?: number): Product[] {
  const products = productsData.filter((p) => p.category === category);
  return limit ? products.slice(0, limit) : products;
}
