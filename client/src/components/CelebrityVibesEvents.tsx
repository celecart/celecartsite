import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import MultiImageUpload from '@/components/MultiImageUpload';
import { Sparkles, Calendar, Plus, Package, Trash2, Check, ShoppingBag, Edit2, Power, PowerOff, Eye, EyeOff, CheckCircle, XCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CelebrityVibesEvent {
  id: number;
  name: string;
  description: string;
  eventType: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
  metadata?: {
    color?: string;
    tags?: string[];
  };
}

interface CelebrityBrand {
  id: number;
  celebrityId: number;
  brandId: number;
  itemType: string;
  description: string;
  imageUrl?: string;
  brand?: {
    id: number;
    name: string;
  };
}

interface EventProduct {
  id: number;
  eventId: number;
  celebrityId: number;
  productId: number;
  displayOrder: number;
  isActive: boolean;
  notes?: string;
  product?: CelebrityBrand;
}

interface Props {
  celebrityId: number;
  isOwnProfile: boolean;
}

export default function CelebrityVibesEvents({ celebrityId, isOwnProfile }: Props) {
  const [, navigate] = useLocation();
  const [events, setEvents] = useState<CelebrityVibesEvent[]>([]);
  const [eventProducts, setEventProducts] = useState<Record<number, EventProduct[]>>({});
  const [availableProducts, setAvailableProducts] = useState<CelebrityBrand[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CelebrityVibesEvent | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [viewingEvent, setViewingEvent] = useState<CelebrityVibesEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addProductTab, setAddProductTab] = useState<'existing' | 'new'>('existing');
  const [newProduct, setNewProduct] = useState({
    brandName: '',
    itemType: '',
    description: '',
    imageUrl: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productImagesUploading, setProductImagesUploading] = useState(false);
  const [eventImageUploading, setEventImageUploading] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    eventType: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
  });
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CelebrityVibesEvent | null>(null);
  const [showEditEventDialog, setShowEditEventDialog] = useState(false);
  const [updatingEvent, setUpdatingEvent] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EventProduct | null>(null);
  const [showEditProductDialog, setShowEditProductDialog] = useState(false);
  const [productNotes, setProductNotes] = useState('');
  const [productDisplayOrder, setProductDisplayOrder] = useState(0);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [addingProducts, setAddingProducts] = useState(false);
  const [editingCelebrityBrand, setEditingCelebrityBrand] = useState<CelebrityBrand | null>(null);
  const [showEditBrandDialog, setShowEditBrandDialog] = useState(false);
  const [editBrandForm, setEditBrandForm] = useState({
    itemType: '',
    description: '',
  });
  const [editBrandErrors, setEditBrandErrors] = useState({
    itemType: '',
    description: '',
  });
  const [updatingBrand, setUpdatingBrand] = useState(false);
  const { toast } = useToast();
  

  useEffect(() => {
    fetchEvents();
    if (isOwnProfile) {
      fetchAvailableProducts();
    }
  }, [celebrityId, isOwnProfile]);

  useEffect(() => {
    if (viewingEvent) {
      fetchEventProducts(viewingEvent.id);
    }
  }, [viewingEvent]);

  const fetchEvents = async () => {
    try {
      const url = isOwnProfile 
        ? '/api/celebrity-vibes-events' 
        : '/api/celebrity-vibes-events?active=true';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        
        for (const event of data) {
          fetchEventProducts(event.id);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProductImagesSelected = async (files: FileList | File[] | null) => {
    if (!files || (files as any).length === 0) return;
    setProductImagesUploading(true);
    try {
      const formData = new FormData();
      // Allow multiple, but we will use the first URL for this form
      const first = (files as any)[0] as File;
      formData.append('images', first);
      const res = await fetch('/api/upload/product-images', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to upload product image');
      }
      const data = await res.json();
      const firstUrl = Array.isArray(data.imageUrls) ? data.imageUrls[0] : '';
      if (!firstUrl) throw new Error('Upload succeeded but no image URL returned');
      setNewProduct(prev => ({ ...prev, imageUrl: firstUrl }));
      toast({ title: 'Image uploaded', description: 'Product image is ready.' });
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e?.message || 'Could not upload product image', variant: 'destructive' });
    } finally {
      setProductImagesUploading(false);
    }
  };

  const handleEventImageSelected = async (files: FileList | File[] | null) => {
    if (!files || (files as any).length === 0) return;
    setEventImageUploading(true);
    try {
      const formData = new FormData();
      const first = (files as any)[0] as File;
      formData.append('image', first);
      const res = await fetch('/api/upload/event-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to upload event image');
      }
      const data = await res.json();
      const url = data.url || '';
      if (!url) throw new Error('Upload succeeded but no image URL returned');
      setNewEvent(prev => ({ ...prev, imageUrl: url }));
      toast({ title: 'Image uploaded', description: 'Event image is ready.' });
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e?.message || 'Could not upload event image', variant: 'destructive' });
    } finally {
      setEventImageUploading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.name || !newEvent.eventType || !newEvent.startDate || !newEvent.endDate) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setCreatingEvent(true);
    try {
      const response = await fetch('/api/celebrity-vibes-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newEvent.name,
          description: newEvent.description,
          eventType: newEvent.eventType,
          imageUrl: newEvent.imageUrl,
          startDate: newEvent.startDate,
          endDate: newEvent.endDate,
          isActive: true,
          isFeatured: false,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to create event');
      }

      toast({
        title: 'Success',
        description: `Event "${newEvent.name}" created successfully`,
      });

      await fetchEvents();
      setNewEvent({ name: '', description: '', eventType: '', imageUrl: '', startDate: '', endDate: '' });
      setShowCreateEventDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create event. You may not have permission.',
        variant: 'destructive',
      });
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleEditEvent = (event: CelebrityVibesEvent) => {
    setEditingEvent(event);
    setNewEvent({
      name: event.name,
      description: event.description,
      eventType: event.eventType,
      imageUrl: event.imageUrl || '',
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
    });
    setShowEditEventDialog(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !newEvent.name || !newEvent.eventType || !newEvent.startDate || !newEvent.endDate) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setUpdatingEvent(true);
    try {
      const response = await fetch(`/api/celebrity-vibes-events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newEvent.name,
          description: newEvent.description,
          eventType: newEvent.eventType,
          imageUrl: newEvent.imageUrl,
          startDate: newEvent.startDate,
          endDate: newEvent.endDate,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to update event');
      }

      toast({ title: 'Success', description: `Event "${newEvent.name}" updated successfully` });
      await fetchEvents();
      setShowEditEventDialog(false);
      setEditingEvent(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to update event. You may not have permission.', variant: 'destructive' });
    } finally {
      setUpdatingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId: number, eventName: string) => {
    const confirmed = window.confirm(`Delete event "${eventName}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/celebrity-vibes-events/${eventId}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to delete event');
      }
      toast({ title: 'Deleted', description: `Event "${eventName}" deleted` });
      await fetchEvents();
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to delete event. You may not have permission.', variant: 'destructive' });
    }
  };

  const fetchEventProducts = async (eventId: number) => {
    try {
      setLoadingProducts(true);
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/celebrity-vibes-events/${eventId}/products?celebrityId=${celebrityId}&_t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEventProducts(prev => ({ ...prev, [eventId]: data }));
      }
    } catch (error) {
      console.error('Error fetching event products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const response = await fetch(`/api/celebritybrands/${celebrityId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableProducts(data);
      }
    } catch (error) {
      console.error('Error fetching available products:', error);
    }
  };

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddExistingProducts = async () => {
    if (!selectedEvent || selectedProducts.length === 0) return;

    setAddingProducts(true);
    try {
      const promises = selectedProducts.map(productId =>
        fetch(`/api/celebrity-vibes-events/${selectedEvent.id}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            celebrityId: celebrityId,
            productId: productId,
            displayOrder: 0,
            notes: ''
          }),
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.ok).length;

      if (successCount > 0) {
        toast({
          title: "Products added successfully",
          description: `${successCount} product(s) added to ${selectedEvent.name}`,
        });
        await fetchEventProducts(selectedEvent.id);
        setSelectedProducts([]);
        setShowAddDialog(false);
      } else {
        throw new Error("Failed to add any products");
      }
    } catch (error) {
      console.error('Error adding products:', error);
      toast({
        title: "Error adding products",
        description: "Failed to add products to event",
        variant: "destructive",
      });
    } finally {
      setAddingProducts(false);
    }
  };

  const handleEditProduct = (eventId: number, product: EventProduct) => {
    setEditingProduct(product);
    setProductNotes(product.notes || '');
    setProductDisplayOrder(product.displayOrder);
    setSelectedEvent(events.find(e => e.id === eventId) || null);
    setShowEditProductDialog(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !selectedEvent) return;

    setUpdatingProduct(true);
    try {
      const response = await fetch(`/api/celebrity-vibes-events/${selectedEvent.id}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: productNotes,
          displayOrder: productDisplayOrder,
        }),
      });

      if (response.ok) {
        toast({
          title: "Product updated successfully",
          description: "Product details have been updated",
        });
        await fetchEventProducts(selectedEvent.id);
        setShowEditProductDialog(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: "Failed to update product details",
        variant: "destructive",
      });
    } finally {
      setUpdatingProduct(false);
    }
  };

  const handleToggleProductStatus = async (eventId: number, productId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/celebrity-vibes-events/${eventId}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        toast({
          title: "Product status updated",
          description: `Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        });
        await fetchEventProducts(eventId);
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const handleRemoveProduct = async (eventId: number, productId: number) => {
    try {
      const response = await fetch(`/api/celebrity-vibes-events/${eventId}/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Product removed",
          description: "Product removed from event successfully",
        });
        await fetchEventProducts(eventId);
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast({
        title: "Error removing product",
        description: "Failed to remove product from event",
        variant: "destructive",
      });
    }
  };

  const handleBulkToggleProducts = async (eventId: number, activate: boolean) => {
    const products = eventProducts[eventId] || [];
    const promises = products.map(product =>
      fetch(`/api/celebrity-vibes-events/${eventId}/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: activate,
        }),
      })
    );

    try {
      await Promise.all(promises);
      toast({
        title: "Bulk operation completed",
        description: `All products ${activate ? 'activated' : 'deactivated'} successfully`,
      });
      await fetchEventProducts(eventId);
    } catch (error) {
      console.error('Error in bulk operation:', error);
      toast({
        title: "Error in bulk operation",
        description: "Some products may not have been updated",
        variant: "destructive",
      });
    }
  };

  const handleBulkRemoveProducts = async (eventId: number) => {
    const products = eventProducts[eventId] || [];
    const promises = products.map(product =>
      fetch(`/api/celebrity-vibes-events/${eventId}/products/${product.id}`, {
        method: 'DELETE',
      })
    );

    try {
      await Promise.all(promises);
      toast({
        title: "All products removed",
        description: "All products removed from event successfully",
      });
      await fetchEventProducts(eventId);
    } catch (error) {
      console.error('Error removing all products:', error);
      toast({
        title: "Error removing products",
        description: "Some products may not have been removed",
        variant: "destructive",
      });
    }
  };

  const handleEditCelebrityBrand = (product: CelebrityBrand) => {
    setEditingCelebrityBrand(product);
    setEditBrandForm({
      itemType: product.itemType || '',
      description: product.description || '',
    });
    setEditBrandErrors({
      itemType: '',
      description: '',
    });
    setShowEditBrandDialog(true);
  };

  const validateBrandForm = (): boolean => {
    const errors = {
      itemType: '',
      description: '',
    };
    let isValid = true;

    if (!editBrandForm.itemType.trim()) {
      errors.itemType = 'Item type is required';
      isValid = false;
    } else if (editBrandForm.itemType.trim().length < 2) {
      errors.itemType = 'Item type must be at least 2 characters';
      isValid = false;
    } else if (editBrandForm.itemType.trim().length > 100) {
      errors.itemType = 'Item type must be less than 100 characters';
      isValid = false;
    }

    if (!editBrandForm.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (editBrandForm.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
      isValid = false;
    } else if (editBrandForm.description.trim().length > 500) {
      errors.description = 'Description must be less than 500 characters';
      isValid = false;
    }

    setEditBrandErrors(errors);
    return isValid;
  };

  const handleSaveBrandEdit = async () => {
    if (!editingCelebrityBrand || !validateBrandForm()) return;

    setUpdatingBrand(true);
    try {
      const response = await fetch(`/api/celebritybrands/${editingCelebrityBrand.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemType: editBrandForm.itemType.trim(),
          description: editBrandForm.description.trim(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Product updated",
          description: "Product has been updated successfully",
        });
        await fetchAvailableProducts();
        setShowEditBrandDialog(false);
        setEditingCelebrityBrand(null);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setUpdatingBrand(false);
    }
  };

  const handleCancelBrandEdit = () => {
    setShowEditBrandDialog(false);
    setEditingCelebrityBrand(null);
    setEditBrandForm({
      itemType: '',
      description: '',
    });
    setEditBrandErrors({
      itemType: '',
      description: '',
    });
  };

  const handleDeleteCelebrityBrand = async (product: CelebrityBrand) => {
    if (!confirm(`Are you sure you want to delete "${product.itemType}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/celebritybrands/${product.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Product deleted",
          description: "Product deleted successfully",
        });
        await fetchAvailableProducts();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error deleting product",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleCreateAndAddProduct = async () => {
    if (!selectedEvent || !newProduct.brandName || !newProduct.itemType) return;

    setCreatingProduct(true);
    try {
      // First create the brand if it doesn't exist
      const brandResponse = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newProduct.brandName,
          description: newProduct.description || `Brand for ${newProduct.itemType}`,
          imageUrl: newProduct.imageUrl || '/assets/product-placeholder.svg',
          websiteUrl: undefined,
          isActive: true,
          origins: [],
          categoryIds: [],
          sourceType: undefined,
          celebWearers: [],
        }),
      });

      let brandData;
      if (brandResponse.ok) {
        brandData = await brandResponse.json();
      } else {
        const err = await brandResponse.json().catch(() => ({}));
        throw new Error(String(err?.message || 'Failed to create brand'));
      }

      // Then create the celebrity brand product
      const productResponse = await fetch('/api/celebritybrands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          celebrityId: celebrityId,
          brandId: brandData.id,
          itemType: newProduct.itemType,
          description: newProduct.description,
          imagePosition: { top: '50%', left: '50%' },
          equipmentSpecs: null,
          occasionPricing: null,
          relationshipStartYear: undefined,
          grandSlamAppearances: [],
        }),
      });

      if (productResponse.ok) {
        const productData = await productResponse.json();

        // Add to event
        const eventProductResponse = await fetch(`/api/celebrity-vibes-events/${selectedEvent.id}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            celebrityId: celebrityId,
            productId: productData.id,
            displayOrder: 0,
            isActive: true,
            notes: ''
          }),
        });

        if (eventProductResponse.ok) {
          toast({
            title: "Product created and added successfully",
            description: `${newProduct.itemType} by ${newProduct.brandName} added to ${selectedEvent.name}`,
          });
          await fetchEventProducts(selectedEvent.id);
          await fetchAvailableProducts();
          setNewProduct({ brandName: '', itemType: '', description: '', imageUrl: '' });
          setShowAddDialog(false);
        }
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error creating product",
        description: "Failed to create and add product",
        variant: "destructive",
      });
    } finally {
      setCreatingProduct(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading celebrity vibes events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Celebrity Vibes Events</h2>
            {isOwnProfile && (
              <Button
                onClick={() => setShowCreateEventDialog(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white border-0 font-bold shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>

          {isOwnProfile && (
            <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-stone-100 to-amber-100">
                <DialogHeader className="relative pb-2">
                  <DialogTitle className="text-xl text-gray-900">Create New Event</DialogTitle>
                  <DialogClose className="absolute right-2 top-2 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none h-8 w-8 flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <X className="h-5 w-5 text-gray-900" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="eventName">Event Name *</Label>
                    <Input
                      id="eventName"
                      placeholder="e.g., Diwali 2025, Oscars Red Carpet"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Input
                      id="eventType"
                      placeholder="e.g., Festival, Award Show, Holiday"
                      value={newEvent.eventType}
                      onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventDescription">Description</Label>
                    <Textarea
                      id="eventDescription"
                      placeholder="Describe this special occasion..."
                      rows={3}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                <div>
                  <Label className="text-sm font-medium">Event Image</Label>
                  {newEvent.imageUrl && (
                    <div className="mb-2">
                      <img
                        src={newEvent.imageUrl}
                        alt={newEvent.name || 'Event image'}
                        className="w-full h-32 object-cover rounded-md border"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEventImageSelected(e.target.files)}
                    disabled={eventImageUploading}
                  />
                  {eventImageUploading && (
                    <div className="text-sm text-gray-600 mt-2">Uploading image...</div>
                  )}
                </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newEvent.startDate}
                        onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newEvent.endDate}
                        onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNewEvent({ name: '', description: '', eventType: '', startDate: '', endDate: '' });
                        setShowCreateEventDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateEvent}
                      disabled={creatingEvent || !newEvent.name || !newEvent.eventType || !newEvent.startDate || !newEvent.endDate}
                    >
                      {creatingEvent ? 'Creating...' : 'Create Event'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <Card 
                key={event.id} 
                className={isOwnProfile ? "bg-gradient-to-br from-white/10 to-amber-50/10 border-white/10 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all" : "bg-gradient-to-br from-stone-50 to-amber-50 border border-amber-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"}
                onClick={() => navigate(`/event/${event.id}/products`)}
              >
                {event.isFeatured && (
                  <Badge className="absolute -top-3 left-4 bg-amber-500 text-black shadow-md z-10">Featured Event</Badge>
                )}
                <CardContent className={isOwnProfile ? "p-5" : "p-3"}>
                  <div className={isOwnProfile ? "w-full h-40 bg-white/10 rounded-lg mb-4 overflow-hidden" : "w-full h-24 bg-stone-100 rounded mb-3 overflow-hidden"}>
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className={isOwnProfile ? "w-full h-full object-contain object-center" : "w-full h-full object-contain object-center"}
                        onError={(e) => {
                          e.currentTarget.src = "/assets/event-placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className={isOwnProfile ? "w-full h-full bg-gradient-to-br from-stone-300 to-amber-300 flex items-center justify-center" : "w-full h-full bg-gradient-to-br from-stone-100 to-amber-100 flex items-center justify-center"}>
                        <Calendar className={isOwnProfile ? "h-12 w-12 text-white/50" : "h-8 w-8 text-gray-500"} />
                      </div>
                    )}
                  </div>
                  
                  <h3 className={isOwnProfile ? "font-bold text-lg text-white mb-2 line-clamp-1" : "font-semibold text-sm text-gray-900 mb-1 line-clamp-1"}>{event.name}</h3>
                  
                  {isOwnProfile && (
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-amber-500/80 text-white text-xs">
                        {event.eventType}
                      </Badge>
                    </div>
                  )}
                  
                  {isOwnProfile && (
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  {eventProducts[event.id] && eventProducts[event.id].length > 0 && (
                    <div className={isOwnProfile ? "mb-4 p-3 bg-white/5 rounded-lg border border-white/10" : "mb-2 p-2 bg-stone-50 rounded border border-stone-200"}>
                      <div className={isOwnProfile ? "flex items-center gap-2 text-white/80 text-sm" : "flex items-center gap-1 text-gray-700 text-xs"}>
                        <Package className={isOwnProfile ? "h-4 w-4" : "h-3 w-3 text-gray-600"} />
                        <span className={isOwnProfile ? "font-semibold" : "font-medium"}>{eventProducts[event.id].length} Products</span>
                      </div>
                    </div>
                  )}
                  
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                        variant="outline"
                        className="flex-1 border-amber-500 text-amber-700 hover:bg-amber-100 hover:text-amber-700"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setShowAddDialog(true);
                        }}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id, event.name);
                        }}
                        variant="outline"
                        className="border-red-600 text-red-700 hover:bg-red-50 hover:text-red-700"
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      {/* View Event Products Dialog */}
      <Dialog open={viewingEvent !== null} onOpenChange={(open) => {
        if (!open) {
          setViewingEvent(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-stone-100 to-amber-100">
          <DialogHeader className="relative pb-4">
            <DialogTitle className="text-xl text-gray-900 pr-14">
              {viewingEvent?.name} - Products
            </DialogTitle>
            <DialogClose className="absolute right-2 top-0 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none h-8 w-8 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <X className="h-5 w-5 text-gray-900" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          {viewingEvent && eventProducts[viewingEvent.id] && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {eventProducts[viewingEvent.id].length} product(s) available
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventProducts[viewingEvent.id].map((ep) => (
                  <Card key={ep.id} className="relative group bg-white border-amber-200 hover:border-amber-400 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {ep.product?.imageUrl ? (
                          <img
                            src={ep.product.imageUrl}
                            alt={ep.product.itemType || 'Product Image'}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-amber-200 shadow-md"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/80'; // Fallback placeholder
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-stone-200 rounded-lg flex items-center justify-center border-2 border-stone-300">
                            <ShoppingBag className="h-10 w-10 text-stone-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">{ep.product?.itemType}</h4>
                          <p className="text-sm text-gray-600">{ep.product?.brand?.name}</p>
                          {ep.product?.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ep.product.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={ep.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                              {ep.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* CRUD Controls - Only visible on Profile */}
                      {isOwnProfile && (
                        <div className="absolute top-2 right-2 flex gap-1 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-gray-200 z-20">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleProductStatus(viewingEvent.id, ep.id, ep.isActive);
                            }}
                            className="h-8 w-8 p-0 hover:bg-amber-100 text-gray-600 hover:text-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500"
                            title={ep.isActive ? "Deactivate" : "Activate"}
                          >
                            {ep.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(viewingEvent.id, ep);
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-100 text-gray-600 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProduct(viewingEvent.id, ep.id);
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-100 text-gray-600 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      {isOwnProfile && selectedEvent && (
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            setSelectedEvent(null);
            setSelectedProducts([]);
            setNewProduct({ brandName: '', itemType: '', description: '', imageUrl: '' });
            setAddProductTab('existing');
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-stone-100 to-amber-100">
            <DialogHeader className="relative pb-4">
              <DialogTitle className="text-gray-900 pr-14">Add Products to {selectedEvent.name}</DialogTitle>
              <DialogClose className="absolute right-2 top-0 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none h-8 w-8 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <X className="h-5 w-5 text-gray-900" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            
            <Tabs value={addProductTab} onValueChange={(v) => setAddProductTab(v as 'existing' | 'new')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Existing Products
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-3">
                  {availableProducts.map((product) => {
                    const isSelected = selectedProducts.includes(product.id);
                    const isAlreadyAdded = eventProducts[selectedEvent.id]?.some(
                      ep => ep.productId === product.id
                    );
                    
                    return (
                      <div
                        key={product.id}
                        className={`relative p-4 border-2 rounded-lg transition-all text-gray-800 ${
                          isSelected
                            ? 'border-amber-600 bg-amber-200 shadow-lg cursor-pointer'
                            : isAlreadyAdded
                            ? 'border-gray-500 bg-gray-200 cursor-not-allowed opacity-70'
                            : 'border-stone-400 bg-stone-150 hover:border-amber-500 hover:bg-amber-100 cursor-pointer shadow-sm'
                        }`}
                        onClick={() => !isAlreadyAdded && toggleProductSelection(product.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{product.itemType}</h4>
                            <p className="text-sm text-gray-600">{product.brand?.name || 'Brand'}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.itemType}
                                className="w-12 h-12 object-cover rounded-md border border-amber-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="flex items-center gap-2">
                              {isAlreadyAdded && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-400">
                                  Added
                                </Badge>
                              )}
                              {isSelected && !isAlreadyAdded && (
                                <Badge className="bg-amber-600 text-white">
                                  Selected
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CRUD Controls - Only visible on Profile */}
                        {isOwnProfile && (
                          <div className="absolute top-2 right-2 flex gap-1 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-gray-200 z-20">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCelebrityBrand(product);
                              }}
                              className="h-7 w-7 p-0 hover:bg-blue-100 text-gray-600 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                              title="Edit Product"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCelebrityBrand(product);
                              }}
                              className="h-7 w-7 p-0 hover:bg-red-100 text-gray-600 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
                              title="Delete Product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-amber-300">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProducts([])}
                    disabled={selectedProducts.length === 0}
                    className="border-amber-600 text-amber-800 hover:bg-amber-200 hover:text-amber-900 font-bold disabled:bg-amber-50 disabled:text-amber-400 disabled:border-amber-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    onClick={handleAddExistingProducts}
                    disabled={selectedProducts.length === 0 || addingProducts}
                    className="bg-amber-600 hover:bg-amber-700 text-black hover:text-black border-0 font-bold shadow-md disabled:bg-amber-300 disabled:text-black/70 disabled:opacity-80"
                  >
                    {addingProducts ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Add {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brandName" className="text-sm font-medium">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={newProduct.brandName}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, brandName: e.target.value }))}
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemType" className="text-sm font-medium">Item Type</Label>
                    <Input
                      id="itemType"
                      value={newProduct.itemType}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, itemType: e.target.value }))}
                      placeholder="e.g., T-Shirt, Jeans, Sneakers"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the product..."
                    rows={3}
                  />
                </div>

                    <div>
                      <Label className="text-sm font-medium">Product Image *</Label>
                      {newProduct.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={newProduct.imageUrl}
                            alt={newProduct.itemType || 'Product image'}
                            className="w-full h-32 object-cover rounded-md border"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleNewProductImagesSelected(e.target.files)}
                        disabled={productImagesUploading}
                      />
                      {productImagesUploading && (
                        <div className="text-sm text-gray-600 mt-2">Uploading image...</div>
                      )}
                    </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setNewProduct({ brandName: '', itemType: '', description: '', imageUrl: '' })}
                  >
                    Clear Form
                  </Button>
                  <Button
                    onClick={handleCreateAndAddProduct}
                    disabled={!newProduct.brandName || !newProduct.itemType || !newProduct.imageUrl || creatingProduct}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {creatingProduct ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>Create & Add Product</>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      
      {isOwnProfile && (
        <Dialog open={showEditEventDialog} onOpenChange={(open) => {
          setShowEditEventDialog(open);
          if (!open) {
            setEditingEvent(null);
            setNewEvent({ name: '', description: '', eventType: '', imageUrl: '', startDate: '', endDate: '' });
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-stone-100 to-amber-100">
            <DialogHeader className="relative pb-2">
              <DialogTitle className="text-xl text-gray-900">Edit Event</DialogTitle>
              <DialogClose className="absolute right-2 top-2 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none h-8 w-8 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <X className="h-5 w-5 text-gray-900" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="editEventName">Event Name *</Label>
                <Input
                  id="editEventName"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editEventType">Event Type *</Label>
                <Input
                  id="editEventType"
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editEventDescription">Description</Label>
                <Textarea
                  id="editEventDescription"
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Event Image</Label>
                {newEvent.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={newEvent.imageUrl}
                      alt={newEvent.name || 'Event image'}
                      className="w-full h-32 object-cover rounded-md border"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEventImageSelected(e.target.files)}
                  disabled={eventImageUploading}
                />
                {eventImageUploading && (
                  <div className="text-sm text-gray-600 mt-2">Uploading image...</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStartDate">Start Date *</Label>
                  <Input
                    id="editStartDate"
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editEndDate">End Date *</Label>
                  <Input
                    id="editEndDate"
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditEventDialog(false);
                    setEditingEvent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateEvent}
                  disabled={updatingEvent || !newEvent.name || !newEvent.eventType || !newEvent.startDate || !newEvent.endDate}
                >
                  {updatingEvent ? 'Updating...' : 'Update Event'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
 
      {/* Edit Product Dialog */}
      {isOwnProfile && (
        <Dialog open={showEditProductDialog} onOpenChange={(open) => {
          setShowEditProductDialog(open);
          if (!open) {
            setEditingProduct(null);
            setProductNotes('');
            setProductDisplayOrder(0);
            setSelectedEvent(null);
          }
        }}>
          <DialogContent className="max-w-md bg-gradient-to-br from-stone-150 to-amber-150">
            <DialogHeader className="relative pb-4">
              <DialogTitle className="text-gray-900 pr-14">Edit Product</DialogTitle>
              <DialogClose className="absolute right-2 top-0 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none h-8 w-8 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <X className="h-5 w-5 text-gray-900" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <div className="space-y-4 py-4 bg-gradient-to-br from-stone-200 to-amber-200 rounded-lg p-4 border border-amber-400 text-gray-800">
              <div>
                <Label className="text-sm font-semibold mb-2 block text-gray-800">Product</Label>
                <p className="text-sm text-gray-800">{editingProduct?.product?.itemType || 'Product'}</p>
                <p className="text-xs text-gray-600">{editingProduct?.product?.brand?.name || 'Brand'}</p>
              </div>

              <div>
                <Label htmlFor="productNotes" className="text-sm font-semibold mb-2 block text-gray-800">Notes</Label>
                <Textarea
                  id="productNotes"
                  value={productNotes}
                  onChange={(e) => setProductNotes(e.target.value)}
                  placeholder="Add notes about this product..."
                  rows={3}
                  className="border-amber-300 focus:border-amber-500 focus:ring-amber-200 bg-white text-gray-800"
                />
              </div>

              <div>
                <Label htmlFor="productDisplayOrder" className="text-sm font-semibold mb-2 block text-gray-800">Display Order</Label>
                <Input
                  id="productDisplayOrder"
                  type="number"
                  value={productDisplayOrder}
                  onChange={(e) => setProductDisplayOrder(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="border-amber-300 focus:border-amber-500 focus:ring-amber-200 bg-white text-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditProductDialog(false);
                    setEditingProduct(null);
                  }}
                  className="border-amber-400 text-amber-700 hover:bg-amber-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProduct}
                  disabled={updatingProduct}
                  className="bg-amber-600 hover:bg-amber-700 text-white border-0"
                >
                  {updatingProduct ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>Update Product</>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Celebrity Brand Product Dialog */}
      {isOwnProfile && (
        <Dialog open={showEditBrandDialog} onOpenChange={(open) => {
          if (!open && !updatingBrand) {
            handleCancelBrandEdit();
          }
        }}>
          <DialogContent 
            className="max-w-lg bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 shadow-2xl"
            aria-labelledby="edit-brand-title"
            aria-describedby="edit-brand-description"
          >
            <DialogHeader className="relative pb-4 border-b border-amber-200">
              <DialogTitle id="edit-brand-title" className="text-xl font-bold text-gray-900 pr-14">
                Edit Product
              </DialogTitle>
              <p id="edit-brand-description" className="text-sm text-gray-600 mt-1">
                Update the details for this CeleVibe product
              </p>
              <DialogClose 
                className="absolute right-2 top-0 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:pointer-events-none h-8 w-8 flex items-center justify-center hover:bg-amber-100 transition-colors"
                disabled={updatingBrand}
                aria-label="Close dialog"
              >
                <X className="h-5 w-5 text-gray-900" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-5 py-6">
              {/* Brand Name (Read-only) */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                  Brand
                </Label>
                <p className="text-base font-semibold text-gray-900">
                  {editingCelebrityBrand?.brand?.name || 'Unknown Brand'}
                </p>
              </div>

              {/* Item Type Field */}
              <div>
                <Label 
                  htmlFor="edit-item-type" 
                  className="text-sm font-semibold text-gray-800 mb-2 block"
                >
                  Item Type <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-item-type"
                  value={editBrandForm.itemType}
                  onChange={(e) => {
                    setEditBrandForm({ ...editBrandForm, itemType: e.target.value });
                    if (editBrandErrors.itemType) {
                      setEditBrandErrors({ ...editBrandErrors, itemType: '' });
                    }
                  }}
                  placeholder="e.g., Sunglasses, Watch, Jacket"
                  className={`border-2 focus:ring-2 focus:ring-amber-300 bg-white text-gray-900 ${
                    editBrandErrors.itemType 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-amber-200 focus:border-amber-400'
                  }`}
                  maxLength={100}
                  disabled={updatingBrand}
                  aria-invalid={!!editBrandErrors.itemType}
                  aria-describedby={editBrandErrors.itemType ? "item-type-error" : undefined}
                  autoFocus
                />
                {editBrandErrors.itemType && (
                  <p id="item-type-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                    <span className="font-semibold">⚠</span> {editBrandErrors.itemType}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {editBrandForm.itemType.length}/100 characters
                </p>
              </div>

              {/* Description Field */}
              <div>
                <Label 
                  htmlFor="edit-description" 
                  className="text-sm font-semibold text-gray-800 mb-2 block"
                >
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-description"
                  value={editBrandForm.description}
                  onChange={(e) => {
                    setEditBrandForm({ ...editBrandForm, description: e.target.value });
                    if (editBrandErrors.description) {
                      setEditBrandErrors({ ...editBrandErrors, description: '' });
                    }
                  }}
                  placeholder="Describe this product in detail..."
                  rows={4}
                  className={`border-2 focus:ring-2 focus:ring-amber-300 bg-white text-gray-900 resize-none ${
                    editBrandErrors.description 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-amber-200 focus:border-amber-400'
                  }`}
                  maxLength={500}
                  disabled={updatingBrand}
                  aria-invalid={!!editBrandErrors.description}
                  aria-describedby={editBrandErrors.description ? "description-error" : undefined}
                />
                {editBrandErrors.description && (
                  <p id="description-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                    <span className="font-semibold">⚠</span> {editBrandErrors.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {editBrandForm.description.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
                <Button
                  variant="outline"
                  onClick={handleCancelBrandEdit}
                  disabled={updatingBrand}
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold px-6"
                  aria-label="Cancel editing"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveBrandEdit}
                  disabled={updatingBrand || !editBrandForm.itemType.trim() || !editBrandForm.description.trim()}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 font-bold shadow-lg hover:shadow-xl transition-all px-6"
                  aria-label="Save changes"
                >
                  {updatingBrand ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
