import fs from "fs/promises";
import path from "path";

import productsJson from "@/data/products.json";
import type { Product, ProductSpecification, ProductImage } from "@/lib/products";

type DynamicProductPayload = Omit<Product, "id"> & { id?: number };

const STATIC_PRODUCTS: Product[] = (productsJson as unknown as { products: Product[] }).products;

// Persistent store for admin-created products (dev-friendly filesystem approach).
const DYNAMIC_PRODUCTS_FILE = path.join(process.cwd(), "data", "dynamic-products.json");

function ensureProductShape(p: DynamicProductPayload): Product {
  return {
    id: p.id ?? 0,
    name: String(p.name),
    price: Number(p.price),
    originalPrice: p.originalPrice != null ? Number(p.originalPrice) : undefined,
    category: String(p.category),
    material: String(p.material),
    image: String(p.image),
    images: Array.isArray(p.images)
      ? (p.images as ProductImage[]).map((img) => ({ url: String(img.url), alt: String(img.alt) }))
      : undefined,
    tag: p.tag != null ? String(p.tag) : undefined,
    description: p.description != null ? String(p.description) : undefined,
    longDescription: p.longDescription != null ? String(p.longDescription) : undefined,
    specifications: Array.isArray(p.specifications)
      ? (p.specifications as ProductSpecification[]).map((s) => ({
          label: String(s.label),
          value: String(s.value),
        }))
      : undefined,
    features: Array.isArray(p.features) ? (p.features as string[]).map((f) => String(f)) : undefined,
    inStock: p.inStock != null ? Boolean(p.inStock) : undefined,
    stockCount: p.stockCount != null ? Number(p.stockCount) : undefined,
    sku: p.sku != null ? String(p.sku) : undefined,
    weight: p.weight != null ? String(p.weight) : undefined,
    dimensions: p.dimensions != null ? String(p.dimensions) : undefined,
    reviews: p.reviews as Product["reviews"],
    rating: p.rating != null ? Number(p.rating) : undefined,
    reviewCount: p.reviewCount != null ? Number(p.reviewCount) : undefined,
  };
}

async function readDynamicProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(DYNAMIC_PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    // Best-effort shape validation.
    return parsed
      .filter((item): item is DynamicProductPayload => typeof item === "object" && item !== null)
      .map((item) => ensureProductShape(item))
      .filter((p) => Number.isFinite(p.id) && p.id > 0);
  } catch (err) {
    // If file does not exist, it's fine (no dynamic products yet).
    return [];
  }
}

async function writeDynamicProducts(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(DYNAMIC_PRODUCTS_FILE), { recursive: true });
  await fs.writeFile(DYNAMIC_PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function getAllProducts(): Promise<Product[]> {
  const dynamicProducts = await readDynamicProducts();
  const all = [...STATIC_PRODUCTS, ...dynamicProducts];

  // Ensure uniqueness by id (prefer dynamic if collision).
  const byId = new Map<number, Product>();
  for (const p of all) byId.set(p.id, p);
  return Array.from(byId.values()).sort((a, b) => a.id - b.id);
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.id === id);
}

export async function getSimilarProducts(product: Product, limit: number = 4): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.material === product.material))
    .slice(0, limit);
}

export async function getNextProductId(): Promise<number> {
  const dynamicProducts = await readDynamicProducts();
  const staticMaxId = STATIC_PRODUCTS.reduce((max, p) => Math.max(max, p.id), 0);
  const dynamicMaxId = dynamicProducts.reduce((max, p) => Math.max(max, p.id), 0);
  return Math.max(staticMaxId, dynamicMaxId) + 1;
}

export async function addDynamicProduct(
  payload: Omit<Product, "id"> & { id?: number }
): Promise<Product> {
  const dynamicProducts = await readDynamicProducts();
  const staticMaxId = STATIC_PRODUCTS.reduce((max, p) => Math.max(max, p.id), 0);
  const dynamicMaxId = dynamicProducts.reduce((max, p) => Math.max(max, p.id), 0);
  const nextId = payload.id ?? Math.max(staticMaxId, dynamicMaxId) + 1;

  const newProduct = ensureProductShape({ ...payload, id: nextId });

  const nextDynamicProducts = [...dynamicProducts, newProduct];
  await writeDynamicProducts(nextDynamicProducts);

  return newProduct;
}

