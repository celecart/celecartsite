import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { LayoutDashboard, Users, ShieldCheck, Tags, Settings, Moon, Sun, CreditCard, Star, FileText, Package, Plus, Edit, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CelebrityProduct, Celebrity, Category } from "@shared/schema";

export default function AdminProducts() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark((d) => !d);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<CelebrityProduct[]>([]);
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CelebrityProduct | null>(null);

  const [form, setForm] = useState<any>({
    celebrityId: undefined as number | undefined,
    name: "",
    description: "",
    category: "",
    price: "",
    location: "",
    website: "",
    purchaseLink: "",
    rating: 0,
    isActive: true,
    isFeatured: false,
    imageUrls: [] as string[],
  });

  const loadUser = async () => {
    try {
      const res = await fetch('/auth/user', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
  };

  const fetchCelebrities = async () => {
    const res = await fetch('/api/celebrities');
    if (res.ok) setCelebrities(await res.json());
  };
  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    if (res.ok) setCategories(await res.json());
  };
  const fetchProducts = async () => {
    const res = await fetch('/api/celebrity-products', { credentials: 'include' });
    if (res.ok) setProducts(await res.json());
  };

  useEffect(() => {
    (async () => {
      await Promise.all([loadUser(), fetchCelebrities(), fetchCategories(), fetchProducts()]);
      setLoading(false);
    })();
  }, []);

  const resetForm = () => {
    setForm({
      celebrityId: undefined,
      name: "",
      description: "",
      category: categories[0]?.name || "",
      price: "",
      location: "",
      website: "",
      purchaseLink: "",
      rating: 0,
      isActive: true,
      isFeatured: false,
      imageUrls: [],
    });
  };

  const openCreate = () => { setEditing(null); resetForm(); setOpen(true); };
  const openEdit = async (p: CelebrityProduct) => {
    try {
      const res = await fetch(`/api/celebrity-products/${p.id}`);
      if (!res.ok) throw new Error('Failed to load product');
      const full = await res.json();
      setEditing(full);
      setForm({
        celebrityId: full.celebrityId,
        name: full.name || "",
        description: full.description || "",
        category: full.category || "",
        price: full.price || "",
        location: full.location || "",
        website: full.website || "",
        purchaseLink: full.purchaseLink || "",
        rating: full.rating || 0,
        isActive: !!full.isActive,
        isFeatured: !!full.isFeatured,
        imageUrls: Array.isArray(full.imageUrl) ? full.imageUrl : (full.imageUrl ? [full.imageUrl] : []),
      });
      setOpen(true);
    } catch (e) {
      toast({ title: "Error", description: "Unable to load product", variant: "destructive" });
    }
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    try {
      const res = await fetch('/api/upload/product-images', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm((prev: any) => ({ ...prev, imageUrls: [...prev.imageUrls, ...data.imageUrls] }));
      toast({ title: "Uploaded", description: `${data.imageUrls.length} image(s) added` });
    } catch (e) {
      toast({ title: "Upload error", description: "Images failed to upload", variant: "destructive" });
    }
  };

  const saveProduct = async () => {
    const payload: any = {
      celebrityId: form.celebrityId,
      name: form.name,
      description: form.description || undefined,
      category: form.category,
      imageUrl: form.imageUrls.length <= 1 ? (form.imageUrls[0] || '') : form.imageUrls,
      price: form.price || undefined,
      location: form.location || undefined,
      website: form.website || undefined,
      purchaseLink: form.purchaseLink || undefined,
      rating: form.rating || undefined,
      isActive: !!form.isActive,
      isFeatured: !!form.isFeatured,
      createdAt: undefined,
      updatedAt: undefined,
      metadata: undefined,
    };
    try {
      const res = await fetch(editing ? `/api/celebrity-products/${editing.id}` : '/api/celebrity-products', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      await fetchProducts();
      setOpen(false);
      toast({ title: editing ? "Product updated" : "Product created" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/celebrity-products/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchProducts();
      toast({ title: "Product deleted" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const celebName = (id?: number) => celebrities.find(c => c.id === id)?.name || '—';

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <>
      <SidebarProvider className="bg-background text-white">
        <Sidebar variant="inset" collapsible="icon" className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <div className="text-lg font-bold">Cele Admin</div>
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/users')} tooltip="Users">
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/roles')} tooltip="Roles & Permissions">
                    <ShieldCheck />
                    <span>Roles & Permissions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/categories')} tooltip="Categories">
                    <Tags />
                    <span>Categories</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/celebrities')} tooltip="Celebrities">
                    <Star />
                    <span>Celebrities</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={true} tooltip="Products">
                    <Package />
                    <span>Products</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/plans')} tooltip="Plans">
                    <CreditCard />
                    <span>Plans</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-2 text-xs text-muted-foreground">Signed in as {user?.displayName || user?.username}</div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
    
        <SidebarInset>
          <div className="flex h-14 items-center gap-3 px-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger />
            <div className="font-bold text-lg">Cele Admin</div>
            <div className="ml-auto flex items-center gap-3">
              <Input placeholder="Search" className="w-48" />
              <Button variant="outline" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
                {isDark ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="outline" onClick={() => setLocation('/')}>Go to Site</Button>
            </div>
          </div>
    
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-extrabold mb-1">Celebrity Products</h1>
                <p className="text-sm text-muted-foreground">Manage products featured on celebrity profiles.</p>
              </div>
              <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Product</Button>
            </div>
    
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Celebrity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{celebName(p.celebrityId)}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>{p.price || '—'}</TableCell>
                        <TableCell>{p.rating ?? '—'}</TableCell>
                        <TableCell>
                          {p.isActive ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteProduct(p.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
            <div>
              <Label>Celebrity</Label>
              <Select value={String(form.celebrityId || '')} onValueChange={(v) => setForm((f:any) => ({ ...f, celebrityId: Number(v) }))}>
                <SelectTrigger><SelectValue placeholder="Select celebrity" /></SelectTrigger>
                <SelectContent>
                  {celebrities.map(c => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category || ''} onValueChange={(v) => setForm((f:any) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (<SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f:any) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f:any) => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Price</Label>
              <Input value={form.price} onChange={(e) => setForm((f:any) => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm((f:any) => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <Label>Website</Label>
              <Input value={form.website} onChange={(e) => setForm((f:any) => ({ ...f, website: e.target.value }))} />
            </div>
            <div>
              <Label>Purchase Link</Label>
              <Input value={form.purchaseLink} onChange={(e) => setForm((f:any) => ({ ...f, purchaseLink: e.target.value }))} />
            </div>
            <div>
              <Label>Rating</Label>
              <Input type="number" value={form.rating} onChange={(e) => setForm((f:any) => ({ ...f, rating: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f:any) => ({ ...f, isActive: v }))} />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm((f:any) => ({ ...f, isFeatured: v }))} />
                <Label>Featured</Label>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Images</Label>
              <div className="flex items-center gap-3">
                <Input type="file" accept="image/*" multiple onChange={(e) => handleUploadImages(e.target.files)} />
                <Upload className="h-4 w-4" />
              </div>
              {form.imageUrls.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">{form.imageUrls.length} image(s) uploaded</div>
              )}
            </div>
          </div>
    
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={saveProduct}>{editing ? 'Save Changes' : 'Create Product'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}