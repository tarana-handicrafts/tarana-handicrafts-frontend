// Server-only catalog loader. Reads /content at build time, validates it and
// fails the build with a readable message when a JSON file or image is wrong.
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { Category, Product, ProductSummary } from "./pricing";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase-words-with-dashes");

const sizeSchema = z.object({
  label: z.string().min(1),
  price: z.number().positive(),
  bulk: z.array(z.object({ minQty: z.number().int().min(2), price: z.number().positive() })).optional(),
});

const productFileSchema = z.object({
  name: z.string().min(1),
  category: slug,
  material: z.string().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.object({ file: z.string().min(1), alt: z.string().optional() })).min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  sizes: z.array(sizeSchema).min(1),
  details: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  view360: z.object({ frames: z.number().int().positive(), folder: z.string() }).optional(),
});

interface CategoryFile {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  children?: CategoryFile[];
}

const categorySchema: z.ZodType<CategoryFile> = z.lazy(() =>
  z.object({
    slug,
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.string().optional(),
    children: z.array(categorySchema).optional(),
  })
);

const siteSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  whatsapp: z.string().regex(/^\d{10,15}$/, "digits only, with country code"),
  phone: z.string(),
  email: z.string().email(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  hours: z.string(),
  currency: z.string(),
  socials: z.record(z.string(), z.string()),
});

function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    throw new Error(`[content] Cannot read ${path.relative(process.cwd(), file)}: ${(err as Error).message}`);
  }
}

function parse<T>(schema: z.ZodType<T>, data: unknown, where: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    throw new Error(`[content] Invalid ${where}:\n${issues}`);
  }
  return result.data;
}

interface Catalog {
  categories: Category[];
  categoryIndex: Map<string, { category: Category; path: Category[] }>;
  products: Product[];
  productIndex: Map<string, Product>;
  useCases: UseCase[];
}

const useCaseSchema = z.object({
  slug,
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().startsWith("/"),
  products: z.array(slug).default([]),
});

type UseCase = z.infer<typeof useCaseSchema>;

function load(): Catalog {
  // site.json is imported directly elsewhere; validate it here so a typo fails the build.
  parse(siteSchema, readJson(path.join(CONTENT_DIR, "site.json")), "content/site.json");
  const rawCategories = parse(z.array(categorySchema), readJson(path.join(CONTENT_DIR, "categories.json")), "content/categories.json");

  const categoryIndex = new Map<string, { category: Category; path: Category[] }>();
  const build = (nodes: CategoryFile[], trail: Category[]): Category[] =>
    nodes.map((node) => {
      if (categoryIndex.has(node.slug)) throw new Error(`[content] Duplicate category slug "${node.slug}"`);
      const category: Category = { slug: node.slug, name: node.name, description: node.description, image: node.image, children: [] };
      categoryIndex.set(node.slug, { category, path: [...trail, category] });
      category.children = build(node.children ?? [], [...trail, category]);
      return category;
    });
  const categories = build(rawCategories, []);

  const productsDir = path.join(CONTENT_DIR, "products");
  const products: Product[] = fs
    .readdirSync(productsDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => {
      const productSlug = file.replace(/\.json$/, "");
      const where = `content/products/${file}`;
      parse(slug, productSlug, `${where} (file name)`);
      const data = parse(productFileSchema, readJson(path.join(productsDir, file)), where);

      if (!categoryIndex.has(data.category)) {
        throw new Error(`[content] ${where}: category "${data.category}" is not in content/categories.json`);
      }
      const images = data.images.map((img) => {
        const src = `/images/products/${productSlug}/${img.file}`;
        if (!fs.existsSync(path.join(PUBLIC_DIR, src))) {
          throw new Error(`[content] ${where}: image not found at public${src}`);
        }
        return { src, alt: img.alt ?? data.name };
      });

      return {
        slug: productSlug,
        name: data.name,
        category: data.category,
        material: data.material,
        featured: data.featured ?? false,
        tags: data.tags ?? [],
        images,
        shortDescription: data.shortDescription,
        description: data.description,
        sizes: data.sizes,
        details: data.details ?? [],
        faqs: data.faqs ?? [],
        view360: data.view360,
      };
    });

  const productIndex = new Map(products.map((p) => [p.slug, p]));

  const useCases = parse(z.array(useCaseSchema), readJson(path.join(CONTENT_DIR, "use-cases.json")), "content/use-cases.json");
  for (const uc of useCases) {
    if (!fs.existsSync(path.join(PUBLIC_DIR, uc.image))) {
      throw new Error(`[content] content/use-cases.json "${uc.slug}": image not found at public${uc.image}`);
    }
    const missing = uc.products.filter((s) => !productIndex.has(s));
    if (missing.length) {
      throw new Error(`[content] content/use-cases.json "${uc.slug}": unknown product(s) ${missing.join(", ")}`);
    }
  }

  return { categories, categoryIndex, products, productIndex, useCases };
}

let cache: Catalog | undefined;
function catalog(): Catalog {
  // Re-read on every call in dev so content edits show up without a restart.
  if (process.env.NODE_ENV === "development") return load();
  return (cache ??= load());
}

export function getAllProducts(): Product[] {
  return catalog().products;
}

export function getProduct(productSlug: string): Product | undefined {
  return catalog().productIndex.get(productSlug);
}

export function getUseCases(): UseCase[] {
  return catalog().useCases;
}

export function getCategoryTree(): Category[] {
  return catalog().categories;
}

export function getAllCategories(): Category[] {
  return [...catalog().categoryIndex.values()].map((c) => c.category);
}

export function getCategory(categorySlug: string): Category | undefined {
  return catalog().categoryIndex.get(categorySlug)?.category;
}

/** Root → category trail, for breadcrumbs. */
export function getCategoryPath(categorySlug: string): Category[] {
  return catalog().categoryIndex.get(categorySlug)?.path ?? [];
}

function descendantSlugs(category: Category): string[] {
  return [category.slug, ...category.children.flatMap(descendantSlugs)];
}

/** Products in a category or any of its sub-categories. */
export function getProductsInCategory(categorySlug: string): Product[] {
  const category = getCategory(categorySlug);
  if (!category) return [];
  const slugs = new Set(descendantSlugs(category));
  return getAllProducts().filter((p) => slugs.has(p.category));
}

export function getFeaturedProducts(limit = 8): Product[] {
  const all = getAllProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

/** Same leaf category first, then same top-level category. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const root = getCategoryPath(product.category)[0]?.slug;
  const others = getAllProducts().filter((p) => p.slug !== product.slug);
  const sameLeaf = others.filter((p) => p.category === product.category);
  const sameRoot = others.filter((p) => p.category !== product.category && getCategoryPath(p.category)[0]?.slug === root);
  return [...sameLeaf, ...sameRoot].slice(0, limit);
}

export function toSummary(product: Product): ProductSummary {
  const prices = product.sizes.map((s) => s.price);
  const bulkPrices = product.sizes.flatMap((s) => (s.bulk ?? []).map((t) => t.price));
  const trail = getCategoryPath(product.category);
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    categoryName: trail[trail.length - 1]?.name ?? product.category,
    categoryPath: trail.map((c) => c.slug),
    material: product.material,
    featured: product.featured,
    image: product.images[0],
    shortDescription: product.shortDescription,
    fromPrice: Math.min(...prices),
    bulkFromPrice: bulkPrices.length ? Math.min(...bulkPrices) : undefined,
    sizeCount: product.sizes.length,
    onlySize: product.sizes.length === 1 ? product.sizes[0] : undefined,
  };
}
