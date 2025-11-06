import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [dbHealthLoading, setDbHealthLoading] = useState(false);
  const [dbHealth, setDbHealth] = useState<{
    connected?: boolean;
    version?: string | null;
    storageType?: string;
    tables?: Record<string, boolean>;
    allTables?: string[];
    otherTables?: string[];
    message?: string;
    error?: string;
  } | null>(null);

  // theme helper
  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  };

  useEffect(() => {
    // initialize from localStorage / system prefs
    try {
      const storedTheme = localStorage.getItem("theme");
      const next = storedTheme ? storedTheme === "dark" : false;
      setIsDark(next);
      applyTheme(next);
    } catch {
      setIsDark(false);
      applyTheme(false);
    }
    try {
      const storedDisplayName = localStorage.getItem("displayName") || "";
      setDisplayName(storedDisplayName);
    } catch {}
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/auth/user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const u = data?.user || null;
          setCurrentUser(u);
          if (!u || u.role !== 'admin') {
            toast({ title: 'Admin required', description: 'Only admins can run DB health checks.', variant: 'destructive' });
            setLocation('/');
          }
        } else {
          setLocation('/login');
        }
      } catch (e) {
        setLocation('/login');
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuth();
  }, [setLocation, toast]);

  const saveSettings = () => {
    try {
      localStorage.setItem("displayName", displayName);
      toast({ title: "Settings saved", description: "Your preferences have been updated." });
    } catch (e) {
      toast({ title: "Failed to save settings", description: "Please try again.", variant: "destructive" });
    }
  };

  const checkDbHealth = async () => {
    setDbHealthLoading(true);
    try {
      const res = await fetch('/api/db/health', { credentials: 'include' });
      if (!res.ok) {
        const msg = res.status === 403
          ? 'Admin access required'
          : res.status === 401
          ? 'Not authenticated'
          : 'Failed to fetch DB health';
        toast({ title: 'DB Health', description: msg, variant: 'destructive' });
        setDbHealth({ connected: false, message: msg });
        setDbHealthLoading(false);
        return;
      }
      const json = await res.json();
      setDbHealth(json);
    } catch (err: any) {
      toast({ title: 'DB Health', description: 'Error contacting server', variant: 'destructive' });
      setDbHealth({ connected: false, message: 'Network error', error: String(err?.message || err) });
    } finally {
      setDbHealthLoading(false);
    }
  };

  return (
    <main className="p-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle the application theme</p>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={(checked) => { setIsDark(checked); applyTheme(checked); }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Schema Check</Label>
                <p className="text-sm text-muted-foreground">Verify required tables exist</p>
              </div>
              <Button disabled={dbHealthLoading} onClick={checkDbHealth}>{dbHealthLoading ? 'Checking…' : 'Check DB'}</Button>
            </div>
            {dbHealth && (
              <div className="space-y-2 text-sm">
                <div>Connected: <span className={dbHealth.connected ? 'text-green-600' : 'text-red-600'}>{String(!!dbHealth.connected)}</span></div>
                {typeof dbHealth.version !== 'undefined' && (
                  <div>Version: <span className="text-muted-foreground">{dbHealth.version || 'unknown'}</span></div>
                )}
                {dbHealth.storageType && (
                  <div>Storage: <span className="text-muted-foreground">{dbHealth.storageType}</span></div>
                )}
                {dbHealth.tables && (
                  <div className="space-y-2">
                    <div className="font-medium">Required tables</div>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        ['users', 'Users'],
                        ['user_roles', 'User Roles'],
                        ['brands', 'Brands'],
                        ['celebrity_brands', 'Celebrity Brands'],
                      ] as const).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="font-medium">{label}</span>
                          <span className={dbHealth.tables![key] ? 'text-green-600' : 'text-red-600'}>{dbHealth.tables![key] ? 'present' : 'missing'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(dbHealth?.allTables) && (
                  <div className="mt-3">
                    <div className="font-medium">All tables (public)</div>
                    {dbHealth!.allTables!.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {dbHealth!.allTables!.map((t) => (
                          <div key={t} className="text-muted-foreground">{t}</div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No tables found in public schema</div>
                    )}
                  </div>
                )}
                {Array.isArray(dbHealth?.otherTables) && dbHealth!.otherTables!.length > 0 && (
                  <div className="mt-3">
                    <div className="font-medium">Other tables</div>
                    <div className="text-muted-foreground break-words">{dbHealth!.otherTables!.join(', ')}</div>
                  </div>
                )}
                {dbHealth.message && (
                  <div className="text-muted-foreground">{dbHealth.message}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your display name" />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveSettings}>Save Settings</Button>
              <Button variant="outline" onClick={() => setLocation('/admin')}>Back to Admin</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}