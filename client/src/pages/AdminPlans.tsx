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
import { LayoutDashboard, Users, ShieldCheck, Settings, Moon, Sun, Tags, Trash2, Pencil, BadgeDollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Plan {
  id: number;
  imageUrl?: string | null;
  price: number;
  discount?: number | null;
}

function fetchPlans(): Promise<Plan[]> {
  return fetch("/api/plans", { credentials: "include" })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to fetch plans: ${res.status}`);
      return res.json();
    });
}

export default function AdminPlans() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({ queryKey: ["plans"], queryFn: fetchPlans });
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Partial<Plan>>({ imageUrl: "", price: 0, discount: 0 });

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
    setEditingPlan(null);
    setForm({ imageUrl: "", price: 0, discount: 0 });
    setIsCreateOpen(true);
  }

  function openEditDialog(p: Plan) {
    setEditingPlan(p);
    setForm({ imageUrl: p.imageUrl ?? "", price: p.price ?? 0, discount: p.discount ?? 0 });
    setIsEditOpen(true);
  }

  async function handleCreateSubmit() {
    try {
      if (form.price == null || isNaN(Number(form.price))) {
        toast({ title: "Price is required", description: "Please enter a valid price.", variant: "destructive" });
        return;
      }
      const payload: Record<string, any> = {
        imageUrl: typeof form.imageUrl === 'string' ? form.imageUrl : undefined,
        price: Number(form.price),
        discount: form.discount != null ? Number(form.discount) : undefined,
      };
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to create plan (${res.status})`);
      }
      setIsCreateOpen(false);
      toast({ title: "Plan created", description: `Plan has been created.` });
      await refetch();
    } catch (e: any) {
      toast({ title: "Error", description: String(e?.message || e), variant: "destructive" });
    }
  }

  async function handleEditSubmit() {
    try {
      if (!editingPlan?.id) {
        toast({ title: "No plan selected", description: "Please select a plan to edit.", variant: "destructive" });
        return;
      }
      const payload: Record<string, any> = {};
      if (typeof form.imageUrl === 'string') payload.imageUrl = form.imageUrl;
      if (form.price != null && !isNaN(Number(form.price))) payload.price = Number(form.price);
      if (form.discount != null && !isNaN(Number(form.discount))) payload.discount = Number(form.discount);

      const res = await fetch(`/api/plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to update plan (${res.status})`);
      }
      setIsEditOpen(false);
      toast({ title: "Plan updated", description: `Plan has been updated.` });
      await refetch();
    } catch (e: any) {
      toast({ title: "Error", description: String(e?.message || e), variant: "destructive" });
    }
  }

  async function handleDelete(p: Plan) {
    try {
      const res = await fetch(`/api/plans/${p.id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to delete plan (${res.status})`);
      }
      toast({ title: "Plan deleted", description: `Plan has been deleted.` });
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
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/categories')} tooltip="Categories">
                  <Tags />
                  <span>Categories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true} onClick={() => setLocation('/admin/plans')} tooltip="Plans">
                  <BadgeDollarSign />
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
            <Button onClick={openCreateDialog} className="gap-2">
              <BadgeDollarSign className="h-4 w-4" /> New Plan
            </Button>
          </div>
        </div>

        <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <div className="text-muted-foreground">Loading plans...</div>
          )}
          {error && (
            <div className="text-destructive">Error loading plans</div>
          )}
          {data && data.length === 0 && (
            <div className="text-muted-foreground">No plans found</div>
          )}

          {data?.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img
                  src={p.imageUrl || "/assets/profiles/default.jpg"}
                  alt={"Plan Image"}
                  className="w-full h-40 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/assets/profiles/default.jpg"; }}
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">${p.price.toFixed(2)}</CardTitle>
                  {p.discount != null && (
                    <span className="text-sm text-green-500">{p.discount}% off</span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(p)} className="gap-2"><Pencil className="h-4 w-4" /> Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(p)} className="gap-2"><Trash2 className="h-4 w-4" /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>

    {/* Create Plan Dialog */}
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Plan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <label className="text-sm">Image URL</label>
          <Input placeholder="https://..." value={String(form.imageUrl ?? "")} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} />

          <label className="text-sm">Price</label>
          <Input type="number" step="0.01" value={String(form.price ?? 0)} onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))} />

          <label className="text-sm">Discount (%)</label>
          <Input type="number" step="1" value={String(form.discount ?? 0)} onChange={(e) => setForm(f => ({ ...f, discount: Number(e.target.value) }))} />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsCreateOpen(false)} variant="outline">Cancel</Button>
          <Button onClick={handleCreateSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Edit Plan Dialog */}
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Plan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <label className="text-sm">Image URL</label>
          <Input placeholder="https://..." value={String(form.imageUrl ?? "")} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} />

          <label className="text-sm">Price</label>
          <Input type="number" step="0.01" value={String(form.price ?? 0)} onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))} />

          <label className="text-sm">Discount (%)</label>
          <Input type="number" step="1" value={String(form.discount ?? 0)} onChange={(e) => setForm(f => ({ ...f, discount: Number(e.target.value) }))} />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsEditOpen(false)} variant="outline">Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>);
}