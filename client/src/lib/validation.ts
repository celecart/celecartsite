import type { InsertBrandProduct } from "@shared/schema";

export type FieldErrors = Partial<Record<keyof InsertBrandProduct | "brandId" | "imageUrl", string>>;

export const isNonEmpty = (v?: string) => !!(v && v.trim().length > 0);
export const withinLength = (v: string, min: number, max: number) => v.length >= min && v.length <= max;
export const isUrl = (v?: string) => {
  if (!v) return true;
  try {
    const u = new URL(v);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
};
export const toPriceString = (v: unknown) => {
  if (v == null || v === "") return undefined;
  const s = String(v);
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return undefined;
  return n.toFixed(2);
};
export const isNumberInRange = (v: unknown, min: number, max: number) => {
  if (v == null || v === "") return true;
  const n = typeof v === "number" ? v : Number(v);
  if (isNaN(n)) return false;
  return n >= min && n <= max;
};
export const matches = (v: string, re: RegExp) => re.test(v);

export function validateBrandProductInput(
  raw: any,
  imageUrls: string[] | undefined,
  brandId?: number
): { errors: FieldErrors; normalized?: InsertBrandProduct } {
  const errors: FieldErrors = {};

  // brandId required
  if (!brandId) {
    errors.brandId = "Please select a brand before creating a product.";
  }

  // name
  const name = String(raw?.name || "").trim();
  if (!isNonEmpty(name)) {
    errors.name = "Name is required.";
  } else if (!withinLength(name, 2, 120)) {
    errors.name = "Name must be between 2 and 120 characters.";
  }

  // productCategory (optional but validate if present)
  const productCategory = String(raw?.productCategory || "").trim();
  if (productCategory && !withinLength(productCategory, 2, 80)) {
    errors.productCategory = "Product category must be 2–80 characters.";
  }

  // category (optional)
  const category = String(raw?.category || "").trim();
  if (category && !withinLength(category, 2, 80)) {
    errors.category = "Category must be 2–80 characters.";
  }

  // price (optional numeric)
  const price = raw?.price;
  const priceStr = toPriceString(price);
  if (price != null && price !== "" && priceStr == null) {
    errors.price = "Price must be a valid number.";
  }

  // website / purchaseLink
  const website = String(raw?.website || "").trim();
  const purchaseLink = String(raw?.purchaseLink || "").trim();
  if (website && !isUrl(website)) {
    errors.website = "Website must be a valid URL.";
  }
  if (purchaseLink && !isUrl(purchaseLink)) {
    errors.purchaseLink = "Purchase link must be a valid URL.";
  }

  // rating (optional, 0–5)
  const rating = raw?.rating;
  if (!isNumberInRange(rating, 0, 5)) {
    errors.rating = "Rating must be between 0 and 5.";
  }

  // imageUrl (optional, but if provided ensure strings and valid http(s)
  const imageUrl: string[] | undefined = Array.isArray(imageUrls)
    ? imageUrls.filter((u) => typeof u === "string" && u.trim().length > 0)
    : undefined;
  if (imageUrl && imageUrl.length > 0) {
    const invalid = imageUrl.find((u) => {
      const val = u.trim();
      // Accept root-relative paths served by the app (e.g., "/uploads/products/..")
      if (val.startsWith("/")) return false;
      try {
        const url = new URL(val);
        return !(url.protocol === "http:" || url.protocol === "https:");
      } catch {
        return true;
      }
    });
    if (invalid) {
      errors.imageUrl = "One or more image URLs are invalid.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const normalized: InsertBrandProduct = {
    brandId: brandId!,
    name,
    productCategory: productCategory || undefined,
    category: category || undefined,
    description: String(raw?.description || "").trim() || undefined,
    imageUrl,
    price: priceStr,
    website: website || undefined,
    purchaseLink: purchaseLink || undefined,
    rating: typeof rating === "number" ? rating : rating != null && rating !== "" ? Number(rating) : undefined,
    isActive: !!raw?.isActive,
    isFeatured: !!raw?.isFeatured,
    metadata: (raw?.metadata && typeof raw.metadata === "object") ? raw.metadata : {},
  } as InsertBrandProduct;

  return { errors: {}, normalized };
}