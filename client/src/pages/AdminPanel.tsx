import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Gauge, Users, Settings, Sun, Moon, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserItem {
  id: number;
  username: string;
  role: "user" | "admin";
  permissions: string[];
  imageUrl?: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [me, setMe] = useState<UserItem | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("adminTheme");
    return (saved === "light" || saved === "dark") ? (saved as "dark" | "light") : "dark";
  });

  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchMeAndUsers = async () => {
      try {
        setLoading(true);
        const meRes = await fetch("/api/auth/me");
        const meJson = await meRes.json();
        const currentUser = meJson.user as (UserItem | null);
        if (!currentUser || currentUser.role !== "admin") {
          toast({ title: "Access denied", description: "Admin access required", variant: "destructive" });
          navigate("/signin");
          return;
        }
        setMe(currentUser);
        const usersRes = await fetch("/api/admin/users");
        if (!usersRes.ok) throw new Error("Failed to load users");
        const usersJson = await usersRes.json();
        setUsers(usersJson.users as UserItem[]);
      } catch (err: any) {
        console.error(err);
        toast({ title: "Error", description: err.message || "Failed to load admin data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchMeAndUsers();
  }, [navigate, toast]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => `${u.username}`.toLowerCase().includes(q) || String(u.id).includes(q));
  }, [users, query]);

  const updateRole = async (id: number, role: "user" | "admin") => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error("Failed to update role");
      const updated = await res.json();
      setUsers((prev) => prev.map(u => u.id === id ? { ...u, role: updated.role } : u));
      toast({ title: "Role updated", description: `User ${updated.username} is now ${updated.role}` });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Could not update role", variant: "destructive" });
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      navigate("/signin");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to sign out", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm opacity-80">Loading admin panel…</div>
      </div>
    );
  }

  return (
    <SidebarProvider className={cn("min-h-screen", theme === "dark" ? "bg-dark text-light" : "bg-white text-gray-900")}> 
      <Sidebar variant="inset" collapsible="icon" className={cn(theme === "dark" ? "bg-darkgray border-r border-gold/20" : "bg-white border-r border-gray-200")}> 
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className={cn("h-8 w-8 rounded-md grid place-items-center font-bold", theme === "dark" ? "bg-gold text-dark" : "bg-amber-500 text-white")}>CE</div>
            <span className="font-semibold">Cele Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <Gauge className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Search</SidebarGroupLabel>
            <SidebarGroupContent>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users by name or ID"
                className={cn("w-full", theme === "dark" ? "bg-midgray border-dark text-light placeholder:text-light/60" : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500")}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-2 text-xs opacity-70">Signed in as {me?.username}</div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className={cn("sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b", theme === "dark" ? "bg-dark/80 backdrop-blur-sm border-gold/20" : "bg-white/80 backdrop-blur-sm border-gray-200")}>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            {me && (
              <Avatar className={cn("h-8 w-8", theme === "dark" ? "border border-gold/30" : "border border-gray-300") }>
                {me.imageUrl ? (
                  <AvatarImage src={me.imageUrl} alt={me.username} />
                ) : (
                  <AvatarFallback className={cn(theme === "dark" ? "bg-darkgray text-light/80" : "bg-gray-100 text-gray-700") }>
                    {me.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className={cn(theme === "dark" ? "text-light hover:bg-darkgray" : "text-gray-700 hover:bg-gray-100")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={signOut} className={cn(theme === "dark" ? "border-gold/30" : "border-gray-300")}>
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Card className={cn(theme === "dark" ? "bg-darkgray border-gold/20" : "bg-white border-gray-200")}> 
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Users</span>
                <span className="text-xs opacity-70">{filteredUsers.length} total</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl">
                <table className={cn("min-w-full text-sm", theme === "dark" ? "bg-dark/50" : "bg-white")}> 
                  <thead className={cn(theme === "dark" ? "bg-dark/70" : "bg-gray-50")}> 
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Username</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className={cn("border-t", theme === "dark" ? "border-gold/20 hover:bg-dark/40" : "border-gray-200 hover:bg-gray-50")}> 
                        <td className="px-4 py-2">{user.id}</td>
                        <td className="px-4 py-2">{user.username}</td>
                        <td className="px-4 py-2">
                          <Select value={user.role} onValueChange={(val) => updateRole(user.id, val as "user" | "admin")}>
                            <SelectTrigger className={cn("w-[140px]", theme === "dark" ? "bg-midgray border-dark text-light" : "bg-white border-gray-300 text-gray-900")}> 
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => updateRole(user.id, user.role === "admin" ? "user" : "admin")}
                              className={cn(theme === "dark" ? "border-gold/30" : "border-gray-300")}
                            >
                              Toggle Role
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                              className={cn(theme === "dark" ? "bg-gold/20 text-light" : "bg-amber-100 text-gray-900")}
                            >
                              View Profile
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}