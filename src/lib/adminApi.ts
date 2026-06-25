const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      // Try refresh token before giving up
      if (data.code === "TOKEN_EXPIRED") {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          // Caller should retry - throw specific error
          throw new Error("TOKEN_REFRESHED");
        }
      }
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_refresh_token");
      localStorage.removeItem("admin_user");
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data as T;
}

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = typeof window !== "undefined"
    ? localStorage.getItem("admin_refresh_token")
    : null;
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_refresh_token", data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ─── Dashboard ───
export interface DashboardStats {
  overview: {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    archivedProducts: number;
    outOfStockCount: number;
    totalStock: number;
    totalInventoryValue: number;
    totalRevenue: number;
    estimatedProfit: number;
    avgPrice: number;
    maxPrice: number;
    minPrice: number;
  };
  categoryStats: { _id: string; count: number; avgPrice: number; totalValue: number }[];
  recentProducts: {
    _id: string;
    name: string;
    price: number;
    category: string;
    status: string;
    createdAt: string;
    image: string;
  }[];
  recentActivity: {
    _id: string;
    action: string;
    entity: string;
    details: string;
    userName: string;
    createdAt: string;
    user?: { name: string; email: string };
  }[];
  lowStockProducts: {
    _id: string;
    name: string;
    sku: string;
    stockCount: number;
    price: number;
    image: string;
    category: string;
  }[];
  topRatedProducts: {
    _id: string;
    name: string;
    rating: number;
    reviewCount: number;
    price: number;
    image: string;
    category: string;
  }[];
  tagStats: { _id: string; count: number }[];
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_URL}/api/admin/dashboard`, {
    headers: authHeaders(),
  });
  return handleResponse<DashboardStats>(res);
}

// ─── Products ───
export interface Product {
  _id: string;
  name: string;
  description?: string;
  longDescription?: string;
  category: string;
  material?: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stockCount: number;
  inStock: boolean;
  image?: string;
  images?: { url: string; alt: string }[];
  dimensions?: string;
  weight?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  tag?: string;
  specifications?: { label: string; value: string }[];
  features?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  material?: string;
  inStock?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
  tag?: string;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
    headers: authHeaders(),
  });
  return handleResponse<ProductsResponse>(res);
}

export async function fetchProductById(id: string): Promise<{ product: Product }> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse<{ product: Product }>(res);
}

export async function createProduct(data: Partial<Product>): Promise<{ product: Product; message: string }> {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ product: Product; message: string }>(res);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<{ product: Product; message: string }> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ product: Product; message: string }>(res);
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(res);
}

export async function bulkDeleteProducts(ids: string[]): Promise<{ message: string; deletedCount: number }> {
  const res = await fetch(`${API_URL}/api/products/bulk`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ ids }),
  });
  return handleResponse<{ message: string; deletedCount: number }>(res);
}

export async function fetchCategories(): Promise<{ categories: string[]; materials: string[] }> {
  const res = await fetch(`${API_URL}/api/products/categories`, {
    headers: authHeaders(),
  });
  return handleResponse<{ categories: string[]; materials: string[] }>(res);
}

// ─── Image Upload ───
export async function uploadProductImages(files: FileList | File[]): Promise<{
  images: { url: string; alt: string; filename: string }[];
  message: string;
}> {
  const token = getToken();
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/api/products/upload-images`, {
    method: "POST",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    body: formData,
  });
  return handleResponse(res);
}

