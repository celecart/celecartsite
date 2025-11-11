import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ShieldCheck, ExternalLink } from "lucide-react";
import type { Brand, BrandProduct, Category } from "@shared/schema";

async function fetchBrands(): Promise<Brand[]> {
  const res = await fetch('/api/brands', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

async function fetchBrandProducts(brandId?: number): Promise<BrandProduct[]> {
  const url = brandId ? `/api/brand-products?brandId=${brandId}` : '/api/brand-products';
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch brand products');
  return res.json();
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export default function AdminBrandProducts() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/admin/brands/:id/products');
  const preselectedBrandId = match && params?.id ? Number(params.id) : undefined;
  const { toast } = useToast();

  const [brandFilter, setBrandFilter] = useState<number | undefined>(preselectedBrandId);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [onlyActive, setOnlyActive] = useState<boolean>(false);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  const { data: brands, isLoading: brandsLoading, error: brandsError } = useQuery({
    queryKey: ['brands-for-products'],
    queryFn: () => fetchBrands(),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => fetchCategories(),
  });

  const { data: products, isLoading: productsLoading, error: productsError, refetch } = useQuery({
    queryKey: ['brand-products'],
    queryFn: () => fetchBrandProducts(undefined),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (preselectedBrandId) setBrandFilter(preselectedBrandId);
  }, [preselectedBrandId]);

  const brandById = useMemo(() => {
    const m = new Map<number, Brand>();
    (brands || []).forEach((b) => m.set(b.id, b));
    return m;
  }, [brands]);

  const filtered = useMemo(() => {
    let arr = (products || []).slice();
    if (typeof brandFilter === 'number') {
      arr = arr.filter((p) => p.brandId === brandFilter);
    }
    if (categoryFilter) arr = arr.filter((p) => (p.category || '').toLowerCase().includes(categoryFilter.toLowerCase()) || (p.productCategory || '').toLowerCase().includes(categoryFilter.toLowerCase()));
    if (onlyActive) arr = arr.filter((p) => !!p.isActive);
    if (onlyFeatured) arr = arr.filter((p) => !!p.isFeatured);
    const parsePrice = (v: any) => {
      const n = parseFloat(String(v || '').replace(/[^0-9.]/g, ''));
      return isNaN(n) ? 0 : n;
    };
    if (sortBy === 'name-asc') arr.sort((a,b)=> (a.name||'').localeCompare(b.name||''));
    if (sortBy === 'name-desc') arr.sort((a,b)=> (b.name||'').localeCompare(a.name||''));
    if (sortBy === 'price-asc') arr.sort((a,b)=> parsePrice(a.price) - parsePrice(b.price));
    if (sortBy === 'price-desc') arr.sort((a,b)=> parsePrice(b.price) - parsePrice(a.price));
    if (sortBy === 'rating-desc') arr.sort((a,b)=> (b.rating||0) - (a.rating||0));
    if (sortBy === 'rating-asc') arr.sort((a,b)=> (a.rating||0) - (b.rating||0));
    return arr;
  }, [products, categoryFilter, onlyActive, onlyFeatured, sortBy, brandFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const grouped = useMemo(() => {
    const map = new Map<number, BrandProduct[]>();
    pageItems.forEach((p) => {
      const key = p.brandId;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return map;
  }, [pageItems]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-semibold">Admin Panel</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin')} tooltip="Dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin/brands')} tooltip="Brands">
                    <Badge>BR</Badge>
                    <span>Brands</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto" />
          </header>
          <main className="p-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Brand Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                    <div>
                      <Label>Brand</Label>
                      <Select value={brandFilter ? String(brandFilter) : 'all'} onValueChange={(v)=>{ const id = v === 'all' ? undefined : Number(v); setBrandFilter(id); setPage(1); }}>
                        <SelectTrigger>
                          <SelectValue placeholder={brandsLoading ? 'Loading…' : (brandFilter ? brandById.get(brandFilter)?.name || 'Select brand' : 'All brands')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All brands</SelectItem>
                          {(brands||[]).map((b)=> (
                            <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category filter</Label>
                      <Input value={categoryFilter} onChange={(e)=>{setCategoryFilter(e.target.value); setPage(1);}} placeholder="e.g., Clothing or Shirts" />
                    </div>
                    <div>
                      <Label>Sort</Label>
                      <Select value={sortBy} onValueChange={(v)=> setSortBy(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name-asc">Name ↑</SelectItem>
                          <SelectItem value="name-desc">Name ↓</SelectItem>
                          <SelectItem value="price-asc">Price ↑</SelectItem>
                          <SelectItem value="price-desc">Price ↓</SelectItem>
                          <SelectItem value="rating-desc">Rating ↓</SelectItem>
                          <SelectItem value="rating-asc">Rating ↑</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button variant={onlyActive ? 'default' : 'outline'} onClick={()=>{setOnlyActive(!onlyActive); setPage(1);}}>{onlyActive ? 'Active only' : 'All statuses'}</Button>
                      <Button variant={onlyFeatured ? 'default' : 'outline'} onClick={()=>{setOnlyFeatured(!onlyFeatured); setPage(1);}}>{onlyFeatured ? 'Featured only' : 'All items'}</Button>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button onClick={()=> refetch()} className="whitespace-nowrap">Refresh</Button>
                    </div>
                  </div>

                  {/* Loading / Error */}
                  {productsLoading && (
                    <div className="text-sm text-muted-foreground">Loading products…</div>
                  )}
                  {productsError && (
                    <div className="text-sm text-destructive">Error: {(productsError as any)?.message || 'Failed to load products'}</div>
                  )}

                  {/* Grouped display */}
                  {Array.from(grouped.entries()).map(([bid, items]) => {
                    const b = brandById.get(bid);
                    return (
                      <div key={bid} className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-8 w-8">
                            {b?.imageUrl ? <AvatarImage src={b.imageUrl} alt={b?.name||'Brand'} /> : <AvatarFallback>{(b?.name||'B')[0].toUpperCase()}</AvatarFallback>}
                          </Avatar>
                          <span className="font-semibold text-base">{b?.name || `Brand #${bid}`}</span>
                          {b?.websiteUrl && (
                            <a href={b.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:underline">
                              Visit <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {items.map((p) => (
                            <Card key={p.id}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center justify-between">
                                  <span>{p.name}</span>
                                  {p.isFeatured && <Badge>Featured</Badge>}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {Array.isArray(p.imageUrl) ? (
                                  <div className="flex gap-2 mb-2">
                                    {(p.imageUrl as any[]).slice(0,3).map((u,idx)=> (
                                      <img key={idx} src={u as any} alt="Product" className="h-20 w-20 object-cover rounded" />
                                    ))}
                                  </div>
                                ) : (
                                  p.imageUrl ? <img src={p.imageUrl as any} alt="Product" className="mb-2 h-32 w-full object-cover rounded" /> : null
                                )}
                                <div className="text-sm text-muted-foreground">{p.productCategory || p.category || '—'}</div>
                                <div className="mt-1 flex items-center justify-between">
                                  <span className="text-sm">Price: {p.price || '—'}</span>
                                  <span className="text-sm">Rating: {typeof p.rating === 'number' ? p.rating : '—'}</span>
                                </div>
                                <div className="mt-2 flex gap-2">
                                  {p.website && <a href={p.website} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">Website</a>}
                                  {p.purchaseLink && <a href={p.purchaseLink} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">Buy</a>}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {!productsLoading && !productsError && filtered.length === 0 && (
                    <div className="text-sm text-muted-foreground">No products found. Try clearing filters or add products.</div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" disabled={page<=1} onClick={()=> setPage((p)=> Math.max(1, p-1))}>Prev</Button>
                        <Button variant="outline" disabled={page>=totalPages} onClick={()=> setPage((p)=> Math.min(totalPages, p+1))}>Next</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}