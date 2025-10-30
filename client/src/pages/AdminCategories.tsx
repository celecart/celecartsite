import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
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
import { LayoutDashboard, Users, ShieldCheck, Settings, Moon, Sun, Tags, Trash2, Pencil, CreditCard, Star, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Package } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

function fetchCategories(): Promise<Category[]> {
  return fetch("/api/categories", { credentials: "include" })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
      return res.json();
    });
}

export default function AdminCategories() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<Partial<Category>>({ name: "", description: "", imageUrl: "" });

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/auth/user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const u = data?.user || null;
          setUser(u);
          if (!u || u.role !== 'admin') {
            setLocation('/');
          }
        } else {
          setLocation('/login');
        }
      } catch (e) {
        setLocation('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setLocation]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const next = stored ? stored === 'dark' : prefers;
      setIsDark(next);
      applyTheme(next);
    } catch {
      setIsDark(false);
      applyTheme(false);
    }
  }, []);

  function openCreateDialog() {
    setEditingCategory(null);
    setForm({ name: "", description: "", imageUrl: "" });
    setIsCreateOpen(true);
  }

  function openEditDialog(c: Category) {
    setEditingCategory(c);
    setForm({ name: c.name ?? "", description: c.description ?? "", imageUrl: c.imageUrl ?? "" });
    setIsEditOpen(true);
  }

  async function handleCreateSubmit() {
    try {
      if (!form.name || !form.name.trim()) {
        toast({ title: "Name is required", description: "Please enter a category name.", variant: "destructive" });
        return;
      }
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: form.name, description: form.description, imageUrl: form.imageUrl }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to create category (${res.status})`);
      }
      setIsCreateOpen(false);
      toast({ title: "Category created", description: `Category ${form.name} has been created.` });
      await refetch();
    } catch (e: any) {
      toast({ title: "Error", description: String(e?.message || e), variant: "destructive" });
    }
  }

  async function handleEditSubmit() {
    try {
      if (!editingCategory?.id) {
        toast({ title: "No category selected", description: "Please select a category to edit.", variant: "destructive" });
        return;
      }
      const payload: Record<string, any> = {};
      if (typeof form.name === 'string') payload.name = form.name;
      if (typeof form.description === 'string') payload.description = form.description;
      if (typeof form.imageUrl === 'string') payload.imageUrl = form.imageUrl;

      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to update category (${res.status})`);
      }
      setIsEditOpen(false);
      toast({ title: "Category updated", description: `Category ${form.name} has been updated.` });
      await refetch();
    } catch (e: any) {
      toast({ title: "Error", description: String(e?.message || e), variant: "destructive" });
    }
  }

  async function handleDelete(c: Category) {
    try {
      const res = await fetch(`/api/categories/${c.id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to delete category (${res.status})`);
      }
      toast({ title: "Category deleted", description: `Category ${c.name} has been deleted.` });
      await refetch();
    } catch (e: any) {
      toast({ title: "Error", description: String(e?.message || e), variant: "destructive" });
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (<>
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
                <SidebarMenuButton isActive={true} onClick={() => setLocation('/admin/categories')} tooltip="Categories">
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
                  <SidebarMenuButton onClick={() => setLocation('/admin/products')} tooltip="Products">
                    <Package />
                    <span>Products</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/products')} tooltip="Products">
                  <Package />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Content">
                  <FileText />
                  <span>Content</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/plans')} tooltip="Plans">
                  <CreditCard />
                  <span>Plans</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 text-xs text-muted-foreground">
            Signed in as {user?.displayName || user?.username}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex h-14 items-center gap-3 px-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger />
          <div className="font-bold text-lg">Cele Admin</div>
          <div className="ml-auto flex items-center gap-3">
            <Input placeholder="Search" className="w-48" />
            <Button variant="outline" size="icon" onClick={() => {
              const next = !isDark; setIsDark(next); applyTheme(next);
              try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
            }} aria-label="Toggle theme">
              {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" onClick={() => setLocation('/')}>Go to Site</Button>
            <Button variant="ghost" onClick={async () => {
              try { const res = await fetch('/auth/logout', { method: 'POST', credentials: 'include' }); if (res.ok) setLocation('/'); } catch {}
            }}>Sign out</Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">Categories</h1>
              <p className="text-sm text-muted-foreground">Manage style categories that power the Explore section.</p>
            </div>
            <div>
              <Button onClick={openCreateDialog} className="gap-2"><Tags className="h-4 w-4" /> New Category</Button>
            </div>
          </div>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="text-sm text-muted-foreground">Loading categories...</div>}
              {error && <div className="text-sm text-destructive">{String((error as any)?.message || error)}</div>}
              {!isLoading && !error && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Image URL</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(data) && data.length > 0 ? (
                      data.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.id}</TableCell>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{c.description}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{c.imageUrl}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="gap-1" onClick={() => openEditDialog(c)}>
                                <Pencil className="h-4 w-4" /> Edit
                              </Button>
                              <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(c)}>
                                <Trash2 className="h-4 w-4" /> Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">No categories found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>

    {/* Create Category Dialog */}
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm">Name</label>
            <Input value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Streetwear" />
          </div>
          <div>
            <label className="text-sm">Description</label>
            <Input value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description" />
          </div>
          <div>
            <label className="text-sm">Image URL</label>
            <Input value={form.imageUrl ?? ''} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Edit Category Dialog */}
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm">Name</label>
            <Input value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm">Description</label>
            <Input value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm">Image URL</label>
            <Input value={form.imageUrl ?? ''} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleEditSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>);
}