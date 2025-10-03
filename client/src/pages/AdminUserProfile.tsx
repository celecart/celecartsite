import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserItem {
  id: number;
  username: string;
  role: "user" | "admin";
  permissions: string[];
  imageUrl?: string;
}

export default function AdminUserProfile() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [_, params] = useRoute("/admin/users/:id");
  const userId = params?.id ? parseInt(params.id) : 0;

  const [me, setMe] = useState<UserItem | null>(null);
  const [user, setUser] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("adminTheme");
    return (saved === "light" || saved === "dark") ? (saved as "dark" | "light") : "dark";
  });
  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch all users then pick the one matching userId (since we don't have a single-user admin API yet)
        const usersRes = await fetch("/api/admin/users");
        if (!usersRes.ok) throw new Error("Failed to load users");
        const usersJson = await usersRes.json();
        const found = (usersJson.users as UserItem[]).find(u => u.id === userId) || null;
        if (!found) {
          toast({ title: "Not found", description: `User ${userId} not found`, variant: "destructive" });
        }
        setUser(found);
        setEditUsername(found?.username || "");
      } catch (err: any) {
        console.error(err);
        toast({ title: "Error", description: err.message || "Failed to load user profile", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, toast, userId]);

  React.useEffect(() => {
    return () => {
      if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    };
  }, [editPreviewUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEditImageFile(file);
    if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    if (file) setEditPreviewUrl(URL.createObjectURL(file));
    else setEditPreviewUrl(null);
  };

  const submitEdit = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    try {
      const form = new FormData();
      if (editUsername) form.append("username", editUsername);
      if (editImageFile) form.append("profileImage", editImageFile);
      const res = await fetch(`/api/admin/users/${user.id}/profile`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setUser(updated);
      setEditOpen(false);
    } catch (e: any) {
      setSaveError(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm opacity-80">Loading user profile…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("min-h-screen p-6", theme === "dark" ? "bg-dark text-light" : "bg-white text-gray-900")}> 
        <div className="max-w-3xl mx-auto">
          <Button variant="outline" onClick={() => navigate("/admin")} className={cn(theme === "dark" ? "border-gold/30" : "border-gray-300")}>
            ← Back to Users
          </Button>
          <div className="mt-4 text-sm opacity-70">User not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen p-6", theme === "dark" ? "bg-dark text-light" : "bg-white text-gray-900")}> 
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/admin")} className={cn(theme === "dark" ? "border-gold/30" : "border-gray-300")}>
            ← Back to Users
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className={cn(theme === "dark" ? "text-light hover:bg-darkgray" : "text-gray-700 hover:bg-gray-100")}
          >
            Toggle theme
          </Button>
        </div>

        <Card className={cn(theme === "dark" ? "bg-darkgray border-gold/20" : "bg-white border-gray-200")}> 
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Avatar className={cn("h-12 w-12", theme === "dark" ? "border border-gold/30" : "border border-gray-300") }>
                {user.imageUrl ? (
                  <AvatarImage src={user.imageUrl} alt={user.username} />
                ) : (
                  <AvatarFallback className={cn(theme === "dark" ? "bg-darkgray text-light/80" : "bg-gray-100 text-gray-700") }>
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="font-bold text-lg">{user.username}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs opacity-70">User ID</div>
                <div className="font-mono">{user.id}</div>
              </div>
              <div>
                <div className="text-xs opacity-70">Role</div>
                <div className="font-semibold capitalize">{user.role}</div>
              </div>
            </div>
            <div>
              <div className="text-xs opacity-70 mb-2">Permissions</div>
              <div className="flex flex-wrap gap-2">
                {user.permissions && user.permissions.length > 0 ? (
                  user.permissions.map((p, idx) => (
                    <Badge key={idx} variant="outline" className={cn(theme === "dark" ? "border-gold/30 text-light" : "border-gray-300 text-gray-800")}>{p}</Badge>
                  ))
                ) : (
                  <div className="text-sm opacity-70">No permissions assigned</div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/admin/users/${user.id}/edit`)} className={cn(theme === "dark" ? "border-gold/30" : "border-gray-300")}>
                Edit User (coming soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}