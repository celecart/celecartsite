import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  FileText, 
  Settings, 
  Moon, 
  Sun, 
  Tags, 
  CreditCard, 
  Star,
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Filter,
  Grid,
  List
} from "lucide-react";
import { Package } from "lucide-react";

interface User {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  profilePicture?: string;
  role?: "admin" | "user";
}

interface Role {
  id: number;
  name: string;
  description?: string | null;
}

interface Permission {
  id: number;
  name: string;
  description?: string | null;
}

interface Module {
  name: string;
  displayName: string;
  permissions: Permission[];
}

// Define predefined modules with display names
const PREDEFINED_MODULES = [
  { name: 'users', displayName: 'Users Management', icon: Users, color: 'bg-blue-500' },
  { name: 'celebrities', displayName: 'Celebrities', icon: Star, color: 'bg-purple-500' },
  { name: 'plans', displayName: 'Plans', icon: CreditCard, color: 'bg-green-500' },
  { name: 'brands', displayName: 'Brands', icon: Tags, color: 'bg-orange-500' },
  { name: 'categories', displayName: 'Categories', icon: Grid, color: 'bg-pink-500' },
  { name: 'tournaments', displayName: 'Tournaments', icon: FileText, color: 'bg-indigo-500' },
  { name: 'content', displayName: 'Content Management', icon: FileText, color: 'bg-teal-500' },
  { name: 'analytics', displayName: 'Analytics', icon: LayoutDashboard, color: 'bg-red-500' },
  { name: 'settings', displayName: 'System Settings', icon: Settings, color: 'bg-gray-500' }
];

