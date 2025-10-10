import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings, Moon, Sun, Tags } from "lucide-react";

interface User {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  profilePicture?: string;
  role?: "admin" | "user";
}

export default function AdminRoles() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<"dashboard" | "users" | "roles" | "content" | "settings">("roles");
  const [isDark, setIsDark] = useState(false);
  const [roles, setRoles] = useState<Array<{ id: number; name: string; description?: string | null }>>([]);
  const [permissions, setPermissions] = useState<Array<{ id: number; name: string; description?: string | null }>>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  // NEW: module name input for creating CRUD permissions
  const [newModuleName, setNewModuleName] = useState("");
  const { toast } = useToast();
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDesc, setEditRoleDesc] = useState("");
  const [rolePerms, setRolePerms] = useState<Record<number, Set<number>>>({});
  const [userRoles, setUserRoles] = useState<Record<number, Set<number>>>({});

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

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        setLocation('/');
      }
    } catch {}
  };

  async function loadAll() {
    try {
      await Promise.all([fetchRoles(), fetchPermissions(), fetchUsers()]);
      await fetchRolePermissions();
      await fetchUserRoles();
    } catch (e) {
      console.error(e);
    }
  }

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

  // NEW: fetch role-permission mappings for all roles
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

  // NEW: toggle a permission for a role
  async function toggleRolePermission(roleId: number, permissionId: number, enable: boolean) {
    try {
      if (enable) {
        const res = await fetch(`/api/roles/${roleId}/permissions/${permissionId}`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to add permission');
        setRolePerms((prev) => {
          const next = { ...prev };
          next[roleId] = new Set(next[roleId] || new Set());
          next[roleId].add(permissionId);
          return next;
        });
      } else {
        const res = await fetch(`/api/roles/${roleId}/permissions/${permissionId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to remove permission');
        setRolePerms((prev) => {
          const next = { ...prev };
          next[roleId] = new Set(next[roleId] || new Set());
          next[roleId].delete(permissionId);
          return next;
        });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: String(e?.message || e), variant: 'destructive' });
    }
  }

  // NEW: fetch user-role mappings
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

  // NEW: assign role to user
  async function assignRoleToUser(userId: number, roleId: number) {
    try {
      const res = await fetch(`/api/users/${userId}/roles/${roleId}`, { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to assign role');
      setUserRoles((prev) => {
        const next = { ...prev };
        next[userId] = new Set(next[userId] || new Set());
        next[userId].add(roleId);
        return next;
      });
    } catch (e: any) {
      toast({ title: 'Error', description: String(e?.message || e), variant: 'destructive' });
    }
  }

  // NEW: remove role from user
  async function removeRoleFromUser(userId: number, roleId: number) {
    try {
      const res = await fetch(`/api/users/${userId}/roles/${roleId}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to remove role');
      setUserRoles((prev) => {
        const next = { ...prev };
        next[userId] = new Set(next[userId] || new Set());
        next[userId].delete(roleId);
        return next;
      });
    } catch (e: any) {
      toast({ title: 'Error', description: String(e?.message || e), variant: 'destructive' });
    }
  }

  // NEW: create, update, delete role
  async function createRole() {
    try {
      if (!newRoleName.trim()) {
        toast({ title: 'Role name required', description: 'Please enter a role name', variant: 'destructive' });
        return;
      }
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newRoleName.trim(), description: newRoleDesc || null }),
      });
      if (!res.ok) throw new Error('Failed to create role');
      setNewRoleName("");
      setNewRoleDesc("");
      await fetchRoles();
      await fetchRolePermissions();
      toast({ title: 'Role created', description: 'New role has been added' });
    } catch (e: any) {
      toast({ title: 'Error', description: String(e?.message || e), variant: 'destructive' });
    }
  }

  async function updateRole(id: number) {
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: editRoleName.trim(), description: editRoleDesc || null }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      setEditingRoleId(null);
      await fetchRoles();
      toast({ title: 'Role updated', description: 'Role details saved' });
    } catch (e: any) {
      toast({ title: 'Error', description: String(e?.message || e), variant: 'destructive' });
    }
  }

  async function deleteRole(id: number) {
    try {
      const res = await fetch(`/api/roles/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete role');
      await fetchRoles();
      await fetchRolePermissions();
      toast({ title: 'Role deleted', description: 'Role has been removed' });
    } catch (e: any) {
      toast({ title: 'Error', description: String(e?.message || e), variant: 'destructive' });
    }
  }

  // NEW: add a module = create CRUD permissions for given module name
  async function addModule() {
    try {
      const name = newModuleName.trim().toLowerCase();
      if (!name) {
        toast({ title: 'Module name required', description: 'Enter a module name like users, roles, content', variant: 'destructive' });
        return;
      }
      const actions = ['view', 'create', 'edit', 'delete'] as const;
      for (const action of actions) {
        const res = await fetch('/api/permissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: `${name}.${action}`, description: `${action} permission for ${name}` }),
        });
        if (!res.ok) throw new Error(`Failed to create permission: ${name}.${action}`);
      }
      setNewModuleName("");
      await fetchPermissions();
      await fetchRolePermissions();
      toast({ title: 'Module added', description: 'CRUD permissions created' });
    } catch (e: any) {
      toast({ title: 'Error', description: String(e?.message || e), variant: 'destructive' });
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
                <SidebarMenuButton isActive={active === 'dashboard'} onClick={() => setLocation('/admin')} tooltip="Dashboard">
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
                <SidebarMenuButton isActive={active === 'roles'} onClick={() => setLocation('/admin/roles')} tooltip="Roles & Permissions">
                  <ShieldCheck />
                  <span>Roles & Permissions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === 'content'} onClick={() => setActive('content')} tooltip="Content">
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
                <SidebarMenuButton isActive={active === 'settings'} onClick={() => setActive('settings')} tooltip="Settings">
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
            <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" onClick={() => setLocation('/')}>Go to Site</Button>
            <Button variant="ghost" onClick={handleLogout}>Sign out</Button>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Admin access is restricted. Only users with the Admin role can view this panel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-card">
              <h2 className="text-lg font-semibold mb-2">Roles</h2>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Input placeholder="Role name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                  <Input placeholder="Description" value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)} />
                  <Button onClick={createRole}>Add Role</Button>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                {roles.map((r) => (
                  <li key={r.id} className="flex items-center justify-between">
                    {editingRoleId === r.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input value={editRoleName} onChange={(e) => setEditRoleName(e.target.value)} />
                        <Input value={editRoleDesc} onChange={(e) => setEditRoleDesc(e.target.value)} />
                        <Button size="sm" onClick={() => updateRole(r.id)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingRoleId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="font-medium">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingRoleId(r.id); setEditRoleName(r.name); setEditRoleDesc(r.description || ""); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteRole(r.id)}>Delete</Button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
                {roles.length === 0 && <li className="text-muted-foreground">No roles yet</li>}
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <h2 className="text-lg font-semibold mb-2">Modules</h2>
              <div className="flex items-center gap-2 mb-3">
                <Input placeholder="Module name (e.g., users)" value={newModuleName} onChange={(e) => setNewModuleName(e.target.value)} />
                <Button onClick={addModule}>Add Module</Button>
              </div>
              <ul className="space-y-2 text-sm">
                {Array.from(new Set(permissions.map((p) => p.name.split('.')[0]))).map((m) => (
                  <li key={m} className="flex items-center justify-between">
                    <span className="font-medium">{m}</span>
                    <span className="text-muted-foreground">{permissions.filter((p) => p.name.startsWith(`${m}.`)).length} permissions</span>
                  </li>
                ))}
                {permissions.length === 0 && <li className="text-muted-foreground">No modules/permissions yet</li>}
              </ul>
            </div>
          </div>

          <div className="mt-6 border rounded-lg p-4 bg-card">
            <h2 className="text-lg font-semibold mb-2">Role Assignments</h2>
            <div className="space-y-4">
              {roles.map(role => (
                <div key={role.id} className="border rounded-md p-3">
                  <div className="font-medium mb-2">{role.name}</div>
                  {/* Group permissions by module and show CRUD checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(
                      permissions.reduce<Record<string, { [action: string]: { id: number; name: string } }>>((acc, p) => {
                        const [module, action] = p.name.split('.');
                        if (!module || !action) return acc;
                        if (!acc[module]) acc[module] = {};
                        acc[module][action] = { id: p.id, name: p.name };
                        return acc;
                      }, {})
                    ).map(([module, actions]) => (
                      <div key={module} className="border rounded p-2">
                        <div className="text-sm font-semibold mb-2">{module}</div>
                        <div className="grid grid-cols-2 gap-2">
                          {(['view','create','edit','delete'] as const).map((a) => (
                            <label key={a} className="flex items-center gap-2 text-sm">
                              <Checkbox
                                checked={!!rolePerms[role.id]?.has(actions[a]?.id ?? -1)}
                                onCheckedChange={(val) => {
                                  const pid = actions[a]?.id;
                                  if (pid) toggleRolePermission(role.id, pid, !!val);
                                }}
                              />
                              <span className="capitalize">{a}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    {Object.keys(permissions.reduce((acc, p) => { const [m,a]=p.name.split('.'); if(m&&a){(acc as any)[m]=true;} return acc; }, {})).length === 0 && (
                      <div className="text-sm text-muted-foreground">No modules found. Add modules to configure permissions.</div>
                    )}
                  </div>
                </div>
              ))}
              {roles.length === 0 && (
                <div className="text-sm text-muted-foreground">Create roles to assign permissions.</div>
              )}
            </div>
          </div>
          {active === 'users' && (
            <div className="mt-6 border rounded-lg p-4 bg-card">
              <h2 className="text-lg font-semibold mb-2">User Role Assignments</h2>
              <div className="space-y-3">
                {usersList.map(u => (
                  <div key={u.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">{u.displayName || u.username}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded px-2 py-1 bg-background"
                          onChange={(e) => {
                            const rid = Number(e.target.value);
                            if (!isNaN(rid)) assignRoleToUser(u.id, rid);
                            e.currentTarget.selectedIndex = 0;
                          }}
                        >
                          <option value="">Assign role...</option>
                          {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(userRoles[u.id] || new Set()).map(rid => {
                        const r = roles.find(rr => rr.id === rid);
                        if (!r) return null;
                        return (
                          <div key={rid} className="flex items-center gap-2 text-xs border rounded px-2 py-1">
                            <span>{r.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeRoleFromUser(u.id, rid)}>Remove</Button>
                          </div>
                        );
                      })}
                      {(!userRoles[u.id] || (userRoles[u.id]?.size || 0) === 0) && (
                        <div className="text-xs text-muted-foreground">No roles assigned</div>
                      )}
                    </div>
                  </div>
                ))}
                {usersList.length === 0 && (
                  <div className="text-sm text-muted-foreground">No users found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}