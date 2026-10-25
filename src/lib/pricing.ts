// Client-safe catalog types and price helpers (no fs access here).

export interface BulkTier {
  minQty: number;
  price: number;
}

export interface ProductSize {
  label: string;
  price: number;
  bulk?: BulkTier[];
}

export interface ProductImage {
  /** Public URL, e.g. /images/products/<slug>/1.jpg */
  src: string;
  alt: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  material?: string;
  featured: boolean;
  tags: string[];
  images: ProductImage[];
  shortDescription: string;
  description: string;
  sizes: ProductSize[];
  details: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  /** Reserved for the upcoming 360° viewer: folder of frames under the product's image dir. */
  view360?: { frames: number; folder: string };
}

/** Lightweight shape passed to listing pages (keeps page payloads small). */
export interface ProductSummary {
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  categoryPath: string[];
  material?: string;
  featured: boolean;
  image: ProductImage;
  shortDescription: string;
  fromPrice: number;
  bulkFromPrice?: number;
  sizeCount: number;
  /** Set when the product has exactly one size, so cards can add it to the cart directly. */
  onlySize?: ProductSize;
}

export interface Category {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  children: Category[];
}

/** Per-piece price for a size at a given quantity (applies the best bulk tier reached). */
export function unitPrice(size: Pick<ProductSize, "price" | "bulk">, qty: number): number {
  let price = size.price;
  for (const tier of size.bulk ?? []) {
    if (qty >= tier.minQty && tier.price < price) price = tier.price;
  }
  return price;
}

/** The next bulk tier the customer has not reached yet, if any. */
export function nextTier(size: Pick<ProductSize, "bulk">, qty: number): BulkTier | undefined {
  return [...(size.bulk ?? [])].sort((a, b) => a.minQty - b.minQty).find((t) => qty < t.minQty);
}
