import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [logoSubtitle, setLogoSubtitle] = useState<string>("Celebrity Style");
  const [featuredLabel, setFeaturedLabel] = useState<string>("Featured");
  const [celebritiesLabel, setCelebritiesLabel] = useState<string>("Celebrities");
  const [trendingNavLabel, setTrendingNavLabel] = useState<string>("Trending");
  const [brandsLabel, setBrandsLabel] = useState<string>("Brands");
  const [plansLabel, setPlansLabel] = useState<string>("Plans");
  const [celeWorldLabel, setCeleWorldLabel] = useState<string>("Cele World");
  const [aiStylistLabel, setAiStylistLabel] = useState<string>("AI Stylist");
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
    try {
      const ls = localStorage;
      const subtitle = ls.getItem("landingNavLogoSubtitle") || "Celebrity Style";
      const featured = ls.getItem("landingNavFeaturedLabel") || "Featured";
      const celebs = ls.getItem("landingNavCelebritiesLabel") || "Celebrities";
      const trending = ls.getItem("landingNavTrendingLabel") || "Trending";
      const brands = ls.getItem("landingNavBrandsLabel") || "Brands";
      const plans = ls.getItem("landingNavPlansLabel") || "Plans";
      const celeWorld = ls.getItem("landingNavCeleWorldLabel") || "Cele World";
      const aiStylist = ls.getItem("landingNavAIStylistLabel") || "AI Stylist";
      setLogoSubtitle(subtitle);
      setFeaturedLabel(featured);
      setCelebritiesLabel(celebs);
      setTrendingNavLabel(trending);
      setBrandsLabel(brands);
      setPlansLabel(plans);
      setCeleWorldLabel(celeWorld);
      setAiStylistLabel(aiStylist);
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

  const saveNavLabels = () => {
    try {
      const ls = localStorage;
      ls.setItem("landingNavLogoSubtitle", logoSubtitle);
      ls.setItem("landingNavFeaturedLabel", featuredLabel);
      ls.setItem("landingNavCelebritiesLabel", celebritiesLabel);
      ls.setItem("landingNavTrendingLabel", trendingNavLabel);
      ls.setItem("landingNavBrandsLabel", brandsLabel);
      ls.setItem("landingNavPlansLabel", plansLabel);
      ls.setItem("landingNavCeleWorldLabel", celeWorldLabel);
      ls.setItem("landingNavAIStylistLabel", aiStylistLabel);
      toast({ title: "Navigation updated", description: "Labels saved. Refresh header if needed." });
    } catch (e) {
      toast({ title: "Failed to save navigation", description: "Please try again.", variant: "destructive" });
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Landing Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Logo subtitle</TableCell>
                    <TableCell>
                      <Input
                        value={logoSubtitle}
                        onChange={(e) => setLogoSubtitle(e.target.value)}
                        placeholder="Celebrity Style"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">Small text under the site logo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Featured section</TableCell>
                    <TableCell>
                      <Input
                        value={featuredLabel}
                        onChange={(e) => setFeaturedLabel(e.target.value)}
                        placeholder="Featured"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">Top picks anchor on landing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Celebrities link</TableCell>
                    <TableCell>
                      <Input
                        value={celebritiesLabel}
                        onChange={(e) => setCelebritiesLabel(e.target.value)}
                        placeholder="Celebrities"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">Navigation link to celebrities page</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Trending section</TableCell>
                    <TableCell>
                      <Input
                        value={trendingNavLabel}
                        onChange={(e) => setTrendingNavLabel(e.target.value)}
                        placeholder="Trending"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">Landing anchor for trending styles; e.g. "Hot"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Brands link</TableCell>
                    <TableCell>
                      <Input
                        value={brandsLabel}
                        onChange={(e) => setBrandsLabel(e.target.value)}
                        placeholder="Brands"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">Navigation link to brands directory</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Plans link</TableCell>
                    <TableCell>
                      <Input
                        value={plansLabel}
                        onChange={(e) => setPlansLabel(e.target.value)}
                        placeholder="Plans"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">Subscription plans page link</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cele World link</TableCell>
                    <TableCell>
                      <Input
                        value={celeWorldLabel}
                        onChange={(e) => setCeleWorldLabel(e.target.value)}
                        placeholder="Cele World"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">News and updates page link</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>AI Stylist link</TableCell>
                    <TableCell>
                      <Input
                        value={aiStylistLabel}
                        onChange={(e) => setAiStylistLabel(e.target.value)}
                        placeholder="AI Stylist"
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">AI assistant for styling page link</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveNavLabels}>Save Navigation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}