import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, ShieldCheck, Tags, Settings, Moon, Sun, CreditCard, Plus, Edit, Trash2, Upload, X, Star } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";

interface PlanFeature { label: string; value: string }
interface Plan {
  id: number;
  name: string;
  imageUrl: string;
  price: string;
  discount?: string | null;
  isActive: boolean;
  features: PlanFeature[];
}

interface PlanFormData {
  imageFile: File | null;
  name: string;
  imageUrl: string;
  price: string;
  discount: string;
  isActive: boolean;
  features: PlanFeature[];
}

// Predefined feature toggles with default ON text
const FEATURE_OPTIONS: { label: string; defaultValue: string }[] = [
  { label: 'Monthly Price (PKR)', defaultValue: '' },
  { label: 'Access Level', defaultValue: 'View celebrity profiles & product previews' },
  { label: 'Ads', defaultValue: 'With ads' },
  { label: 'AI Rose Recommendations', defaultValue: 'Basic outfit suggestions' },
  { label: 'Wishlist / Favorites', defaultValue: 'Up to 10' },
  { label: 'Exclusive Drops', defaultValue: 'Early access to celebrity collabs & limited editions' },
  { label: 'Shopping Links', defaultValue: 'Limited product access' },
  { label: 'Content Quality', defaultValue: 'HD images' },
  { label: 'Devices Supported', defaultValue: '2' },
  { label: 'Support Level', defaultValue: 'Standard helpdesk' },
  { label: 'Bonus Perk', defaultValue: '' },
];

