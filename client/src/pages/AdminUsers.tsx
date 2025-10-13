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
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings, Moon, Sun, Tags } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function fetchUsers(): Promise<Array<{
  id: number;
  username?: string;
  email?: string;
  displayName?: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  accountStatus?: string;
  source?: string;
}>> {
  return fetch("/api/users", { credentials: "include" })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }
      return res.json();
    });
}

export default function AdminUsers() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    googleId: "",
    displayName: "",
    profilePicture: "",
    firstName: "",
    lastName: "",
    phone: "",
    accountStatus: "Active",
  });
  const allowedStatuses = ["Active", "Suspended", "Pending Verification", "Deleted"] as const;

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
    setEditingUser(null);
    setForm({
      username: "",
      password: "",
      email: "",
      googleId: "",
      displayName: "",
      profilePicture: "",
      firstName: "",
      lastName: "",
      phone: "",
      accountStatus: "Active",
    });
    setIsCreateOpen(true);
  }

  function openEditDialog(u: any) {
    setEditingUser(u);
    setForm({
      username: u?.username ?? "",
      password: "",
      email: u?.email ?? "",
      googleId: "",
      displayName: u?.displayName ?? "",
      profilePicture: u?.profilePicture ?? "",
      firstName: u?.firstName ?? "",
      lastName: u?.lastName ?? "",
      phone: u?.phone ?? "",
      accountStatus: (u?.accountStatus as (typeof allowedStatuses)[number]) ?? "Active",
    });
    setIsEditOpen(true);
  }

  async function handleCreateSubmit() {
    try {
      if (!form.username.trim()) {
        toast({ title: "Username is required", description: "Please enter a username.", variant: "destructive" });
        return;
      }
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to create user (${res.status})`);
      }
      setIsCreateOpen(false);
      toast({ title: "User created", description: `User ${form.username} has been created.` });
      await refetch();
    } catch (e: any) {
      toast({ title: "Error", description: String(e?.message || e), variant: "destructive" });
    }
  }

  async function handleEditSubmit() {
    try {
      if (!editingUser?.id) {
        toast({ title: "No user selected", description: "Please select a user to edit.", variant: "destructive" });
        return;
      }
      const payload: Record<string, any> = {};
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'password') {
          if (typeof v === 'string' && v.trim().length > 0) payload[k] = v;
        } else if (typeof v === 'string') {
          payload[k] = v;
        } else {
          payload[k] = v;
        }
      });
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to update user (${res.status})`);
      }
      setIsEditOpen(false);
      toast({ title: "User updated", description: `User ${form.username} has been updated.` });
      await refetch();
    } catch (e: any) {
      toast({ title: "Error", description: String(e?.message || e), variant: "destructive" });
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
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
                <SidebarMenuButton isActive={true} onClick={() => setLocation('/admin/users')} tooltip="Users">
                  <Users />
                  <span>Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Roles & Permissions">
                  <ShieldCheck />
                  <span>Roles & Permissions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/roles')} tooltip="Roles & Permissions">
                  <ShieldCheck />
                  <span>Roles & Permissions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Content">
                  <FileText />
                  <span>Content</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/categories')} tooltip="Categories">
                  <Tags />
                  <span>Categories</span>
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
            <Button variant="outline" size="icon" aria-label="Toggle theme">
              {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" onClick={() => setLocation('/')}>Go to Site</Button>
            <Button variant="ghost" onClick={() => setLocation('/login')}>Sign out</Button>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">Users</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Admin access is restricted. Only users with the Admin role can view this panel.
          </p>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User List</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
                  <Button onClick={openCreateDialog}>Create User</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && <div>Loading users...</div>}
              {error && <div className="text-red-600">{String(error)}</div>}
              {!isLoading && !error && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>{u.id}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.username}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {u.profilePicture ? (
                                <AvatarImage src={u.profilePicture} alt={u.displayName || u.username || "User"} />
                              ) : (
                                <AvatarFallback>{(u.displayName || u.username || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
                              )}
                            </Avatar>
                            <div className="font-medium">{u.displayName || u.username}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.source === 'google' ? 'secondary' : 'default'}
                            className="px-2 py-1 rounded-full"
                          >
                            {(u.source || 'local').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.accountStatus === "Active"
                                ? "default"
                                : u.accountStatus === "Suspended" || u.accountStatus === "Deleted"
                                ? "destructive"
                                : "secondary"
                            }
                            className="px-2 py-1 rounded-full"
                          >
                            {u.accountStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(u)}>Edit</Button>
                          <Button size="sm" className="ml-2" disabled title="Coming soon">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        {/* Create User Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm mb-1">Username</div>
                  <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="johndoe" />
                </div>
                <div>
                  <div className="text-sm mb-1">Password</div>
                  <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                </div>
                <div>
                  <div className="text-sm mb-1">Email</div>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                </div>
                <div>
                  <div className="text-sm mb-1">Display Name</div>
                  <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="John Doe" />
                </div>
                <div>
                  <div className="text-sm mb-1">First Name</div>
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
                </div>
                <div>
                  <div className="text-sm mb-1">Last Name</div>
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
                </div>
                <div>
                  <div className="text-sm mb-1">Phone</div>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 123 4567" />
                </div>
                <div>
                  <div className="text-sm mb-1">Profile Picture URL</div>
                  <Input value={form.profilePicture} onChange={(e) => setForm({ ...form, profilePicture: e.target.value })} placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm mb-1">Account Status</div>
                  <Select value={form.accountStatus} onValueChange={(v) => setForm({ ...form, accountStatus: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedStatuses.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateSubmit}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm mb-1">Username</div>
                  <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
                <div>
                  <div className="text-sm mb-1">Password (leave blank to keep unchanged)</div>
                  <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div>
                  <div className="text-sm mb-1">Email</div>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <div className="text-sm mb-1">Display Name</div>
                  <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
                </div>
                <div>
                  <div className="text-sm mb-1">First Name</div>
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <div className="text-sm mb-1">Last Name</div>
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <div>
                  <div className="text-sm mb-1">Phone</div>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <div className="text-sm mb-1">Profile Picture URL</div>
                  <Input value={form.profilePicture} onChange={(e) => setForm({ ...form, profilePicture: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm mb-1">Account Status</div>
                  <Select value={form.accountStatus} onValueChange={(v) => setForm({ ...form, accountStatus: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedStatuses.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button onClick={handleEditSubmit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}