export default function AdminRoles() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [rolePerms, setRolePerms] = useState<Record<number, Set<number>>>({});
  const [userRoles, setUserRoles] = useState<Record<number, Set<number>>>({});
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Form States
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newModuleName, setNewModuleName] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDesc, setEditRoleDesc] = useState("");
  
  const { toast } = useToast();

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
          const u: User | null = data?.user || null;
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

  useEffect(() => {
    if (!loading && user && user.role === 'admin') {
      loadAll();
    }
  }, [loading, user]);

  const loadAll = async () => {
    await Promise.all([
      fetchRoles(),
      fetchPermissions(),
      fetchUsers()
    ]);
  };

  useEffect(() => {
    if (roles.length > 0) {
      fetchRolePermissions();
    }
  }, [roles]);

  useEffect(() => {
    if (usersList.length > 0) {
      fetchUserRoles();
    }
  }, [usersList]);

  useEffect(() => {
    // Group permissions by module with predefined structure
    const moduleMap: Record<string, Permission[]> = {};
    
    // Initialize all predefined modules
    PREDEFINED_MODULES.forEach(module => {
      moduleMap[module.name] = [];
    });
    
    // Group existing permissions by module
    permissions.forEach(perm => {
      const [moduleName] = perm.name.split('.');
      if (moduleName) {
        if (!moduleMap[moduleName]) {
          moduleMap[moduleName] = [];
        }
        moduleMap[moduleName].push(perm);
      }
    });
    
    // Create module list with display names and metadata
    const moduleList = PREDEFINED_MODULES.map(predefined => {
      const modulePerms = moduleMap[predefined.name] || [];
      return {
        name: predefined.name,
        displayName: predefined.displayName,
        permissions: modulePerms.sort((a, b) => {
          // Sort CRUD operations in logical order
          const order = ['create', 'read', 'update', 'delete'];
          const aAction = a.name.split('.')[1];
          const bAction = b.name.split('.')[1];
          const aIndex = order.indexOf(aAction);
          const bIndex = order.indexOf(bAction);
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          return a.name.localeCompare(b.name);
        })
      };
    }).filter(module => module.permissions.length > 0); // Only show modules with permissions
    
    setModules(moduleList);
  }, [permissions]);

  async function fetchRoles() {
    const res = await fetch('/api/roles', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setRoles(data || []);
    }
  }

  async function fetchPermissions() {
    const res = await fetch('/api/permissions', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setPermissions(data || []);
    }
  }

  async function fetchUsers() {
    const res = await fetch('/api/users', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setUsersList(data || []);
    }
  }

  async function fetchRolePermissions() {
    try {
      const map: Record<number, Set<number>> = {};
      await Promise.all(
        roles.map(async (r) => {
          const res = await fetch(`/api/roles/${r.id}/permissions`, { credentials: 'include' });
          if (res.ok) {
            const list: Array<{ id: number; roleId: number; permissionId: number }> = await res.json();
            map[r.id] = new Set(list.map((rp) => rp.permissionId));
          } else {
            map[r.id] = new Set();
          }
        })
      );
      setRolePerms(map);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchUserRoles() {
    try {
      const map: Record<number, Set<number>> = {};
      await Promise.all(
        usersList.map(async (u) => {
          const res = await fetch(`/api/users/${u.id}/roles`, { credentials: 'include' });
          if (res.ok) {
            const list: Array<{ id: number; userId: number; roleId: number }> = await res.json();
            map[u.id] = new Set(list.map((ur) => ur.roleId));
          } else {
            map[u.id] = new Set();
          }
        })
      );
      setUserRoles(map);
    } catch (e) {
      console.error(e);
    }
  }

  const createRole = async () => {
    if (!newRoleName.trim()) return;
    const res = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newRoleName, description: newRoleDesc }),
    });
    if (res.ok) {
      setNewRoleName('');
      setNewRoleDesc('');
      await fetchRoles();
      toast({ title: "Success", description: "Role created successfully" });
    } else {
      toast({ title: "Error", description: "Failed to create role", variant: "destructive" });
    }
  };

  const updateRole = async () => {
    if (!editingRoleId || !editRoleName.trim()) return;
    const res = await fetch(`/api/roles/${editingRoleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: editRoleName, description: editRoleDesc }),
    });
    if (res.ok) {
      setEditingRoleId(null);
      setEditRoleName('');
      setEditRoleDesc('');
      await fetchRoles();
      toast({ title: "Success", description: "Role updated successfully" });
    } else {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
    }
  };

  const deleteRole = async (id: number) => {
    const res = await fetch(`/api/roles/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      await fetchRoles();
      toast({ title: "Success", description: "Role deleted successfully" });
    } else {
      toast({ title: "Error", description: "Failed to delete role", variant: "destructive" });
    }
  };

  const addModule = async () => {
    if (!newModuleName.trim()) return;
    const crudActions = ['create', 'read', 'update', 'delete'];
    const promises = crudActions.map(action => 
      fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          name: `${newModuleName}.${action}`, 
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${newModuleName}` 
        }),
      })
    );
    
    const results = await Promise.all(promises);
    const allSuccess = results.every(res => res.ok);
    
    if (allSuccess) {
      setNewModuleName('');
      await fetchPermissions();
      toast({ title: "Success", description: "Module with CRUD permissions created successfully" });
    } else {
      toast({ title: "Error", description: "Failed to create some permissions", variant: "destructive" });
    }
  };

  const toggleRolePermission = async (roleId: number, permissionId: number) => {
    const hasPermission = rolePerms[roleId]?.has(permissionId);
    const method = hasPermission ? 'DELETE' : 'POST';
    const res = await fetch(`/api/roles/${roleId}/permissions/${permissionId}`, {
      method,
      credentials: 'include',
    });
    if (res.ok) {
      await fetchRolePermissions();
      toast({ 
        title: "Success", 
        description: `Permission ${hasPermission ? 'removed from' : 'added to'} role` 
      });
    } else {
      toast({ title: "Error", description: "Failed to update permission", variant: "destructive" });
    }
  };

  const toggleUserRole = async (userId: number, roleId: number) => {
    const hasRole = userRoles[userId]?.has(roleId);
    const method = hasRole ? 'DELETE' : 'POST';
    const res = await fetch(`/api/users/${userId}/roles/${roleId}`, {
      method,
      credentials: 'include',
    });
    if (res.ok) {
      await fetchUserRoles();
      toast({ 
        title: "Success", 
        description: `Role ${hasRole ? 'removed from' : 'assigned to'} user` 
      });
    } else {
      toast({ title: "Error", description: "Failed to update user role", variant: "destructive" });
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.permissions.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = !filterModule || module.name === filterModule;
    return matchesSearch && matchesFilter;
  });

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
                  <SidebarMenuButton isActive={true} tooltip="Roles & Permissions">
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
                  <SidebarMenuButton onClick={() => setLocation('/admin')} tooltip="Content">
                    <FileText />
                    <span>Content</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin/plans')} tooltip="Plans">
                    <CreditCard />
                    <span>Plans</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setLocation('/admin')} tooltip="Settings">
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
                  localStorage.setItem('theme', next ? 'dark' : 'light');
                }}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
                Role & Permission Management
              </h1>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles, modules, or permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">All Modules</option>
                  {modules.map(module => (
                    <option key={module.name} value={module.name}>{module.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{roles.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
                      <Grid className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{modules.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{permissions.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{usersList.length}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {roles.slice(0, 5).map(role => (
                          <div key={role.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-sm text-muted-foreground">{role.description}</div>
                            </div>
                            <Badge variant="secondary">
                              {rolePerms[role.id]?.size || 0} permissions
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Module Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {modules.slice(0, 5).map(module => (
                          <div key={module.name} className="flex items-center justify-between p-2 border rounded">
                            <div className="font-medium">{module.name}</div>
                            <Badge variant="outline">
                              {module.permissions.length} permissions
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="modules" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Module Management</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Module
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Module</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="moduleName">Module Name</Label>
                          <Input
                            id="moduleName"
                            placeholder="e.g., users, products, orders"
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This will create CRUD permissions (create, read, update, delete) for the module.
                        </p>
                        <Button onClick={addModule} className="w-full">
                          Create Module
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                  {filteredModules.map(module => {
                    const predefinedModule = PREDEFINED_MODULES.find(p => p.name === module.name);
                    const IconComponent = predefinedModule?.icon || FileText;
                    const colorClass = predefinedModule?.color || 'bg-gray-500';
                    
                    return (
                      <Card key={module.name} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-semibold">{module.displayName}</div>
                                <div className="text-sm text-muted-foreground font-normal">{module.name}</div>
                              </div>
                            </div>
                            <Badge variant="secondary">{module.permissions.length}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground mb-3">Permissions</div>
                            <div className="grid grid-cols-2 gap-2">
                              {module.permissions.map(permission => {
                                const action = permission.name.split('.')[1];
                                const roleCount = roles.filter(role => rolePerms[role.id]?.has(permission.id)).length;
                                return (
                                  <div key={permission.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                                    <span className="capitalize font-medium">{action}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {roleCount}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="roles" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Role Management</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Role</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="roleName">Role Name</Label>
                          <Input
                            id="roleName"
                            placeholder="e.g., Editor, Manager, Viewer"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="roleDesc">Description</Label>
                          <Textarea
                            id="roleDesc"
                            placeholder="Describe the role's purpose and responsibilities"
                            value={newRoleDesc}
                            onChange={(e) => setNewRoleDesc(e.target.value)}
                          />
                        </div>
                        <Button onClick={createRole} className="w-full">
                          Create Role
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {filteredRoles.map(role => (
                    <Card key={role.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            {editingRoleId === role.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={editRoleName}
                                  onChange={(e) => setEditRoleName(e.target.value)}
                                  placeholder="Role name"
                                />
                                <Input
                                  value={editRoleDesc}
                                  onChange={(e) => setEditRoleDesc(e.target.value)}
                                  placeholder="Description"
                                />
                              </div>
                            ) : (
                              <div>
                                <CardTitle>{role.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{role.description}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {editingRoleId === role.id ? (
                              <>
                                <Button size="sm" onClick={updateRole}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingRoleId(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingRoleId(role.id);
                                    setEditRoleName(role.name);
                                    setEditRoleDesc(role.description || '');
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteRole(role.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Permissions</span>
                            <Badge variant="secondary">
                              {rolePerms[role.id]?.size || 0} assigned
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modules.map(module => (
                              <div key={module.name} className="border rounded-lg p-3">
                                <div className="font-medium mb-2">{module.name}</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {module.permissions.map(permission => {
                                    const hasPermission = rolePerms[role.id]?.has(permission.id);
                                    const action = permission.name.split('.')[1];
                                    return (
                                      <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`${role.id}-${permission.id}`}
                                          checked={hasPermission}
                                          onCheckedChange={() => toggleRolePermission(role.id, permission.id)}
                                        />
                                        <Label
                                          htmlFor={`${role.id}-${permission.id}`}
                                          className="text-sm capitalize"
                                        >
                                          {action}
                                        </Label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="space-y-6">
                <h2 className="text-xl font-semibold">User Role Assignments</h2>
                <div className="space-y-4">
                  {usersList.map(user => (
                    <Card key={user.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{user.displayName || user.username}</CardTitle>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="outline">
                            {userRoles[user.id]?.size || 0} roles
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {roles.map(role => {
                            const hasRole = userRoles[user.id]?.has(role.id);
                            return (
                              <div key={role.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`user-${user.id}-role-${role.id}`}
                                  checked={hasRole}
                                  onCheckedChange={() => toggleUserRole(user.id, role.id)}
                                />
                                <Label
                                  htmlFor={`user-${user.id}-role-${role.id}`}
                                  className="text-sm"
                                >
                                  {role.name}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}