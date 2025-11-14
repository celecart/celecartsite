import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { LayoutDashboard, ShieldCheck, Tag } from "lucide-react";
import type { Brand } from "@shared/schema";

async function fetchBrands(): Promise<Brand[]> {
  const res = await fetch('/api/brands', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

export default function AdminBrandMarketingApi() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/admin/brands/:id/marketing-api');
  const brandId = match && params?.id ? Number(params.id) : undefined;
  const { toast } = useToast();

  const { data: brands, isLoading, error } = useQuery({
    queryKey: ['brands-for-marketing'],
    queryFn: () => fetchBrands(),
  });

  const brandById = useMemo(() => {
    const m = new Map<number, Brand>();
    (brands || []).forEach((b) => m.set(b.id, b));
    return m;
  }, [brands]);

  const brand = typeof brandId === 'number' ? brandById.get(brandId) : undefined;

  const [marketingApi, setMarketingApi] = useState<{ endpoint: string; clientId: string; clientSecret: string }>({ endpoint: "", clientId: "", clientSecret: "" });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  useEffect(() => {
    if (typeof brandId !== 'number') return;
    try {
      const pfx = `marketingApi.${brandId}.`;
      const endpoint = localStorage.getItem(pfx + 'endpoint') || '';
      const clientId = localStorage.getItem(pfx + 'clientId') || '';
      const clientSecret = localStorage.getItem(pfx + 'clientSecret') || '';
      setMarketingApi({ endpoint, clientId, clientSecret });
    } catch {}
  }, [brandId]);

  const saveMarketingApi = () => {
    if (typeof brandId !== 'number') {
      toast({ title: 'Select brand', description: 'Invalid brand.', variant: 'destructive' });
      return;
    }
    try {
      const pfx = `marketingApi.${brandId}.`;
      localStorage.setItem(pfx + 'endpoint', marketingApi.endpoint);
      localStorage.setItem(pfx + 'clientId', marketingApi.clientId);
      localStorage.setItem(pfx + 'clientSecret', marketingApi.clientSecret);
      toast({ title: 'Saved', description: 'Marketing API settings saved.' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save Marketing API settings.', variant: 'destructive' });
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult("");
    try {
      if (!marketingApi.endpoint) {
        setTestResult('Set API endpoint first');
        return;
      }
      const res = await fetch(marketingApi.endpoint, { method: 'GET' });
      setTestResult(`Status ${res.status}`);
    } catch (e: any) {
      setTestResult(`Error: ${String(e?.message || e)}`);
    } finally {
      setTesting(false);
    }
  };

  const curl = `curl -X POST \\
"${marketingApi.endpoint || 'https://api.example.com/marketing'}" \\
-H "Content-Type: application/json" \\
-H "X-Client-Id: ${marketingApi.clientId || '<client-id>'}" \\
-H "X-Client-Secret: ${marketingApi.clientSecret || '<client-secret>'}" \\
-d '{"action":"create_campaign","name":"Brand Promo"}'`;

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
                  <SidebarMenuButton onClick={() => setLocation('/admin/brands')} tooltip="Brands">
                    <Tag />
                    <span>Brands</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            {brand ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {brand.imageUrl ? <AvatarImage src={brand.imageUrl} alt={brand.name} /> : <AvatarFallback>{(brand.name || 'B')[0].toUpperCase()}</AvatarFallback>}
                </Avatar>
                <div className="font-semibold">{brand.name}</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Loading brand…</div>
            )}
            <div className="ml-auto" />
          </header>
          <main className="p-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
                  {error && <div className="text-sm text-destructive">Failed to load brand list</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="endpoint">API endpoint</Label>
                      <Input id="endpoint" placeholder="https://api.example.com/marketing" value={marketingApi.endpoint} onChange={(e)=> setMarketingApi((p)=> ({...p, endpoint: e.target.value}))} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="clientId">Client ID</Label>
                      <Input id="clientId" placeholder="Enter client id" value={marketingApi.clientId} onChange={(e)=> setMarketingApi((p)=> ({...p, clientId: e.target.value}))} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="clientSecret">Client Secret</Label>
                      <Input id="clientSecret" type="password" placeholder="Enter client secret" value={marketingApi.clientSecret} onChange={(e)=> setMarketingApi((p)=> ({...p, clientSecret: e.target.value}))} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveMarketingApi} disabled={typeof brandId !== 'number'}>Save Settings</Button>
                    <Button variant="outline" onClick={testConnection} disabled={testing || !marketingApi.endpoint}>{testing ? 'Testing…' : 'Test Connection'}</Button>
                  </div>
                  {testResult && <div className="text-sm text-muted-foreground">{testResult}</div>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Topic</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Authentication</TableCell>
                          <TableCell>Use Client ID and Secret as headers for requests.</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Endpoints</TableCell>
                          <TableCell>Base URL is the API endpoint above (e.g., campaigns, analytics).</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Request Format</TableCell>
                          <TableCell>JSON body with action-specific fields.</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Errors</TableCell>
                          <TableCell>Non-200 responses include error messages and codes.</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div>
                    <Label>Example cURL</Label>
                    <pre className="mt-2 p-3 rounded-md bg-muted text-sm overflow-auto">
{curl}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}