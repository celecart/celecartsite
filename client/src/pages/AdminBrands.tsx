import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings, Moon, Sun, Tags, CreditCard, Star, Package, Tag, ExternalLink, Upload, AlertTriangle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Brand, Category, InsertBrand } from "@shared/schema";

function RichTextEditor({ id, value, onChange, placeholder, className }: { id?: string; value?: string; onChange: (html: string) => void; placeholder?: string; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Only update innerHTML if it actually differs, to avoid resetting the caret/selection
    if (ref.current && typeof value === 'string' && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);
  const collapseToEndIfSelectAll = () => {
    if (!ref.current) return;
    const sel = window.getSelection();
    if (!sel) return;
    const selected = sel.toString();
    const full = ref.current.textContent || "";
    // If the selection matches the entire text, collapse to the end
    if (selected && selected === full) {
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };
  // Some browsers select-all when focusing via associated <label>.
  // Schedule correction after focus to ensure we see the final selection.
  const handleFocusCorrection = () => {
    // Next frame and microtask to catch late selection applications
    requestAnimationFrame(collapseToEndIfSelectAll);
    setTimeout(collapseToEndIfSelectAll, 0);
  };
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = (e.currentTarget as HTMLDivElement).innerHTML;
    onChange(html);
  };
  const exec = (cmd: string) => {
    // Keep focus in the editor so selection/caret is retained
    if (ref.current) ref.current.focus();
    document.execCommand(cmd, false);
  };
  return (
    <div>
      <div className="flex gap-2 mb-2">
        {/* Prevent toolbar mouse down from stealing focus from the editor */}
        <Button type="button" variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')}>Bold</Button>
        <Button type="button" variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')}>Italic</Button>
        <Button type="button" variant="outline" size="sm" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')}>Underline</Button>
      </div>
      <div
        id={id}
        ref={ref}
        contentEditable
        spellCheck={true}
        role="textbox"
        aria-multiline="true"
        tabIndex={0}
        onFocus={handleFocusCorrection}
        onClick={handleFocusCorrection}
        onMouseUp={collapseToEndIfSelectAll}
        onInput={handleInput}
        data-placeholder={placeholder || ""}
        // Force theme-aware caret and text color via inline style for maximum specificity
        style={{
          caretColor: document.documentElement.classList.contains('dark') ? '#ffffff' : '#111111',
          color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#111111',
        }}
        className={cn(
          "prose dark:prose-invert min-h-[120px] border rounded p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rte",
          "text-black dark:text-white",
          "selection:bg-white/15 dark:selection:bg-white/20",
          "caret-black dark:caret-white",
          className
        )}
      />
    </div>
  );
}

async function fetchBrands(query?: string): Promise<Brand[]> {
  const url = query && query.trim() ? `/api/brands?q=${encodeURIComponent(query.trim())}` : "/api/brands";
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch brands: ${res.status}`);
  return res.json();
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories", { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}

export default function AdminBrands() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string | null>(null);
  const originsOptions = useMemo(
    () => [
      "USA", "UK", "France", "Italy", "Pakistan", "India", "China", "Japan", "Germany", "UAE"
    ],
    []
  );
  const sourceTypeOptions = useMemo(() => [
    "Direct Marketing",
    "Social Media",
    "Influencer Partnerships",
    "PR/Media Coverage",
    "Event Sponsorship",
  ], []);

  const { register, handleSubmit, setValue, watch, reset, setError, formState: { errors, isSubmitting } } = useForm<InsertBrand>({
    defaultValues: {
      name: "",
      description: "",
      websiteUrl: "",
      imageUrl: "",
      origins: [],
      categoryIds: [],
      sourceType: undefined,
      celebWearers: [],
    }
  });

  const editForm = useForm<InsertBrand>({
    defaultValues: {
      name: "",
      description: "",
      websiteUrl: "",
      imageUrl: "",
      origins: [],
      categoryIds: [],
      sourceType: undefined,
      celebWearers: [],
    }
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["brands", search],
    queryFn: () => fetchBrands(search),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    (categories || []).forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const { toast } = useToast();
  const [logoError, setLogoError] = useState<string | null>(null);
  const [editLogoError, setEditLogoError] = useState<string | null>(null);

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
      const next = stored ? stored === 'dark' : false;
      setIsDark(next);
      applyTheme(next);
    } catch {
      setIsDark(false);
      applyTheme(false);
    }
  }, []);

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setLogoFile(null);
      setLogoPreview(null);
      setLogoError(null);
      return;
    }
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      const msg = "Invalid file type. Allowed: PNG, JPG, SVG";
      setLogoError(msg);
      toast({ title: "Logo file error", description: msg, variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      const msg = "File too large. Max size: 2MB";
      setLogoError(msg);
      toast({ title: "Logo file error", description: msg, variant: "destructive" });
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setLogoError(null);
  };

  const onEditLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setEditLogoFile(null);
      setEditLogoPreview(editingBrand?.imageUrl || null);
      setEditLogoError(null);
      return;
    }
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      const msg = "Invalid file type. Allowed: PNG, JPG, SVG";
      setEditLogoError(msg);
      toast({ title: "Logo file error", description: msg, variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      const msg = "File too large. Max size: 2MB";
      setEditLogoError(msg);
      toast({ title: "Logo file error", description: msg, variant: "destructive" });
      return;
    }
    setEditLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setEditLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setEditLogoError(null);
  };

  const uploadLogo = async (): Promise<string> => {
    if (!logoFile) throw new Error("Logo file is required");
    const fd = new FormData();
    fd.append('logo', logoFile);
    const res = await fetch('/api/upload/brand-logo', {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    const json = await res.json();
    return json.imageUrl as string;
  };

  const uploadEditLogo = async (): Promise<string> => {
    if (!editLogoFile) return editingBrand?.imageUrl || "";
    const fd = new FormData();
    fd.append('logo', editLogoFile);
    const res = await fetch('/api/upload/brand-logo', {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    const json = await res.json();
    return json.imageUrl as string;
  };

  const onSubmit = async (values: InsertBrand) => {
    try {
      // enforce name constraint locally
      if (!values.name || values.name.trim().length === 0) {
        setError('name', { type: 'manual', message: 'Brand Name is required' });
        toast({ title: 'Validation failed', description: 'Brand Name is required', variant: 'destructive' });
        return;
      }
      if (values.name.length > 100) {
        setError('name', { type: 'manual', message: 'Max length is 100 characters' });
        toast({ title: 'Validation failed', description: 'Brand Name must be 100 characters or fewer', variant: 'destructive' });
        return;
      }
      // upload logo first to get imageUrl
      if (!logoFile) {
        setLogoError('Logo is required. Please upload a brand logo image.');
        toast({ title: 'Validation failed', description: 'Please upload a brand logo image', variant: 'destructive' });
        return;
      }
      const uploadedUrl = await uploadLogo();
      const payload: InsertBrand = {
        ...values,
        imageUrl: uploadedUrl,
        // ensure arrays are defined
        origins: values.origins ?? [],
        categoryIds: values.categoryIds ?? [],
        celebWearers: values.celebWearers ?? [],
      };
      const res = await fetch('/api/brands', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const issues = j?.errors as any[] | undefined;
        if (Array.isArray(issues) && issues.length) {
          issues.forEach((issue: any) => {
            const field = issue.field ?? (Array.isArray(issue.path) && issue.path.length ? String(issue.path[0]) : 'root');
            const baseMsg = issue.message || 'Invalid value';
            const tip = issue.tip ? ` — ${issue.tip}` : '';
            const msg = `${baseMsg}${tip}`;
            if (field === 'imageUrl' || field === 'logo') {
              setLogoError(msg);
            } else if (field && field !== 'root') {
              setError(field as keyof InsertBrand, { type: 'server', message: msg });
            }
          });
          toast({ title: 'Validation failed', description: 'Please fix highlighted fields and try again.', variant: 'destructive' });
          return;
        }
        throw new Error(j?.message || `Failed to create brand: ${res.status}`);
      }
      // reset form and refresh list
      reset();
      setLogoFile(null);
      setLogoPreview(null);
      setOpenCreate(false);
      await refetch();
    } catch (e: any) {
      const msg = e?.message || 'Error creating brand';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const onSubmitEdit = async (values: InsertBrand) => {
    try {
      if (!editingBrand) return;
      if (!values.name || values.name.trim().length === 0) {
        editForm.setError('name', { type: 'manual', message: 'Brand Name is required' });
        toast({ title: 'Validation failed', description: 'Brand Name is required', variant: 'destructive' });
        return;
      }
      if (values.name.length > 100) {
        editForm.setError('name', { type: 'manual', message: 'Max length is 100 characters' });
        toast({ title: 'Validation failed', description: 'Brand Name must be 100 characters or fewer', variant: 'destructive' });
        return;
      }
      const uploadedUrl = await uploadEditLogo();
      const payload: InsertBrand = {
        ...values,
        imageUrl: uploadedUrl,
        origins: values.origins ?? [],
        categoryIds: values.categoryIds ?? [],
        celebWearers: values.celebWearers ?? [],
      };
      const res = await fetch(`/api/brands/${editingBrand.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const issues = j?.errors as any[] | undefined;
        if (Array.isArray(issues) && issues.length) {
          issues.forEach((issue: any) => {
            const field = issue.field ?? (Array.isArray(issue.path) && issue.path.length ? String(issue.path[0]) : 'root');
            const baseMsg = issue.message || 'Invalid value';
            const tip = issue.tip ? ` — ${issue.tip}` : '';
            const msg = `${baseMsg}${tip}`;
            if (field === 'imageUrl' || field === 'logo') {
              setEditLogoError(msg);
            } else if (field && field !== 'root') {
              editForm.setError(field as keyof InsertBrand, { type: 'server', message: msg });
            }
          });
          toast({ title: 'Validation failed', description: 'Please fix highlighted fields and try again.', variant: 'destructive' });
          return;
        }
        throw new Error(j?.message || `Failed to update brand: ${res.status}`);
      }
      setOpenEdit(false);
      setEditingBrand(null);
      setEditLogoFile(null);
      setEditLogoPreview(null);
      setEditLogoError(null);
      await refetch();
    } catch (e: any) {
      const msg = e?.message || 'Error updating brand';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  // Delete confirmation modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const confirmDeleteBrand = (brand: Brand) => {
    setBrandToDelete(brand);
    setIsDeleteOpen(true);
  };

  const handleDeleteBrand = async () => {
    if (!brandToDelete?.id) return;
    try {
      setDeletingId(brandToDelete.id);
      const res = await fetch(`/api/brands/${brandToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || `Failed to delete brand: ${res.status}`);
      }
      setIsDeleteOpen(false);
      setBrandToDelete(null);
      await refetch();
    } catch (e: any) {
      alert(e?.message || 'Error deleting brand');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading…</h1>
          <p className="text-muted-foreground">Please wait while we verify access.</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

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
                  <SidebarMenuButton onClick={() => setLocation('/admin/users')} tooltip="Users">
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin/roles')} tooltip="Roles & Permissions">
                    <ShieldCheck />
                    <span>Roles & Permissions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin/categories')} tooltip="Categories">
                    <Tags />
                    <span>Categories</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={true} tooltip="Brands">
                    <Tag />
                    <span>Brands</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin/celebrities')} tooltip="Celebrities">
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
                  <SidebarMenuButton onClick={() => setLocation('/admin/plans')} tooltip="Plans">
                    <CreditCard />
                    <span>Plans</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin')} tooltip="Content">
                    <FileText />
                    <span>Content</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin/settings')} tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm text-muted-foreground">
                {user?.displayName || user?.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const next = !isDark;
                  setIsDark(next);
                  applyTheme(next);
                }}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              Refresh
            </Button>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-2">Add Brand</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Brand</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="name">Brand Name *</Label>
                    <Input id="name" placeholder="e.g., Randolph Engineering" className="text-white placeholder:text-white/60" {...register('name', { required: true, maxLength: 100 })} />
                    {errors.name && <p className="text-destructive text-sm">Brand Name is required (max 100 chars)</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="description">Description (Rich Text, optional)</Label>
                    <RichTextEditor id="description" placeholder="Type detailed brand description…" value={watch('description') || ''} onChange={(html) => setValue('description', html)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input id="websiteUrl" type="url" placeholder="https://example.com"
                      {...register('websiteUrl', {
                        pattern: {
                          value: /^(https?:\/\/)[^\s$.?#].[^\s]*$/i,
                          message: 'Enter a valid URL starting with http:// or https://',
                        },
                      })}
                    />
                    {errors.websiteUrl && <p className="text-destructive text-sm">{errors.websiteUrl.message as string}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>Country/Region of Origin</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="w-full justify-start">
                          {(watch('origins') || []).length ? (watch('origins') || []).join(', ') : 'Select origins'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {originsOptions.map((o) => {
                          const selected = (watch('origins') || []).includes(o);
                          return (
                            <DropdownMenuCheckboxItem
                              key={o}
                              checked={selected}
                              onCheckedChange={(checked) => {
                                const current = new Set(watch('origins') || []);
                                if (checked) current.add(o); else current.delete(o);
                                setValue('origins', Array.from(current));
                              }}
                            >
                              {o}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1">
                    <Label>Categories</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="w-full justify-start">
                          {(watch('categoryIds') || []).length
                            ? (watch('categoryIds') || [])
                                .map((id) => categoryNameById.get(id) || String(id))
                                .join(', ')
                            : (categoriesLoading ? 'Loading…' : 'Select categories')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64">
                        {(categories || []).map((c) => {
                          const selected = (watch('categoryIds') || []).includes(c.id);
                          return (
                            <DropdownMenuCheckboxItem
                              key={c.id}
                              checked={selected}
                              onCheckedChange={(checked) => {
                                const current = new Set(watch('categoryIds') || []);
                                if (checked) current.add(c.id); else current.delete(c.id);
                                setValue('categoryIds', Array.from(current));
                              }}
                            >
                              {c.name}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1">
                    <Label>Logo *</Label>
                    <div className="flex items-center gap-2">
                      <Input type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml" onChange={onLogoChange} />
                      <Upload className="h-4 w-4" />
                    </div>
                    {logoPreview && (
                      <img src={logoPreview} alt="Logo preview" className="mt-2 h-16 w-16 rounded border object-cover" />
                    )}
                    {logoError && <p className="text-destructive text-sm">{logoError}</p>}
                    {errors.imageUrl && <p className="text-destructive text-sm">{errors.imageUrl.message as string}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>Source Type</Label>
                    <Select onValueChange={(v) => setValue('sourceType', v as InsertBrand['sourceType'])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>Create</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Brand Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Brand</DialogTitle>
                </DialogHeader>
                <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="edit-name">Brand Name *</Label>
                    <Input id="edit-name" placeholder="Brand name" className="text-white placeholder:text-white/60" {...editForm.register('name', { required: true, maxLength: 100 })} />
                    {editForm.formState.errors.name && <p className="text-destructive text-sm">Brand Name is required (max 100 chars)</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-description">Description (Rich Text, optional)</Label>
                    <RichTextEditor id="edit-description" placeholder="Update brand description…" value={editForm.watch('description') || ''} onChange={(html) => editForm.setValue('description', html)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-websiteUrl">Website URL</Label>
                    <Input id="edit-websiteUrl" type="url" placeholder="https://example.com"
                      {...editForm.register('websiteUrl', {
                        pattern: {
                          value: /^(https?:\/\/)[^\s$.?#].[^\s]*$/i,
                          message: 'Enter a valid URL starting with http:// or https://',
                        },
                      })}
                    />
                    {editForm.formState.errors.websiteUrl && <p className="text-destructive text-sm">{editForm.formState.errors.websiteUrl.message as string}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>Country/Region of Origin</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="w-full justify-start">
                          {(editForm.watch('origins') || []).length ? (editForm.watch('origins') || []).join(', ') : 'Select origins'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {originsOptions.map((o) => {
                          const selected = (editForm.watch('origins') || []).includes(o);
                          return (
                            <DropdownMenuCheckboxItem
                              key={o}
                              checked={selected}
                              onCheckedChange={(checked) => {
                                const current = new Set(editForm.watch('origins') || []);
                                if (checked) current.add(o); else current.delete(o);
                                editForm.setValue('origins', Array.from(current));
                              }}
                            >
                              {o}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1">
                    <Label>Categories</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" className="w-full justify-start">
                          {(editForm.watch('categoryIds') || []).length
                            ? (editForm.watch('categoryIds') || [])
                                .map((id) => categoryNameById.get(id) || String(id))
                                .join(', ')
                            : (categoriesLoading ? 'Loading…' : 'Select categories')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64">
                        {(categories || []).map((c) => {
                          const selected = (editForm.watch('categoryIds') || []).includes(c.id);
                          return (
                            <DropdownMenuCheckboxItem
                              key={c.id}
                              checked={selected}
                              onCheckedChange={(checked) => {
                                const current = new Set(editForm.watch('categoryIds') || []);
                                if (checked) current.add(c.id); else current.delete(c.id);
                                editForm.setValue('categoryIds', Array.from(current));
                              }}
                            >
                              {c.name}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1">
                    <Label>Logo</Label>
                    <div className="flex items-center gap-2">
                      <Input type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml" onChange={onEditLogoChange} />
                      <Upload className="h-4 w-4" />
                    </div>
                    {(editLogoPreview || editingBrand?.imageUrl) && (
                      <img src={editLogoPreview || editingBrand?.imageUrl || ''} alt="Logo preview" className="mt-2 h-16 w-16 rounded border object-cover" />
                    )}
                    {editLogoError && <p className="text-destructive text-sm">{editLogoError}</p>}
                    {editForm.formState.errors.imageUrl && (
                      <p className="text-destructive text-sm">{editForm.formState.errors.imageUrl.message as string}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Source Type</Label>
                    <Select onValueChange={(v) => editForm.setValue('sourceType', v as InsertBrand['sourceType'])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={editForm.formState.isSubmitting}>Save Changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
              open={isDeleteOpen}
              onOpenChange={(open) => {
                setIsDeleteOpen(open);
                if (!open) setBrandToDelete(null);
              }}
            >
              <DialogContent
                className={
                  "sm:max-w-[420px] rounded-xl border bg-background p-6 shadow-xl " +
                  "data-[state=open]:animate-in data-[state=closed]:animate-out " +
                  "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 " +
                  "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
                }
              >
                {/* Use the built-in Dialog close button from the UI component; remove duplicate custom close */}
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Confirm Deletion
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this item?
                  </p>
                  {brandToDelete && (
                    <p className="text-sm">
                      Item: <span className="font-medium">{brandToDelete.name}</span>
                    </p>
                  )}
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    autoFocus
                    disabled={!!deletingId}
                    onClick={handleDeleteBrand}
                  >
                    {deletingId ? "Deleting…" : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </header>
          <main className="p-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Brands</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Input
                      placeholder="Search brands by name…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={() => refetch()} className="whitespace-nowrap">Search</Button>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Logo</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Website</TableHead>
                          <TableHead className="hidden md:table-cell">Origins</TableHead>
                          <TableHead className="hidden md:table-cell">Categories</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading && (
                          <TableRow>
                            <TableCell colSpan={6}>Loading brands…</TableCell>
                          </TableRow>
                        )}
                        {!isLoading && (data || []).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6}>No brands found.</TableCell>
                          </TableRow>
                        )}
                        {(data || []).map((b) => (
                          <TableRow key={b.id}>
                            <TableCell>
                              <Avatar className="h-8 w-8">
                                {b.imageUrl ? (
                                  <AvatarImage src={b.imageUrl} alt={b.name} />
                                ) : (
                                  <AvatarFallback>{b.name?.[0]?.toUpperCase() || 'B'}</AvatarFallback>
                                )}
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{b.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {b.websiteUrl ? (
                                <a href={b.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:underline">
                                  Visit <ExternalLink className="h-4 w-4" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {(b.origins || []).length ? (b.origins || []).join(', ') : <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {(b.categoryIds || []).length
                                ? (b.categoryIds || []).map((id) => categoryNameById.get(id) || String(id)).join(', ')
                                : <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingBrand(b);
                                    editForm.reset({
                                      name: b.name || "",
                                      description: (b as any).description || "",
                                      websiteUrl: (b as any).websiteUrl || "",
                                      imageUrl: b.imageUrl || "",
                                      origins: b.origins || [],
                                      categoryIds: b.categoryIds || [],
                                      sourceType: (b as any).sourceType || undefined,
                                      celebWearers: b.celebWearers || [],
                                    });
                                    setEditLogoPreview(b.imageUrl || null);
                                    setOpenEdit(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={deletingId === b.id}
                                  onClick={() => confirmDeleteBrand(b)}
                                >
                                  {deletingId === b.id ? 'Deleting…' : 'Delete'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}