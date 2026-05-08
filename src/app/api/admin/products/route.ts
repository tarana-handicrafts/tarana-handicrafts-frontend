import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { Product } from "@/lib/products";
import { addDynamicProduct, getNextProductId } from "@/lib/productsStore";

const ADMIN_SESSION_VALUE = "authenticated";

function decodeDataUrl(dataUrl: string): { mime: string; buffer: Buffer } {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL");
  }
  const mime = match[1];
  const base64 = match[2];
  return { mime, buffer: Buffer.from(base64, "base64") };
}

function mimeToExt(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (session !== ADMIN_SESSION_VALUE) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      name: string;
      price: number | string;
      originalPrice?: number | string;
      category: string;
      material: string;
      description?: string;
      longDescription?: string;
      tag?: string;
      inStock?: boolean;
      stockCount?: number | string;
      sku?: string;
      weight?: string;
      dimensions?: string;
      rating?: number | string;
      reviewCount?: number | string;
      features?: string[];
      specifications?: Array<{ label: string; value: string }>;
      // Client-side base64 data URLs to avoid multipart parsing dependencies.
      images: string[]; // data URLs
    };

    const required = ["name", "price", "category", "material", "images"] as const;
    for (const key of required) {
      if ((body as Record<string, unknown>)[key] == null) {
        return NextResponse.json({ ok: false, error: `Missing ${key}` }, { status: 400 });
      }
    }

    if (!Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json({ ok: false, error: "At least one image is required" }, { status: 400 });
    }

    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ ok: false, error: "Invalid price" }, { status: 400 });
    }

    const imagesDataUrls = body.images.slice(0, 8); // hard limit for payload size

    const productId = await getNextProductId();
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products", String(productId));
    await fs.mkdir(uploadDir, { recursive: true });

    const savedImageUrls: Array<{ url: string; alt: string }> = [];
    for (let i = 0; i < imagesDataUrls.length; i++) {
      const dataUrl = imagesDataUrls[i];
      const { mime, buffer } = decodeDataUrl(dataUrl);
      const ext = mimeToExt(mime);
      const filename = `image-${i + 1}.${ext}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      const url = `/uploads/products/${productId}/${filename}`;
      savedImageUrls.push({ url, alt: `${body.name} - Image ${i + 1}` });
    }

    const newProductPayload: Omit<Product, "id"> & { id: number } = {
      id: productId,
      name: body.name,
      price,
      originalPrice: body.originalPrice != null ? Number(body.originalPrice) : undefined,
      category: body.category,
      material: body.material,
      image: savedImageUrls[0]?.url,
      images: savedImageUrls,
      description: body.description,
      longDescription: body.longDescription,
      tag: body.tag,
      inStock: body.inStock ?? true,
      stockCount: body.stockCount != null ? Number(body.stockCount) : undefined,
      sku: body.sku,
      weight: body.weight,
      dimensions: body.dimensions,
      features: body.features,
      specifications: body.specifications,
      rating: body.rating != null ? Number(body.rating) : undefined,
      reviewCount: body.reviewCount != null ? Number(body.reviewCount) : undefined,
      reviews: undefined,
    };

    const product = await addDynamicProduct(newProductPayload);

    return NextResponse.json({ ok: true, product });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to create product" },
      { status: 500 }
    );
  }
}

