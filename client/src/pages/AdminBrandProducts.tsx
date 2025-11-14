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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import type { InsertBrandProduct } from "@shared/schema";
import MultiImageUpload from "@/components/MultiImageUpload";
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
  const [marketingApi, setMarketingApi] = useState<{ endpoint: string; clientId: string; clientSecret: string }>({ endpoint: "", clientId: "", clientSecret: "" });
  const [openProduct, setOpenProduct] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const productForm = useForm<InsertBrandProduct>({
    defaultValues: {
      brandId: preselectedBrandId || 0,
      name: "",
      description: "",
      category: "",
      productCategory: "",
      imageUrl: [],
      price: 0,
      website: "",
      purchaseLink: "",
      rating: 0,
      isActive: true,
      isFeatured: false,
      metadata: {},
    },
  });

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

  useEffect(() => {
    if (typeof brandFilter !== 'number') return;
    try {
      const pfx = `marketingApi.${brandFilter}.`;
      const endpoint = localStorage.getItem(pfx + 'endpoint') || '';
      const clientId = localStorage.getItem(pfx + 'clientId') || '';
      const clientSecret = localStorage.getItem(pfx + 'clientSecret') || '';
      setMarketingApi({ endpoint, clientId, clientSecret });
    } catch {}
  }, [brandFilter]);

  const saveMarketingApi = () => {
    if (typeof brandFilter !== 'number') {
      toast({ title: 'Select brand', description: 'Please select a brand first.', variant: 'destructive' });
      return;
    }
    try {
      const pfx = `marketingApi.${brandFilter}.`;
      localStorage.setItem(pfx + 'endpoint', marketingApi.endpoint);
      localStorage.setItem(pfx + 'clientId', marketingApi.clientId);
      localStorage.setItem(pfx + 'clientSecret', marketingApi.clientSecret);
      toast({ title: 'Saved', description: 'Marketing API settings saved.' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save Marketing API settings.', variant: 'destructive' });
    }
  };

  const onSubmitProduct = productForm.handleSubmit(async (values) => {
    try {
      const body: InsertBrandProduct = {
        ...values,
        brandId: typeof brandFilter === 'number' ? brandFilter : values.brandId,
        imageUrl: productImages.length ? (productImages as any) : values.imageUrl,
      } as any;
      const res = await fetch('/api/brand-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        toast({ title: 'Failed', description: 'Could not create product.', variant: 'destructive' });
        return;
      }
      toast({ title: 'Created', description: 'Brand product created.' });
      setOpenProduct(false);
      setProductImages([]);
      productForm.reset();
      await refetch();
    } catch {
      toast({ title: 'Error', description: 'Network error creating product.', variant: 'destructive' });
    }
  });

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
    <SidebarProvider className="bg-background text-white">
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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-xl border-amber-500/20">
            <SidebarTrigger className="-ml-1" />
            {typeof brandFilter === 'number' && (
              <button
                className="flex items-center gap-3 hover:text-amber-400 transition-colors"
                onClick={() => setLocation(`/admin/brands/${brandFilter}/marketing-api`)}
                aria-label="Open Marketing API page"
              >
                <Avatar className="h-8 w-8">
                  {brandById.get(brandFilter)?.imageUrl 
                    ? <AvatarImage src={brandById.get(brandFilter)?.imageUrl as any} alt={brandById.get(brandFilter)?.name || 'Brand'} />
                    : <AvatarFallback>{(brandById.get(brandFilter)?.name || 'B')[0].toUpperCase()}</AvatarFallback>}
                </Avatar>
                <span className="text-sm font-semibold">
                  {brandById.get(brandFilter)?.name || `Brand #${brandFilter}`}
                </span>
              </button>
            )}
            <div className="ml-auto" />
          </header>
          <main className="p-4">
            <div className="grid gap-4">
              <Card className="bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Marketing API</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="marketing-endpoint">API endpoint</Label>
                      <Input id="marketing-endpoint" placeholder="https://api.example.com/marketing" value={marketingApi.endpoint} onChange={(e)=> setMarketingApi((p)=> ({...p, endpoint: e.target.value}))} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="marketing-client-id">Client ID</Label>
                      <Input id="marketing-client-id" placeholder="Enter client id" value={marketingApi.clientId} onChange={(e)=> setMarketingApi((p)=> ({...p, clientId: e.target.value}))} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="marketing-client-secret">Client Secret</Label>
                      <Input id="marketing-client-secret" type="password" placeholder="Enter client secret" value={marketingApi.clientSecret} onChange={(e)=> setMarketingApi((p)=> ({...p, clientSecret: e.target.value}))} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={saveMarketingApi} disabled={typeof brandFilter !== 'number'} className="bg-amber-500 hover:bg-amber-600 text-black">Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
              

              <Card className="bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Brand Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div />
                    <Dialog open={openProduct} onOpenChange={setOpenProduct}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">Add Product</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create Brand Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={onSubmitProduct} className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="bp-name">Name *</Label>
                              <Input id="bp-name" placeholder="e.g., Signature Jacket" {...productForm.register('name', { required: true, maxLength: 120 })} />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="bp-category">Category</Label>
                              <Input id="bp-category" placeholder="e.g., Apparel" {...productForm.register('category')} />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="bp-productCategory">Product Category</Label>
                              <Input id="bp-productCategory" placeholder="e.g., Jackets" {...productForm.register('productCategory')} />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="bp-price">Price</Label>
                              <Input id="bp-price" placeholder="e.g., 199.00" {...productForm.register('price')} />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <Label htmlFor="bp-description">Description</Label>
                              <Input id="bp-description" placeholder="Short description" {...productForm.register('description')} />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="bp-website">Website</Label>
                              <Input id="bp-website" placeholder="https://example.com" {...productForm.register('website')} />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="bp-purchaseLink">Purchase Link</Label>
                              <Input id="bp-purchaseLink" placeholder="https://store.example.com/buy" {...productForm.register('purchaseLink')} />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="bp-rating">Rating</Label>
                              <Input id="bp-rating" type="number" min={0} max={5} step={1} placeholder="0-5" {...productForm.register('rating', { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <Label>Images</Label>
                              <MultiImageUpload uploadUrl="/api/upload/product-images" onImagesChange={(urls)=> setProductImages(urls)} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={()=> setOpenProduct(false)}>Cancel</Button>
                            <Button type="submit">Create Product</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
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