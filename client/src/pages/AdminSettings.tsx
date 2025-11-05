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

  const saveSettings = () => {
    try {
      localStorage.setItem("displayName", displayName);
      toast({ title: "Settings saved", description: "Your preferences have been updated." });
    } catch (e) {
      toast({ title: "Failed to save settings", description: "Please try again.", variant: "destructive" });
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