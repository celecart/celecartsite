import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings, Moon, Sun, Tags, CreditCard, Star, Package, Tag } from "lucide-react";

interface User {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  profilePicture?: string;
  role?: "admin" | "user";
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [permsCount, setPermsCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

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
      loadStats();
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

  async function loadStats() {
    try {
      const [uRes, rRes, pRes] = await Promise.all([
        fetch('/api/users', { credentials: 'include' }),
        fetch('/api/roles', { credentials: 'include' }),
        fetch('/api/permissions', { credentials: 'include' }),
      ]);
      if (uRes.ok) {
        const uData: User[] = await uRes.json();
        setUsersCount(uData.length || 0);
        setRecentUsers(uData.slice(0, 5));
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        setRolesCount((rData || []).length || 0);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setPermsCount((pData || []).length || 0);
      }
    } catch (e) {
      console.error(e);
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
                <SidebarMenuButton isActive={true} onClick={() => setLocation('/admin')} tooltip="Dashboard">
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
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/brands')} tooltip="Brands">
                  <Tag />
                  <span>Brands</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/celebrities')} tooltip="Celebrities">
                  <Star />
                  <span>Celebrities</span>
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
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Welcome to the admin dashboard. Here are your quick insights and controls.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Total Users</CardTitle>
                <Badge variant="secondary">{usersCount}</Badge>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Roles</CardTitle>
                <Badge variant="secondary">{rolesCount}</Badge>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" /> Permissions</CardTitle>
                <Badge variant="secondary">{permsCount}</Badge>
              </CardHeader>
            </Card>
          </div>

          <Card className="hover:shadow-lg transition-shadow mb-6">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentUsers.map((u) => (
                  <li key={u.id} className="flex justify-between text-sm">
                    <span className="font-medium">{u.displayName || u.username}</span>
                    <span className="text-muted-foreground">{u.email}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => setLocation('/admin/users')} className="gap-2"><Users className="h-4 w-4" /> Manage Users</Button>
              <Button onClick={() => setLocation('/admin/roles')} variant="outline" className="gap-2"><ShieldCheck className="h-4 w-4" /> Manage Roles</Button>
              <Button onClick={() => setLocation('/admin/categories')} variant="outline" className="gap-2"><Tags className="h-4 w-4" /> Manage Categories</Button>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}