function normalizeFeatures(current: PlanFeature[]): PlanFeature[] {
  const byLabel = new Map(current.map((f) => [f.label, f.value]));
  const normalized = FEATURE_OPTIONS.map((opt) => ({
    label: opt.label,
    value: byLabel.has(opt.label) ? (byLabel.get(opt.label) as string) : '----',
  }));
  const extras = current.filter(
    (f) => !FEATURE_OPTIONS.some((opt) => opt.label === f.label)
  );
  return [...normalized, ...extras];
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>({
    imageFile: null,
    name: '',
    imageUrl: '',
    price: '',
    discount: '',
    isActive: true,
    features: FEATURE_OPTIONS.map((opt) => ({ label: opt.label, value: '----' }))
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/auth/user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const u = data?.user || null;
          setCurrentUser(u);
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

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  useEffect(() => {
    if (currentUser) {
      fetchPlans();
    }
  }, [currentUser]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch plans",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Error fetching plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      setFormData({ ...formData, imageFile: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload/plan-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleCreatePlan = async () => {
    try {
      setUploading(true);
      let imageUrl = '';

      // Upload the selected file
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          imageUrl: imageUrl,
          price: formData.price,
          discount: formData.discount || null,
          isActive: formData.isActive,
          features: formData.features
        }),
      });

      if (response.ok) {
        const newPlan = await response.json();
        setPlans([...plans, newPlan]);
        setIsCreateModalOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Plan created successfully"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to create plan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Error creating plan",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditPlan = async () => {
    if (!editingPlan) return;

    try {
      setUploading(true);
      let imageUrl = formData.imageUrl;

      // If a new file is selected, upload it first
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      // For editing, we allow keeping the existing image if no new file is selected
      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Please select an image file or keep the existing image",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/plans/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          imageUrl: imageUrl,
          price: formData.price,
          discount: formData.discount || null,
          isActive: formData.isActive,
          features: formData.features
        }),
      });

      if (response.ok) {
        const updatedPlan = await response.json();
        setPlans(plans.map(plan => plan.id === editingPlan.id ? updatedPlan : plan));
        setIsEditModalOpen(false);
        setEditingPlan(null);
        resetForm();
        toast({
          title: "Success",
          description: "Plan updated successfully"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to update plan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Error updating plan",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlans(plans.filter(plan => plan.id !== planId));
        toast({
          title: "Success",
          description: "Plan deleted successfully"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to delete plan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Error deleting plan",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      imageFile: null,
      name: plan.name,
      imageUrl: plan.imageUrl,
      price: plan.price,
      discount: plan.discount || '',
      isActive: plan.isActive,
      features: normalizeFeatures(plan.features || [])
    });
    setImagePreview(null);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ 
      imageFile: null,
      name: '',
      imageUrl: '', 
      price: '', 
      discount: '',
      isActive: true,
      features: FEATURE_OPTIONS.map((opt) => ({ label: opt.label, value: '----' }))
    });
    setImagePreview(null);
    setEditingPlan(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Dashboard">
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
              {/* <SidebarMenuItem>
                <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/celebrities')} tooltip="Celebrities">
                  <Star />
                  <span>Celebrities</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true} onClick={() => setLocation('/admin/plans')} tooltip="Plans">
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
            Signed in as {currentUser?.displayName || currentUser?.username}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex h-14 items-center gap-3 px-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger />
          <div className="font-bold text-lg">Plans Management</div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Plans</h1>
              <p className="text-muted-foreground">Manage subscription plans and pricing</p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
              </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
              </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Basic, Premium"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="planActive">Active</Label>
                    <Switch id="planActive" checked={formData.isActive} onCheckedChange={(v) => setFormData({ ...formData, isActive: !!v })} />
                  </div>
                  <div>
                    <Label htmlFor="imageUpload">Plan Image</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Choose Image
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {formData.imageFile ? formData.imageFile.name : 'No file selected'}
                        </span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {imagePreview && (
                        <div className="relative w-32 h-20 border rounded overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => {
                              setFormData({ ...formData, imageFile: null });
                              setImagePreview(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="$9.99/month"
                    />
                  </div>
                  <div>
                    <Label>Plan Features</Label>
                    <div className="space-y-3 mt-2">
                      {FEATURE_OPTIONS.map((opt) => {
                        const current = (formData.features || []).find((f) => f.label === opt.label);
                        const enabled = !!current && current.value !== '----';
                        return (
                          <div key={opt.label} className="grid grid-cols-2 gap-2 items-center">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={enabled}
                                onCheckedChange={(checked) => {
                                  const next = normalizeFeatures(formData.features || []);
                                  const idx = next.findIndex((f) => f.label === opt.label);
                                  next[idx] = {
                                    label: opt.label,
                                    value: checked
                                      ? (current && current.value !== '----' ? current.value : opt.defaultValue)
                                      : '----',
                                  };
                                  setFormData({ ...formData, features: next });
                                }}
                              />
                              <span className="text-sm">{opt.label}</span>
                            </div>
                            <Input
                              disabled={!enabled}
                              placeholder={opt.defaultValue || 'Enter value'}
                              value={enabled ? (current?.value ?? '') : '----'}
                              onChange={(e) => {
                                const next = normalizeFeatures(formData.features || []);
                                const idx = next.findIndex((f) => f.label === opt.label);
                                next[idx] = { label: opt.label, value: e.target.value };
                                setFormData({ ...formData, features: next });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount (Optional)</Label>
                    <Input
                      id="discount"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="20% OFF"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePlan} disabled={uploading}>
                      {uploading ? 'Creating...' : 'Create Plan'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={plan.imageUrl}
                      alt="Plan"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA0OEw5MyA1NEw4NyA2MEw4MSA1NEw4NyA0OFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    {plan.discount && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                        {plan.discount}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-lg font-semibold">{plan.price}</div>
                  <div className="flex items-center justify-between mt-1 mb-2">
                    <div className="font-semibold">{plan.name}</div>
                    <Badge variant={plan.isActive ? 'secondary' : 'outline'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <div className="text-sm lg:text-base space-y-2">
                      {plan.features.map((f, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[40%_60%] sm:grid-cols-[35%_65%] gap-x-4 items-start"
                        >
                          <span className="text-muted-foreground min-w-0 break-words" title={f.label}>{f.label}</span>
                          <span className="font-medium min-w-0 break-words leading-tight" title={f.value}>
                            {f.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(plan)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {plans.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No plans found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first plan</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-planName">Plan Name</Label>
                <Input
                  id="edit-planName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="edit-planActive">Active</Label>
                <Switch id="edit-planActive" checked={formData.isActive} onCheckedChange={(v) => setFormData({ ...formData, isActive: !!v })} />
              </div>
              <div>
                <Label htmlFor="edit-imageUpload">Plan Image</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose New Image
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {formData.imageFile ? formData.imageFile.name : 'No new file selected'}
                    </span>
                  </div>
                  {imagePreview && (
                    <div className="relative w-32 h-20 border rounded overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => {
                          setFormData({ ...formData, imageFile: null });
                          setImagePreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {!imagePreview && formData.imageUrl && (
                    <div className="w-32 h-20 border rounded overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Current"
                        className="w-full h-full object-cover"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Current image</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="$9.99/month"
                />
              </div>
              <div>
                <Label>Plan Features</Label>
                <div className="space-y-3 mt-2">
                  {FEATURE_OPTIONS.map((opt) => {
                    const current = (formData.features || []).find((f) => f.label === opt.label);
                    const enabled = !!current && current.value !== '----';
                    return (
                      <div key={opt.label} className="grid grid-cols-2 gap-2 items-center">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => {
                              const next = normalizeFeatures(formData.features || []);
                              const idx = next.findIndex((f) => f.label === opt.label);
                              next[idx] = {
                                label: opt.label,
                                value: checked
                                  ? (current && current.value !== '----' ? current.value : opt.defaultValue)
                                  : '----',
                              };
                              setFormData({ ...formData, features: next });
                            }}
                          />
                          <span className="text-sm">{opt.label}</span>
                        </div>
                        <Input
                          disabled={!enabled}
                          placeholder={opt.defaultValue || 'Enter value'}
                          value={enabled ? (current?.value ?? '') : '----'}
                          onChange={(e) => {
                            const next = normalizeFeatures(formData.features || []);
                            const idx = next.findIndex((f) => f.label === opt.label);
                            next[idx] = { label: opt.label, value: e.target.value };
                            setFormData({ ...formData, features: next });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="edit-discount">Discount (Optional)</Label>
                <Input
                  id="edit-discount"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="20% OFF"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditPlan} disabled={uploading}>
                  {uploading ? 'Updating...' : 'Update Plan'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}