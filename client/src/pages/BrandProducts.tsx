import { useMemo, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brand, BrandProduct } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
// removed Link; cards open external shop URLs on click
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Star, ShoppingBag, ChevronLeft, ChevronRight, Home as HomeIcon, Tag } from "lucide-react";

function parsePriceToNumber(price?: string | null): number | null {
  if (!price) return null;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function primaryImage(src: string | string[] | null | undefined): string {
  if (!src) return "";
  if (Array.isArray(src)) return src[0] || "";
  try {
    if (src.trim().startsWith("[")) {
      const arr = JSON.parse(src);
      if (Array.isArray(arr)) return arr[0] || "";
    }
  } catch {}
  return src;
}

async function fetchBrand(id: number): Promise<Brand> {
  const res = await fetch(`/api/brands/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch brand");
  return res.json();
}

async function fetchBrandProducts(brandId: number): Promise<BrandProduct[]> {
  const res = await fetch(`/api/brand-products?brandId=${brandId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch brand products");
  return res.json();
}

export default function BrandProducts() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const brandId = parseInt(params.id || "0");

  const { data: brand, isLoading: brandLoading, error: brandError } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => fetchBrand(brandId),
    enabled: Number.isFinite(brandId) && brandId > 0,
  });

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["brand-products", brandId],
    queryFn: () => fetchBrandProducts(brandId),
    enabled: Number.isFinite(brandId) && brandId > 0,
  });

  const [sort, setSort] = useState<string>("popular");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach(p => {
      const c = (p.productCategory || p.category || "").trim();
      if (c) set.add(c);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filtered = useMemo(() => {
    let list = (products || []).filter(p => p.isActive !== false);
    if (category !== "all") {
      list = list.filter(p => (p.productCategory || p.category || "") === category);
    }
    // Sort
    const byFeaturedFirst = (a: BrandProduct, b: BrandProduct) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    if (sort === "price_low") {
      return list
        .slice()
        .sort((a, b) => {
          const pa = parsePriceToNumber(a.price) ?? Number.POSITIVE_INFINITY;
          const pb = parsePriceToNumber(b.price) ?? Number.POSITIVE_INFINITY;
          if (pa === pb) return byFeaturedFirst(a, b);
          return pa - pb;
        });
    }
    if (sort === "price_high") {
      return list
        .slice()
        .sort((a, b) => {
          const pa = parsePriceToNumber(a.price) ?? Number.NEGATIVE_INFINITY;
          const pb = parsePriceToNumber(b.price) ?? Number.NEGATIVE_INFINITY;
          if (pa === pb) return byFeaturedFirst(a, b);
          return pb - pa;
        });
    }
    if (sort === "rating") {
      return list
        .slice()
        .sort((a, b) => {
          const ra = a.rating ?? 0;
          const rb = b.rating ?? 0;
          if (ra === rb) return byFeaturedFirst(a, b);
          return rb - ra;
        });
    }
    // popular: featured first, then rating
    return list
      .slice()
      .sort((a, b) => {
        const f = byFeaturedFirst(a, b);
        if (f !== 0) return f;
        const ra = a.rating ?? 0;
        const rb = b.rating ?? 0;
        return rb - ra;
      });
  }, [products, sort, category]);

  const totalPages = Math.max(1, Math.ceil((filtered || []).length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // Reset page when filters change
  const safeSetPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  const loading = brandLoading || productsLoading;

  return (
    <div className="bg-darkgray min-h-screen">
      <Header />

      {/* Hero Header with brand logo/name and breadcrumb */}
      <section className="pt-32 md:pt-40 pb-8 bg-gradient-to-b from-darkgray to-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-light/70 mb-4 flex items-center gap-2">
            <a href="/" className="hover:text-gold flex items-center gap-1"><HomeIcon className="w-4 h-4" /> Home</a>
            <span className="text-light/50">›</span>
            <a href="/brands" className="hover:text-gold flex items-center gap-1"><Tag className="w-4 h-4" /> Brands</a>
            <span className="text-light/50">›</span>
            <span className="text-gold font-medium">{brand?.name ?? "Brand"}</span>
          </nav>

          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black/20">
              {brand && (
                <img src={brand.imageUrl} alt={`${brand.name} logo`} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-playfair text-light">{brand?.name ?? "Brand Collection"}</h1>
              {brand?.description && (
                <p className="mt-1 text-light/70 max-w-2xl">{brand.description}</p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gold font-bold uppercase tracking-wider">Category</span>
              <Select value={category} onValueChange={(v) => { setCategory(v); safeSetPage(1); }}>
                <SelectTrigger className="w-44 bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {availableCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gold font-bold uppercase tracking-wider">Sort</span>
              <Select value={sort} onValueChange={(v) => { setSort(v); safeSetPage(1); }}>
                <SelectTrigger className="w-44 bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                  <SelectValue placeholder="Popular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 bg-darkgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[300px] rounded-2xl bg-midgray" />
              ))}
            </div>
          )}

          {!loading && (productsError || brandError) && (
            <div className="text-center text-red-500 py-12">Failed to load brand products.</div>
          )}

          {!loading && !productsError && (pageItems.length === 0) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-midgray mx-auto mb-4 flex items-center justify-center">
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-light mb-2">No brand product found</h3>
              <p className="text-light/70">This brand currently has no listed products.</p>
            </div>
          )}

          {!loading && pageItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((product) => {
                const img = primaryImage(product.imageUrl as any);
                const priceNum = parsePriceToNumber(product.price);
                const shopUrl = product.purchaseLink || product.website || "";
                return (
                  <Card
                    key={product.id}
                    className="bg-midgray border-dark overflow-hidden group h-full flex flex-col cursor-pointer"
                    onClick={() => {
                      if (shopUrl) {
                        window.open(shopUrl, '_blank');
                      } else {
                        setLocation(`/product/${product.id}?type=brand`);
                      }
                    }}
                    role="link"
                    aria-label={`Open ${product.name} shop link in new tab`}
                  >
                    <div className="relative overflow-hidden bg-gradient-to-b from-transparent to-black/20">
                      <FallbackImage
                        src={img || "/assets/product-placeholder.jpg"}
                        fallbackSrc="/assets/product-placeholder.jpg"
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                      />
                      {/* Featured badge */}
                      {product.isFeatured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gold text-dark">FEATURED</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="py-5 flex-grow flex flex-col">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-xs uppercase tracking-wider text-gold font-bold">{brand?.name}</span>
                        {typeof product.rating === "number" && (
                          <div className="flex items-center bg-dark/40 px-2 py-1 rounded">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                            <span className="text-xs font-bold text-white">{product.rating.toFixed(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        {(product.productCategory || product.category) && (
                          <p className="text-xs text-light/60">{product.productCategory || product.category}</p>
                        )}
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-white font-bold">
                          {priceNum !== null ? `$${priceNum.toFixed(2)}` : (product.price || "")}
                        </div>
                        {shopUrl && (
                          <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center" onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" className="bg-gold hover:bg-gold/90 text-dark">
                              <ShoppingBag className="mr-1 h-4 w-4" />
                              Shop
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10" onClick={() => safeSetPage(page - 1)} disabled={page <= 1}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="text-light/70">Page {page} of {totalPages}</span>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10" onClick={() => safeSetPage(page + 1)} disabled={page >= totalPages}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}