// ─── Bulk Upload ───
export async function bulkUploadProducts(file: File): Promise<{
  message: string;
  results: { success: number; failed: number; skipped: number; errors: { row: number; error: string }[] };
}> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload/bulk`, {
    method: "POST",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    body: formData,
  });
  return handleResponse(res);
}

export function getTemplateDownloadUrl(): string {
  return `${API_URL}/api/upload/template`;
}

export function getExportUrl(): string {
  return `${API_URL}/api/products/export`;
}

// ─── Activity Logs ───
export interface ActivityLog {
  _id: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  userName: string;
  createdAt: string;
  user?: { name: string; email: string };
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function fetchActivityLogs(params: {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
} = {}): Promise<ActivityLogsResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") searchParams.set(key, String(value));
  });
  const res = await fetch(`${API_URL}/api/admin/activity?${searchParams.toString()}`, {
    headers: authHeaders(),
  });
  return handleResponse<ActivityLogsResponse>(res);
}

// ─── Categories ───
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: { _id: string; name: string; slug: string } | null;
  ancestors: { _id: string; name: string; slug: string }[];
  level: number;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchAllCategories(): Promise<{ categories: Category[] }> {
  const res = await fetch(`${API_URL}/api/categories`, {
    headers: authHeaders(),
  });
  return handleResponse<{ categories: Category[] }>(res);
}

export async function fetchCategoryById(id: string): Promise<{ category: Category }> {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse<{ category: Category }>(res);
}

export interface CategoryInput {
  name?: string;
  description?: string;
  image?: string;
  parent?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export async function createCategory(data: CategoryInput): Promise<{ category: Category; message: string }> {
  const res = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ category: Category; message: string }>(res);
}

export async function updateCategory(id: string, data: CategoryInput): Promise<{ category: Category; message: string }> {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ category: Category; message: string }>(res);
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(res);
}

// ─── Use Cases ───
export interface UseCaseAdmin {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  products: { _id: string; name: string; price: number; image?: string; category: string }[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchAllUseCases(): Promise<{ useCases: UseCaseAdmin[] }> {
  const res = await fetch(`${API_URL}/api/use-cases`, {
    headers: authHeaders(),
  });
  return handleResponse<{ useCases: UseCaseAdmin[] }>(res);
}

export async function fetchUseCaseById(id: string): Promise<{ useCase: UseCaseAdmin }> {
  const res = await fetch(`${API_URL}/api/use-cases/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse<{ useCase: UseCaseAdmin }>(res);
}

export async function createUseCase(data: { title: string; description?: string; image?: string; products?: string[]; sortOrder?: number; isActive?: boolean }): Promise<{ useCase: UseCaseAdmin; message: string }> {
  const res = await fetch(`${API_URL}/api/use-cases`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ useCase: UseCaseAdmin; message: string }>(res);
}

export async function updateUseCase(id: string, data: { title?: string; description?: string; image?: string; products?: string[]; sortOrder?: number; isActive?: boolean }): Promise<{ useCase: UseCaseAdmin; message: string }> {
  const res = await fetch(`${API_URL}/api/use-cases/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ useCase: UseCaseAdmin; message: string }>(res);
}

export async function deleteUseCase(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/use-cases/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(res);
}

// ─── RFQ / Quote Requests (CRM pipeline) ───
export type RFQStatus =
  | "new"
  | "quoted"
  | "negotiating"
  | "sample"
  | "won"
  | "lost"
  | "closed";

export interface RFQItem {
  productId?: { _id: string; name: string; image?: string; price?: number; moq?: number } | string | null;
  productName?: string;
  quantity: number;
}

export interface RFQ {
  _id: string;
  quoteRef: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  customerType: string;
  items: RFQItem[];
  message?: string;
  targetPrice?: string;
  incoterm?: string;
  destinationPort?: string;
  requiredBy?: string;
  status: RFQStatus;
  adminNotes?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RFQsResponse {
  rfqs: RFQ[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RFQFilters {
  page?: number;
  limit?: number;
  status?: string;
  customerType?: string;
}

export async function fetchRFQs(filters: RFQFilters = {}): Promise<RFQsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const res = await fetch(`${API_URL}/api/rfq?${params.toString()}`, {
    headers: authHeaders(),
  });
  return handleResponse<RFQsResponse>(res);
}

export async function fetchRFQById(id: string): Promise<{ rfq: RFQ }> {
  const res = await fetch(`${API_URL}/api/rfq/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse<{ rfq: RFQ }>(res);
}

export async function updateRFQ(
  id: string,
  data: { status: RFQStatus; adminNotes?: string }
): Promise<{ rfq: RFQ; message: string }> {
  const res = await fetch(`${API_URL}/api/rfq/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ rfq: RFQ; message: string }>(res);
}

export async function deleteRFQ(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/rfq/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(res);
}
