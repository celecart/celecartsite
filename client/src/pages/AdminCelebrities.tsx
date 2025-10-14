import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, ShieldCheck, Tags, Settings, Plus, Edit, Trash2, Sun, Moon, CreditCard, Upload, X, Star } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { FallbackImage } from '@/components/ui/fallback-image';

interface Celebrity {
  id: number;
  name: string;
  profession: string;
  imageUrl: string;
  description?: string;
  category: string;
  isElite: boolean;
  managerInfo?: {
    name: string;
    agency: string;
    email: string;
    phone: string;
    bookingInquiries: string;
  } | null;
  stylingDetails?: Array<{
    occasion: string;
    outfit: {
      designer: string;
      price: string;
      details: string;
      purchaseLink?: string;
    };
    hairStylist?: {
      name: string;
      instagram?: string;
      website?: string;
      details?: string;
    };
    makeupArtist?: {
      name: string;
      instagram?: string;
      website?: string;
      details?: string;
    };
    image?: string;
  }> | null;
}

interface CelebrityFormData {
  name: string;
  profession: string;
  imageUrl: string;
  description: string;
  category: string;
  isElite: boolean;
}

export default function AdminCelebrities() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCelebrity, setEditingCelebrity] = useState<Celebrity | null>(null);
  const [previewCelebrity, setPreviewCelebrity] = useState<Celebrity | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [formData, setFormData] = useState<CelebrityFormData>({
    name: '',
    profession: '',
    imageUrl: '',
    description: '',
    category: '',
    isElite: false
  });
  const [uploading, setUploading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Red Carpet',
    'Street Style',
    'Sports',
    'Music',
    'Acting',
    'Fashion',
    'Business',
    'Social Media'
  ];

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
      fetchCelebrities();
    }
  }, [currentUser]);

  const fetchCelebrities = async () => {
    try {
      const response = await fetch('/api/celebrities');
      if (response.ok) {
        const data = await response.json();
        setCelebrities(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch celebrities",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching celebrities:', error);
      toast({
        title: "Error",
        description: "Error fetching celebrities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCelebrity = async () => {
    try {
      setUploading(true);

      if (!formData.name || !formData.profession || !formData.imageUrl || !formData.category) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/celebrities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newCelebrity = await response.json();
        setCelebrities([...celebrities, newCelebrity]);
        setIsCreateModalOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Celebrity created successfully"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to create celebrity",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating celebrity:', error);
      toast({
        title: "Error",
        description: "Error creating celebrity",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditCelebrity = async () => {
    if (!editingCelebrity) return;

    try {
      setUploading(true);

      if (!formData.name || !formData.profession || !formData.imageUrl || !formData.category) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/celebrities/${editingCelebrity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedCelebrity = await response.json();
        setCelebrities(celebrities.map(celebrity => celebrity.id === editingCelebrity.id ? updatedCelebrity : celebrity));
        setIsEditModalOpen(false);
        setEditingCelebrity(null);
        resetForm();
        toast({
          title: "Success",
          description: "Celebrity updated successfully"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to update celebrity",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating celebrity:', error);
      toast({
        title: "Error",
        description: "Error updating celebrity",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCelebrity = async (id: number) => {
    if (!confirm('Are you sure you want to delete this celebrity?')) return;

    try {
      const response = await fetch(`/api/celebrities/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCelebrities(celebrities.filter(celebrity => celebrity.id !== id));
        toast({
          title: "Success",
          description: "Celebrity deleted successfully"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to delete celebrity",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting celebrity:', error);
      toast({
        title: "Error",
        description: "Error deleting celebrity",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (celebrity: Celebrity) => {
    setEditingCelebrity(celebrity);
    setFormData({
      name: celebrity.name,
      profession: celebrity.profession,
      imageUrl: celebrity.imageUrl,
      description: celebrity.description || '',
      category: celebrity.category,
      isElite: celebrity.isElite
    });
    setIsEditModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Error", 
        description: "Image size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await fetch('/api/upload/celebrity-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImagePreview = (celebrity: Celebrity) => {
    setPreviewCelebrity(celebrity);
    setIsPreviewModalOpen(true);
  };

  const handleDownloadImage = async (imageUrl: string, celebrityName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${celebrityName.replace(/\s+/g, '_')}_photo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Image downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive"
      });
    }
  };

  const handleOpenImageSource = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const resetForm = () => {
    setFormData({ 
      name: '',
      profession: '',
      imageUrl: '',
      description: '',
      category: '',
      isElite: false
    });
    setEditingCelebrity(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/admin">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin Panel</span>
                    <span className="truncate text-xs">CeleCart</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin">
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/users">
                    <Users className="size-4" />
                    <span>Users</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="bg-sidebar-accent text-sidebar-accent-foreground">
                  <a href="/admin/celebrities">
                    <Star className="size-4" />
                    <span>Celebrities</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/plans">
                    <CreditCard className="size-4" />
                    <span>Plans</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/categories">
                    <Tags className="size-4" />
                    <span>Categories</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={toggleTheme}>
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/admin/settings">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Celebrities Management</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Celebrities</h2>
              <p className="text-muted-foreground">Manage celebrity profiles and information</p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Celebrity
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Celebrity</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Celebrity name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="profession">Profession *</Label>
                      <Input
                        id="profession"
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                        placeholder="e.g., Actor, Singer, Athlete"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Celebrity Image *</Label>
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                          >
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </Button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      {formData.imageUrl && (
                        <div className="relative">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description about the celebrity"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isElite"
                      checked={formData.isElite}
                      onCheckedChange={(checked) => setFormData({ ...formData, isElite: checked as boolean })}
                    />
                    <Label htmlFor="isElite">Elite Profile</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCelebrity} disabled={uploading}>
                    {uploading ? 'Creating...' : 'Create Celebrity'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {celebrities.map((celebrity) => (
              <Card key={celebrity.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold" style={{ fontDisplay: 'swap', willChange: 'auto' }}>{celebrity.name}</CardTitle>
                    {celebrity.isElite && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Elite
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{celebrity.profession}</p>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="aspect-square relative mb-2">
                    <FallbackImage
                      src={celebrity.imageUrl}
                      alt={celebrity.name}
                      className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      fallbackSrc="/placeholder-celebrity.svg"
                      fallbackText={`${celebrity.name} photo unavailable`}
                      onClick={() => handleImagePreview(celebrity)}
                    />
                  </div>
                  <Badge variant="outline" className="mb-2">
                    {celebrity.category}
                  </Badge>
                  {celebrity.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {celebrity.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(celebrity)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCelebrity(celebrity.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {celebrities.length === 0 && (
            <div className="text-center py-12">
              <Star className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No celebrities</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new celebrity profile.</p>
            </div>
          )}

          {/* Edit Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Celebrity</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Name *</Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Celebrity name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-profession">Profession *</Label>
                    <Input
                      id="edit-profession"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      placeholder="e.g., Actor, Singer, Athlete"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Celebrity Image *</Label>
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    {formData.imageUrl && (
                      <div className="relative">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description about the celebrity"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-isElite"
                    checked={formData.isElite}
                    onCheckedChange={(checked) => setFormData({ ...formData, isElite: checked as boolean })}
                  />
                  <Label htmlFor="edit-isElite">Elite Profile</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCelebrity} disabled={uploading}>
                  {uploading ? 'Updating...' : 'Update Celebrity'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Image Preview Modal */}
          <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {previewCelebrity?.name} - Image Preview
                </DialogTitle>
              </DialogHeader>
              {previewCelebrity && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative max-w-2xl">
                      <FallbackImage
                        src={previewCelebrity.imageUrl}
                        alt={previewCelebrity.name}
                        className="w-full h-auto max-h-[60vh] object-contain rounded-lg border"
                        fallbackSrc="/placeholder-celebrity.svg"
                        fallbackText={`${previewCelebrity.name} photo unavailable`}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => handleDownloadImage(previewCelebrity.imageUrl, previewCelebrity.name)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Image
                    </Button>
                    
                    <Button
                      onClick={() => handleOpenImageSource(previewCelebrity.imageUrl)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open Source
                    </Button>
                    
                    <Button
                      onClick={() => setIsPreviewModalOpen(false)}
                      variant="secondary"
                    >
                      Close
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p><strong>Name:</strong> {previewCelebrity.name}</p>
                    <p><strong>Profession:</strong> {previewCelebrity.profession}</p>
                    <p><strong>Category:</strong> {previewCelebrity.category}</p>
                    {previewCelebrity.description && (
                      <p><strong>Description:</strong> {previewCelebrity.description}</p>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}