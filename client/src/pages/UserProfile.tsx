import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MeResponse {
  user: { id: number; username: string; role: string; permissions: string[]; imageUrl?: string } | null;
}

export default function UserProfile() {
  const [, navigate] = useLocation();
  const [me, setMe] = useState<MeResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data: MeResponse = await res.json();
        setMe(data.user);
        setEditUsername(data.user?.username || "");
      } catch (e) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    };
  }, [editPreviewUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
    if (editPreviewUrl) URL.revokeObjectURL(editPreviewUrl);
    if (file) setEditPreviewUrl(URL.createObjectURL(file));
    else setEditPreviewUrl(null);
  };

  const submitEdit = async () => {
    if (!me) return;
    try {
      setSaving(true);
      setSaveError(null);
      const form = new FormData();
      if (editUsername) form.append("username", editUsername);
      if (editImageFile) form.append("profileImage", editImageFile);
      const res = await fetch(`/api/auth/profile`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setMe(updated);
      setEditOpen(false);
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }
  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Card className="bg-white/5 border-white/10 p-6">
          <p className="mb-4">You are not signed in.</p>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/signin")}>Sign In</Button>
            <Button variant="secondary" onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0b1220] to-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => navigate("/")}>← Home</Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>Admin</Button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-600/30 via-pink-500/30 to-orange-500/30 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 ring-2 ring-white/20 shadow-md">
              {me.imageUrl ? (
                <AvatarImage src={me.imageUrl} alt={me.username} />
              ) : (
                <AvatarFallback>{me.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{me.username}</h1>
              <p className="mt-1 text-sm text-white/70">User ID #{me.id}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-white/10 text-white">Role: {me.role}</Badge>
                {(me.permissions || []).map((perm, idx) => (
                  <Badge key={idx} variant="outline" className="border-white/20 text-white/80">{perm}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button>Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your username and avatar.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">Username</Label>
                      <Input id="username" className="col-span-3" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="avatar" className="text-right">Avatar</Label>
                      <div className="col-span-3 flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={editPreviewUrl || me.imageUrl || ""} />
                          <AvatarFallback>{me.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <Input id="avatar" type="file" accept="image/*" onChange={onFileChange} />
                      </div>
                    </div>
                    {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setEditOpen(false)} disabled={saving}>Cancel</Button>
                    <Button onClick={submitEdit} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-white/80">
                <div className="flex justify-between"><span>Username</span><span className="font-medium text-white">{me.username}</span></div>
                <div className="flex justify-between"><span>User ID</span><span className="font-medium text-white">{me.id}</span></div>
                <div className="flex justify-between"><span>Role</span><span className="font-medium text-white">{me.role}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(me.permissions || []).length === 0 ? (
                  <p className="text-white/60">No special permissions</p>
                ) : (
                  (me.permissions || []).map((p, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/10 text-white">{p}</Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/70">
                <li>• Logged in</li>
                <li>• Viewed dashboard</li>
                <li>• Updated profile</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}