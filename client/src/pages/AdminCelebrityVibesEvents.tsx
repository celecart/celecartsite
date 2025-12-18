import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings, Sparkles, Plus, Edit, Trash2, Upload, X, Calendar, Tags, Tag, Star, Package, CreditCard } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";

interface CelebrityVibesEvent {
  id: number;
  name: string;
  description: string;
  eventType: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    color?: string;
    tags?: string[];
    displayOrder?: number;
  } | null;
}

interface EventFormData {
  imageFile: File | null;
  name: string;
  description: string;
  eventType: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
  color: string;
  tags: string;
}

export default function AdminCelebrityVibesEvents() {
  const [events, setEvents] = useState<CelebrityVibesEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CelebrityVibesEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    imageFile: null,
    name: '',
    description: '',
    eventType: 'Festival',
    imageUrl: '',
    startDate: '',
    endDate: '',
    isActive: true,
    isFeatured: false,
    color: '#FF6B6B',
    tags: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const next = stored ? stored === 'dark' : false;
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
      fetchEvents();
    }
  }, [currentUser]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/celebrity-vibes-events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      imageFile: null,
      name: '',
      description: '',
      eventType: 'Festival',
      imageUrl: '',
      startDate: '',
      endDate: '',
      isActive: true,
      isFeatured: false,
      color: '#FF6B6B',
      tags: '',
    });
    setImagePreview(null);
    setEditingEvent(null);
    setErrors({});
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload/event-image', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleCreate = async () => {
    // Reset errors
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.eventType.trim()) {
      newErrors.eventType = "Event type is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (!formData.imageFile && !formData.imageUrl) {
      newErrors.imageUrl = "Event banner image is required";
    }

    // Validate date logic
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    // If there are errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted errors",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      setErrors({});
      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        try {
          imageUrl = await uploadImage(formData.imageFile);
        } catch (uploadError) {
          setErrors({ imageUrl: "Failed to upload image" });
          toast({
            title: "Upload Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }

      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        eventType: formData.eventType.trim(),
        imageUrl,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        metadata: {
          color: formData.color,
          tags,
        }
      };

      const response = await fetch('/api/celebrity-vibes-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        fetchEvents();
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        
        // Check if there are field-specific errors
        if (error.errors && Array.isArray(error.errors)) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err: any) => {
            if (err.path && err.path.length > 0) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          setErrors(fieldErrors);
        }
        
        toast({
          title: "Error",
          description: error.message || "Failed to create event. Please check all fields.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Create event error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingEvent) return;

    // Reset errors
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.eventType.trim()) {
      newErrors.eventType = "Event type is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    // Validate date logic
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    // If there are errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted errors",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      setErrors({});
      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        try {
          imageUrl = await uploadImage(formData.imageFile);
        } catch (uploadError) {
          setErrors({ image: "Failed to upload image" });
          toast({
            title: "Upload Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive"
          });
          return;
        }
      }

      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        eventType: formData.eventType.trim(),
        imageUrl,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        metadata: {
          color: formData.color,
          tags,
        }
      };

      const response = await fetch(`/api/celebrity-vibes-events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        fetchEvents();
        setIsEditModalOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        
        // Check if there are field-specific errors
        if (error.errors && Array.isArray(error.errors)) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err: any) => {
            if (err.path && err.path.length > 0) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          setErrors(fieldErrors);
        }
        
        toast({
          title: "Error",
          description: error.message || "Failed to update event. Please check all fields.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Update event error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event? This will also remove all products associated with it.')) {
      return;
    }

    try {
      const response = await fetch(`/api/celebrity-vibes-events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete event",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (event: CelebrityVibesEvent) => {
    setEditingEvent(event);
    setFormData({
      imageFile: null,
      name: event.name,
      description: event.description,
      eventType: event.eventType,
      imageUrl: event.imageUrl,
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      isActive: event.isActive,
      isFeatured: event.isFeatured,
      color: event.metadata?.color || '#FF6B6B',
      tags: event.metadata?.tags?.join(', ') || '',
    });
    setImagePreview(event.imageUrl);
    setIsEditModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-4">
              <Sparkles className="h-6 w-6 text-primary" />
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
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/users')} tooltip="Users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/roles')} tooltip="Roles & Permissions">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Roles & Permissions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/categories')} tooltip="Categories">
                    <Tags className="h-4 w-4" />
                    <span>Categories</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/brands')} tooltip="Brands">
                    <Tag className="h-4 w-4" />
                    <span>Brands</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/celebrities')} tooltip="Celebrities">
                    <Star className="h-4 w-4" />
                    <span>Celebrities</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={true} onClick={() => setLocation('/admin/celebrity-vibes-events')} tooltip="Cele Vibes Events">
                    <Sparkles className="h-4 w-4" />
                    <span>Cele Vibes Events</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/products')} tooltip="Products">
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin')} tooltip="Content">
                    <FileText className="h-4 w-4" />
                    <span>Content</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/plans')} tooltip="Plans">
                    <CreditCard className="h-4 w-4" />
                    <span>Plans</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={false} onClick={() => setLocation('/admin/settings')} tooltip="Settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-2 flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                Signed in as {currentUser?.displayName || currentUser?.username}
              </div>
              <ThemeToggle />
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Celebrity Vibes Events</h1>
            </div>
            <div className="ml-auto">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Celebrity Vibes Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                        Event Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="e.g., Eid Collection 2024"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => {
                          setFormData({ ...formData, description: e.target.value });
                          if (errors.description) setErrors({ ...errors, description: '' });
                        }}
                        placeholder="Describe the event..."
                        rows={3}
                        className={errors.description ? "border-destructive" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive">{errors.description}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventType" className={errors.eventType ? "text-destructive" : ""}>
                        Event Type *
                      </Label>
                      <Input
                        id="eventType"
                        value={formData.eventType}
                        onChange={(e) => {
                          setFormData({ ...formData, eventType: e.target.value });
                          if (errors.eventType) setErrors({ ...errors, eventType: '' });
                        }}
                        placeholder="e.g., Religious, Award Show, Festival"
                        className={errors.eventType ? "border-destructive" : ""}
                      />
                      {errors.eventType && (
                        <p className="text-sm text-destructive">{errors.eventType}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className={errors.startDate ? "text-destructive" : ""}>
                          Start Date *
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => {
                            setFormData({ ...formData, startDate: e.target.value });
                            if (errors.startDate) setErrors({ ...errors, startDate: '' });
                          }}
                          className={errors.startDate ? "border-destructive" : ""}
                        />
                        {errors.startDate && (
                          <p className="text-sm text-destructive">{errors.startDate}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className={errors.endDate ? "text-destructive" : ""}>
                          End Date *
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => {
                            setFormData({ ...formData, endDate: e.target.value });
                            if (errors.endDate) setErrors({ ...errors, endDate: '' });
                          }}
                          className={errors.endDate ? "border-destructive" : ""}
                        />
                        {errors.endDate && (
                          <p className="text-sm text-destructive">{errors.endDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Theme Color</Label>
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags" className={errors.tags ? "text-destructive" : ""}>Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="e.g., fashion, festival, celebration"
                        className={errors.tags ? "border-destructive" : ""}
                      />
                      {errors.tags && (
                        <p className="text-sm text-destructive">{errors.tags}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image" className={errors.imageUrl ? "text-destructive" : ""}>Event Banner Image *</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className={errors.imageUrl ? "border-destructive" : ""}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        {imagePreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, imageFile: null, imageUrl: '' });
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {errors.imageUrl && (
                        <p className="text-sm text-destructive">{errors.imageUrl}</p>
                      )}
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="isActive">Active</Label>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="isFeatured">Featured</Label>
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={uploading}>
                      {uploading ? 'Creating...' : 'Create Event'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-48 object-cover"
                    />
                    {event.isFeatured && (
                      <Badge className="absolute top-2 right-2" variant="default">
                        Featured
                      </Badge>
                    )}
                    {event.metadata?.color && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: event.metadata.color }}
                      />
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{event.eventType}</Badge>
                          <Badge variant={event.isActive ? "default" : "secondary"}>
                            {event.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                    </div>
                    {event.metadata?.tags && event.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.metadata.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-amber-500 text-amber-700 hover:bg-amber-100 hover:text-amber-700"
                    onClick={() => openEditModal(event)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-white hover:text-white"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
                </Card>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first celebrity vibes event to get started
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Celebrity Vibes Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className={errors.name ? "text-destructive" : ""}>Event Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Eid Collection 2024"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className={errors.description ? "text-destructive" : ""}>Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the event..."
                rows={3}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-eventType" className={errors.eventType ? "text-destructive" : ""}>Event Type *</Label>
              <Input
                id="edit-eventType"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                placeholder="e.g., Religious, Award Show, Festival"
                className={errors.eventType ? "border-destructive" : ""}
              />
              {errors.eventType && (
                <p className="text-sm text-destructive">{errors.eventType}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate" className={errors.startDate ? "text-destructive" : ""}>Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={errors.startDate ? "border-destructive" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate" className={errors.endDate ? "text-destructive" : ""}>End Date *</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={errors.endDate ? "border-destructive" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color" className={errors.color ? "text-destructive" : ""}>Theme Color</Label>
              <Input
                id="edit-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className={errors.color ? "border-destructive" : ""}
              />
              {errors.color && (
                <p className="text-sm text-destructive">{errors.color}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags" className={errors.tags ? "text-destructive" : ""}>Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., fashion, festival, celebration"
                className={errors.tags ? "border-destructive" : ""}
              />
              {errors.tags && (
                <p className="text-sm text-destructive">{errors.tags}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image" className={errors.imageUrl ? "text-destructive" : ""}>Event Banner Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className={errors.imageUrl ? "border-destructive" : ""}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Image
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setImagePreview(editingEvent?.imageUrl || null);
                      setFormData({ ...formData, imageFile: null });
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {errors.imageUrl && (
                <p className="text-sm text-destructive">{errors.imageUrl}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="edit-isActive">Active</Label>
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="edit-isFeatured">Featured</Label>
              <Switch
                id="edit-isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={uploading}>
              {uploading ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
