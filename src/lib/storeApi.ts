// Public API functions for fetching store data from the backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  categoryId?: string;
  material?: string;
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
  rating?: number;
  reviewCount?: number;
  reviews?: { id: number; author: string; rating: number; date: string; title: string; content: string; verified: boolean; avatar?: string }[];
  isFeatured?: boolean;
  isTopSeller?: boolean;
  status?: string;
  createdAt?: string;
}

export interface CategoryNode {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | null;
  level: number;
  children: CategoryNode[];
}

export interface ProductFilters {
  categories: CategoryNode[];
  materials: string[];
  priceRange: { min: number; max: number };
  tags: string[];
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UseCase {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  products: Product[];
  sortOrder: number;
  isActive: boolean;
}

export interface PublicProductParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categoryId?: string;
  material?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
  tag?: string;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function getPublicProducts(params: PublicProductParams = {}): Promise<PaginatedProducts> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") searchParams.set(key, String(value));
  });
  return fetchJSON<PaginatedProducts>(`${API_URL}/api/products/public?${searchParams.toString()}`);
}

export async function getProductById(id: string): Promise<{ product: Product }> {
  return fetchJSON<{ product: Product }>(`${API_URL}/api/products/${id}`);
}

export async function getTopSellers(limit: number = 8): Promise<{ products: Product[] }> {
  return fetchJSON<{ products: Product[] }>(`${API_URL}/api/products/top-sellers?limit=${limit}`);
}

export async function getFeaturedProducts(limit: number = 8): Promise<{ products: Product[] }> {
  return fetchJSON<{ products: Product[] }>(`${API_URL}/api/products/featured?limit=${limit}`);
}

export async function getProductFilters(): Promise<ProductFilters> {
  return fetchJSON<ProductFilters>(`${API_URL}/api/products/filters`);
}

export async function getUseCases(): Promise<{ useCases: UseCase[] }> {
  return fetchJSON<{ useCases: UseCase[] }>(`${API_URL}/api/use-cases/public`);
}

export async function getCategoryTree(): Promise<{ categories: CategoryNode[] }> {
  return fetchJSON<{ categories: CategoryNode[] }>(`${API_URL}/api/categories/tree`);
}

