/**
 * Public Store API Functions
 * - Server-side fetching with Next.js cache
 * - Revalidation strategies
 * - Error boundaries
 * - Type-safe responses
 */
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
  tags?: string[];
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
  // ─── B2B / Wholesale / Export ───
  moq?: number;
  priceTiers?: { minQty: number; unitPrice: number }[];
  wholesaleAvailable?: boolean;
  leadTimeDays?: number;
  isCustomizable?: boolean;
  customizationOptions?: string[];
  woodType?: string;
  careInstructions?: string;
  originCountry?: string;
  hsCode?: string;
  portOfLoading?: string;
  packaging?: {
    unitsPerCarton?: number;
    cartonCBM?: number;
    netWeight?: string;
    grossWeight?: string;
  };
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

// ─── Fetch with retry and timeout ───
async function fetchJSON<T>(
  url: string,
  options: { revalidate?: number; tags?: string[]; timeout?: number; cache?: RequestCache } = {}
): Promise<T> {
  const { revalidate = 60, tags, timeout = 10000, cache } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
      },
    };

    if (cache) {
      init.cache = cache;
    } else {
      init.next = { revalidate, tags };
    }

    const res = await fetch(url, init);

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Public API Functions ───

export async function getPublicProducts(params: PublicProductParams = {}): Promise<PaginatedProducts> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") searchParams.set(key, String(value));
  });
  return fetchJSON<PaginatedProducts>(
    `${API_URL}/api/products/public?${searchParams.toString()}`,
    { revalidate: 60, tags: ["products"] }
  );
}

export async function getProductById(id: string): Promise<{ product: Product }> {
  return fetchJSON<{ product: Product }>(
    `${API_URL}/api/products/${id}`,
    { revalidate: 300, tags: [`product-${id}`] }
  );
}

export async function getTopSellers(limit: number = 8): Promise<{ products: Product[] }> {
  return fetchJSON<{ products: Product[] }>(
    `${API_URL}/api/products/top-sellers?limit=${limit}`,
    { revalidate: 120, tags: ["top-sellers"] }
  );
}

export async function getFeaturedProducts(limit: number = 8): Promise<{ products: Product[] }> {
  return fetchJSON<{ products: Product[] }>(
    `${API_URL}/api/products/featured?limit=${limit}`,
    { revalidate: 120, tags: ["featured"] }
  );
}

export async function getProductFilters(): Promise<ProductFilters> {
  return fetchJSON<ProductFilters>(
    `${API_URL}/api/products/filters`,
    { revalidate: 300, tags: ["filters"] }
  );
}

export async function getUseCases(): Promise<{ useCases: UseCase[] }> {
  return fetchJSON<{ useCases: UseCase[] }>(
    `${API_URL}/api/use-cases/public`,
    { cache: "no-store" }
  );
}

export async function getCategoryTree(): Promise<{ categories: CategoryNode[] }> {
  return fetchJSON<{ categories: CategoryNode[] }>(
    `${API_URL}/api/categories/tree`,
    { revalidate: 300, tags: ["categories"] }
  );
}

// ─── RFQ / Bulk Quote Request ───
export interface RFQItem {
  productId?: string;
  productName: string;
  quantity: number;
}

export interface RFQPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  customerType?:
    | "retailer"
    | "wholesaler"
    | "importer"
    | "distributor"
    | "interior_designer"
    | "hotel"
    | "corporate_gifting"
    | "other";
  items?: RFQItem[];
  message?: string;
  targetPrice?: string;
  incoterm?: "EXW" | "FOB" | "CIF" | "DDP";
  destinationPort?: string;
  requiredBy?: string;
}

export interface RFQResponse {
  success: boolean;
  message?: string;
  quoteRef?: string;
  error?: string;
}

/**
 * Submit a bulk quote request (RFQ). Client-side POST.
 */
export async function submitRFQ(payload: RFQPayload): Promise<RFQResponse> {
  const res = await fetch(`${API_URL}/api/rfq`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  let data: RFQResponse = { success: false };
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse errors; fall back to status check
  }

  if (!res.ok) {
    return {
      success: false,
      error: data?.error || data?.message || "Unable to submit your request. Please try again.",
    };
  }

  return { ...data, success: true };
}

