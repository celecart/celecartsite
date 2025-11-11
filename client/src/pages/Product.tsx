import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FallbackImage } from "@/components/ui/fallback-image";
import { motion } from "framer-motion";
import { Star, ShoppingBag, ExternalLink } from "lucide-react";

type ProductType = "celebrity" | "brand";

interface BaseProduct {
  id: number;
  name: string;
  description?: string;
  category?: string;
  productCategory?: string;
  imageUrl?: string | string[] | null;
  price?: string | null;
  website?: string | null;
  purchaseLink?: string | null;
  rating?: number | null;
  isFeatured?: boolean | null;
}

function normalizeImage(src: string | string[] | null | undefined): string {
  if (!src) return "/assets/product-placeholder.jpg";
  try {
    if (typeof src === "string" && src.trim().startsWith("[")) {
      const arr = JSON.parse(src);
      if (Array.isArray(arr) && arr.length) return arr[0];
    }
  } catch {}
  if (Array.isArray(src)) return src[0] || "/assets/product-placeholder.jpg";
  return src || "/assets/product-placeholder.jpg";
}

function parsePrice(price?: string | null): string | null {
  if (!price) return null;
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : String(price);
}

async function fetchProduct(id: number, type: ProductType): Promise<BaseProduct> {
  const endpoint = type === "brand" ? `/api/brand-products/${id}` : `/api/celebrity-products/${id}`;
  const res = await fetch(endpoint, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export default function Product() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams("");
  const type = (search.get("type") as ProductType) || "celebrity";

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id, type],
    queryFn: () => fetchProduct(id, type),
    enabled: Number.isFinite(id),
  });

  useEffect(() => {
    document.title = product?.name ? `${product.name} • Product` : "Product";
  }, [product?.name]);

  return (
    <div className="min-h-screen bg-darkgray text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 bg-midgray" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-2xl bg-midgray" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48 bg-midgray" />
                <Skeleton className="h-4 w-80 bg-midgray" />
                <Skeleton className="h-4 w-72 bg-midgray" />
                <Skeleton className="h-10 w-40 bg-midgray" />
              </div>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-24">
            <p className="text-red-400">Failed to load product.</p>
          </div>
        )}

        {!isLoading && product && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
            <div className="flex items-center gap-3 mb-6">
              {product.isFeatured ? (
                <Badge className="bg-gold text-dark">FEATURED</Badge>
              ) : null}
              {product.rating ? (
                <div className="inline-flex items-center bg-dark/50 px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                  <span className="text-xs font-bold">{product.rating.toFixed(0)}</span>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-midgray border-dark overflow-hidden">
                <CardContent className="p-0">
                  <FallbackImage
                    src={normalizeImage(product.imageUrl as any)}
                    fallbackSrc="/assets/product-placeholder.jpg"
                    alt={product.name}
                    className="w-full h-80 object-cover"
                  />
                </CardContent>
              </Card>

              <div>
                <motion.h1 id="product-title" className="text-3xl font-semibold mb-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  {product.name}
                </motion.h1>
                {(product.productCategory || product.category) && (
                  <p className="text-light/70 mb-4">{product.productCategory || product.category}</p>
                )}
                {product.description && (
                  <p className="text-white/85 leading-relaxed mb-6">{product.description}</p>
                )}

                <div className="flex items-center gap-4 mb-6">
                  {parsePrice(product.price) && (
                    <span className="text-2xl font-bold">{parsePrice(product.price)}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {product.purchaseLink && (
                    <Button
                      aria-label="Open shop link in new tab"
                      className="bg-gold hover:bg-gold/90 text-dark"
                      onClick={() => window.open(String(product.purchaseLink), "_blank")}
                    >
                      <ShoppingBag className="mr-1 h-4 w-4" /> Shop Now
                    </Button>
                  )}
                  {product.website && (
                    <Button
                      variant="outline"
                      aria-label="Open product website in new tab"
                      className="border-gold text-gold hover:bg-gold/10"
                      onClick={() => window.open(String(product.website), "_blank")}
                    >
                      <ExternalLink className="mr-1 h-4 w-4" /> Website
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}