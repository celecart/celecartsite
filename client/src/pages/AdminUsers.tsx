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
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings, Moon, Sun, Tags, Activity, ExternalLink, CreditCard, Star, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
  roles?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [approvingUsers, setApprovingUsers] = useState<Set<number>>(new Set());
  
  // New state for roles and features
  const [roles, setRoles] = useState<Array<{ id: number; name: string; description?: string }>>([]);
  const [userRoles, setUserRoles] = useState<Set<number>>(new Set());
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
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
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
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

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch roles function
  async function fetchRoles() {
    try {
      const res = await fetch('/api/roles', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setRoles(data || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }

  // Fetch user roles function
  async function fetchUserRoles(userId: number) {
    try {
      const res = await fetch(`/api/users/${userId}/roles`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const roleIds = new Set(data.map((ur: any) => ur.roleId));
        setUserRoles(roleIds);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  }

  // Handle role assignment/removal
  async function toggleUserRole(userId: number, roleId: number, hasRole: boolean) {
    try {
      const method = hasRole ? 'DELETE' : 'POST';
      const res = await fetch(`/api/users/${userId}/roles/${roleId}`, {
        method,
        credentials: 'include',
      });
      if (res.ok) {
        await fetchUserRoles(userId);
        toast({ 
          title: "Success", 
          description: `Role ${hasRole ? 'removed from' : 'assigned to'} user` 
        });
      } else {
        throw new Error('Failed to update user role');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update user role", variant: "destructive" });
    }
  }

  // Handle image upload for create user form
  async function handleCreateImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size must be less than 5MB", variant: "destructive" });
      return;
    }

    try {
      // Store the file for FormData upload
      setProfilePictureFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicturePreview(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({ title: "Error", description: "Failed to process image", variant: "destructive" });
    }
  }

  // Handle image upload
  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size must be less than 5MB", variant: "destructive" });
      return;
    }

    setUploadingImage(true);
    try {
      // Convert to base64 for now (in production, you'd upload to a file service)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setForm({ ...form, profilePicture: result });
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadingImage(false);
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    }
  }

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
    setProfilePictureFile(null);
    setProfilePicturePreview('');
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
    setShowPassword(false);
    if (u?.id) {
      fetchUserRoles(u.id);
    }
    setIsEditOpen(true);
  }

  async function handleCreateSubmit() {
    try {
      if (!form.username.trim()) {
        toast({ title: "Username is required", description: "Please enter a username.", variant: "destructive" });
        return;
      }
      
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'profilePicture' && profilePictureFile) {
          formData.append('profilePicture', profilePictureFile);
        } else if (key !== 'profilePicture' && value) {
          formData.append(key, value);
        }
      });
      
      const res = await fetch('/api/users', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to create user (${res.status})`);
      }
      setIsCreateOpen(false);
      setProfilePictureFile(null);
      setProfilePicturePreview('');
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

  async function handleApproveCelebrity(userId: number, displayName: string) {
    try {
      setApprovingUsers(prev => new Set(prev).add(userId));
      
      // Assign celebrity role and create celebrity profile
      const roleRes = await fetch(`/api/users/${userId}/assign-celebrity-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (!roleRes.ok) {
        const err = await roleRes.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to assign Celebrity role (${roleRes.status})`);
      }
      
      // Update the user's account status to Active
      const statusRes = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ accountStatus: 'Active' }),
      });
      
      if (!statusRes.ok) {
        const err = await statusRes.json().catch(() => ({}));
        throw new Error(err?.message || `Failed to update user status (${statusRes.status})`);
      }
      
      toast({ 
        title: "Celebrity Approved", 
        description: `${displayName} has been approved as a celebrity, their account is now active, and their celebrity profile has been created.` 
      });
      
      // Refresh the users list to show updated status
      await refetch();
      
    } catch (e: any) {
      toast({ 
        title: "Error", 
        description: String(e?.message || e), 
        variant: "destructive" 
      });
    } finally {
      setApprovingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }

  // Handle delete user
  async function handleDeleteUser(userId: number, userName: string) {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (res.ok) {
        toast({ 
          title: "Success", 
          description: `User "${userName}" has been deleted successfully` 
        });
        refetch(); // Refresh the user list
        setIsDeleteOpen(false);
        setDeletingUser(null);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete user", 
        variant: "destructive" 
      });
    }
  }

  // Open delete confirmation dialog
  function openDeleteDialog(user: any) {
    setDeletingUser(user);
    setIsDeleteOpen(true);
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
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/celebrities')} tooltip="Celebrities">
                  <Star />
                  <span>Celebrities</span>
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
                      <TableHead className="hidden">ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden">Username</TableHead>
                      <TableHead>Display Name</TableHead>
                      <TableHead className="hidden">Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Celebrity Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="hidden">{u.id}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell className="hidden">{u.username}</TableCell>
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
                        <TableCell className="hidden">
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
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {u.roles && u.roles.length > 0 ? (
                              u.roles.map((role) => (
                                <Badge
                                  key={role.id}
                                  variant="outline"
                                  className="px-2 py-1 text-xs"
                                >
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary" className="px-2 py-1 text-xs">
                                No roles
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.roles && u.roles.length > 0 && u.roles.some(role => role.name === "Celebrity")
                                ? "default"
                                : "secondary"
                            }
                            className={`px-2 py-1 rounded-full ${
                              u.roles && u.roles.length > 0 && u.roles.some(role => role.name === "Celebrity")
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {u.roles && u.roles.length > 0 && u.roles.some(role => role.name === "Celebrity") 
                              ? "Approved Celebrity" 
                              : "Not Celebrity"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => openEditDialog(u)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {u.accountStatus === "Pending Verification" && (
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={() => handleApproveCelebrity(u.id, u.displayName || u.username || 'User')}
                                disabled={approvingUsers.has(u.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {approvingUsers.has(u.id) ? 'Approving...' : 'Approve Celebrity'}
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(u)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
                  <div className="text-sm mb-1">Profile Picture</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('create-profile-upload')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </Button>
                      <input
                        id="create-profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCreateImageUpload}
                        className="hidden"
                      />
                      {profilePictureFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setProfilePictureFile(null);
                            setProfilePicturePreview('');
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    {profilePicturePreview && (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profilePicturePreview} alt="Preview" />
                          <AvatarFallback>Preview</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{profilePictureFile?.name}</span>
                      </div>
                    )}
                  </div>
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={form.password} 
                      onChange={(e) => setForm({ ...form, password: e.target.value })} 
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
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
                  <div className="text-sm mb-1">Profile Picture</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-picture-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profile-picture-upload')?.click()}
                        disabled={uploadingImage}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </Button>
                    </div>
                    {form.profilePicture && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={form.profilePicture} />
                          <AvatarFallback>Preview</AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setForm({ ...form, profilePicture: "" })}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
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
                <div className="md:col-span-2">
                  <div className="text-sm mb-2">User Roles</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={userRoles.has(role.id)}
                          onCheckedChange={(checked) => {
                            if (editingUser?.id) {
                              toggleUserRole(editingUser.id, role.id, userRoles.has(role.id));
                            }
                          }}
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button onClick={handleEditSubmit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete User Confirmation Dialog */}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete User</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete the user "{deletingUser?.displayName || deletingUser?.username || deletingUser?.email}"? 
                  This action cannot be undone and will permanently remove all user data.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deletingUser && handleDeleteUser(deletingUser.id, deletingUser.displayName || deletingUser.username || deletingUser.email)}
                >
                  Delete User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}