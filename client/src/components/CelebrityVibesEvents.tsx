import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Calendar, Plus, Package, Trash2, Check, ShoppingBag, Edit2, Power, PowerOff, Eye, CheckCircle, XCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    eventType: '',
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
      const response = await fetch(`/api/celebrity-brands?celebrityId=${celebrityId}`);
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
        fetch('/api/celebrity-event-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            celebrityId: celebrityId,
            productId: productId,
            displayOrder: 0,
            isActive: true,
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
      const response = await fetch(`/api/celebrity-event-products/${editingProduct.id}`, {
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
      const response = await fetch(`/api/celebrity-event-products/${productId}`, {
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
      const response = await fetch(`/api/celebrity-event-products/${productId}`, {
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
      fetch(`/api/celebrity-event-products/${product.id}`, {
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
      fetch(`/api/celebrity-event-products/${product.id}`, {
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
        body: JSON.stringify({
          name: newProduct.brandName
        }),
      });

      let brandData;
      if (brandResponse.ok) {
        brandData = await brandResponse.json();
      } else {
        throw new Error('Failed to create brand');
      }

      // Then create the celebrity brand product
      const productResponse = await fetch('/api/celebrity-brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          celebrityId: celebrityId,
          brandId: brandData.id,
          itemType: newProduct.itemType,
          description: newProduct.description,
          imageUrl: newProduct.imageUrl
        }),
      });

      if (productResponse.ok) {
        const productData = await productResponse.json();

        // Add to event
        const eventProductResponse = await fetch('/api/celebrity-event-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: selectedEvent.id,
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
      <Tabs defaultValue="celebrity-vibes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-stone-200 to-amber-200 border-amber-300">
          <TabsTrigger 
            value="celebrity-vibes" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white font-bold"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Celebrity Vibes
          </TabsTrigger>
          <TabsTrigger 
            value="vibe-events" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white font-bold"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Vibe Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="celebrity-vibes" className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <Card 
                key={event.id} 
                className="bg-gradient-to-br from-stone-50 to-amber-50 border-amber-200 hover:border-amber-400 transition-colors cursor-pointer shadow-lg hover:shadow-xl"
                onClick={() => setViewingEvent(event)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className={isOwnProfile ? "text-xl" : "text-lg"}>{event.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                          {event.eventType}
                        </Badge>
                        {event.isFeatured && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">
                            Featured
                          </Badge>
                        )}
                        {!isOwnProfile && (
                          <Badge variant="outline" className="text-xs">
                            View Details
                          </Badge>
                        )}
                      </div>
                    </div>
                    {event.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={event.imageUrl}
                          alt={event.name}
                          className={`object-cover rounded-md border-2 border-amber-200 ${
                            isOwnProfile ? 'w-20 h-24' : 'w-12 h-32'
                          }`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {isOwnProfile ? (
                    // Full profile view with CRUD operations
                    <>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      
                      {/* Products in this event */}
                      {eventProducts[event.id] && eventProducts[event.id].length > 0 && (
                        <div className="space-y-2 mb-4 p-4 bg-gradient-to-br from-stone-300 to-amber-300 rounded-lg border-2 border-amber-500 shadow-lg">
                          <h4 className="text-base font-bold flex items-center gap-2 text-white mb-3 bg-gray-800 p-2 rounded">
                            <Package className="h-4 w-4" />
                            My Products ({eventProducts[event.id].length})
                          </h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {eventProducts[event.id].slice(0, 3).map((ep) => (
                              <div key={ep.id} className={`flex items-center justify-between p-3 rounded-lg border-2 shadow-md ${
                                ep.isActive ? 'bg-white border-green-400 shadow-green-100' : 'bg-gray-200 border-orange-400 shadow-orange-100 opacity-90'
                              }`}>
                                <div className="flex-1">
                                  <span className="text-sm font-bold text-gray-800">{ep.product?.itemType || 'Product'}</span>
                                  {ep.product?.brand?.name && (
                                    <span className="text-xs font-semibold text-gray-600 ml-2">by {ep.product.brand.name}</span>
                                  )}
                                  {!ep.isActive && (
                                    <Badge className="ml-2 text-xs bg-red-600 text-white font-semibold">Inactive</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditProduct(event.id, ep);
                                    }}
                                    title="Edit Product"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 h-7"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleProductStatus(event.id, ep.id, ep.isActive);
                                    }}
                                    title={ep.isActive ? 'Deactivate' : 'Activate'}
                                    className={ep.isActive 
                                      ? "bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 h-7" 
                                      : "bg-green-500 hover:bg-green-600 text-white px-2 py-1 h-7"
                                    }
                                  >
                                    {ep.isActive ? (
                                      <PowerOff className="h-3 w-3" />
                                    ) : (
                                      <Power className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveProduct(event.id, ep.id);
                                    }}
                                    title="Remove"
                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 h-7"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {eventProducts[event.id].length > 3 && (
                              <p className="text-sm text-white text-center font-bold bg-gray-800 py-1 rounded">
                                +{eventProducts[event.id].length - 3} more products
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bulk Actions for Products */}
                      {eventProducts[event.id] && eventProducts[event.id].length > 0 && (
                        <div className="mt-3 pt-3 border-t-2 border-amber-400 bg-gray-900 rounded-lg p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-white font-bold">Bulk Actions:</span>
                            <Button
                              size="sm"
                              className="h-6 text-xs bg-green-600 hover:bg-green-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBulkToggleProducts(event.id, true);
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activate All
                            </Button>
                            <Button
                              size="sm"
                              className="h-6 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBulkToggleProducts(event.id, false);
                              }}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Deactivate All
                            </Button>
                            <Button
                              size="sm"
                              className="h-6 text-xs bg-red-600 hover:bg-red-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBulkRemoveProducts(event.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove All
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Add Product Button */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setShowAddDialog(true);
                          }}
                          className="w-full text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Product
                        </Button>
                      </div>
                    </>
                  ) : (
                    // Concise celebrity page view
                    <>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      
                      {eventProducts[event.id] && eventProducts[event.id].length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Package className="h-4 w-4" />
                          <span>{eventProducts[event.id].length} Products Available</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vibe-events" className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Vibe Events</h2>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4" />
            <p>Vibe Events coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Event Products Dialog */}
      <Dialog open={viewingEvent !== null} onOpenChange={(open) => {
        if (!open) {
          setViewingEvent(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-stone-100 to-amber-100">
          <DialogHeader className="relative">
            <DialogTitle className="text-xl text-gray-800 pr-8">
              {viewingEvent?.name} - Products
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-6 w-6 text-gray-900" />
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
                  <Card key={ep.id} className="bg-white border-amber-200 hover:border-amber-400 transition-colors">
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
                            <Badge variant="outline" className="text-xs">
                              Order: {ep.displayOrder}
                            </Badge>
                          </div>
                        </div>
                      </div>
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
            <DialogHeader className="relative">
              <DialogTitle className="pr-8">Add Products to {selectedEvent.name}</DialogTitle>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-6 w-6 text-gray-900" />
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
                        className={`p-4 border-2 rounded-lg transition-all text-gray-800 ${
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
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-amber-300">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProducts([])}
                    disabled={selectedProducts.length === 0}
                    className="border-amber-500 text-amber-700 hover:bg-amber-100 font-bold"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    onClick={handleAddExistingProducts}
                    disabled={selectedProducts.length === 0 || addingProducts}
                    className="bg-amber-600 hover:bg-amber-700 text-white border-0 font-bold shadow-md"
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
                  <Label htmlFor="imageUrl" className="text-sm font-medium">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
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
                    disabled={!newProduct.brandName || !newProduct.itemType || creatingProduct}
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
            <DialogHeader className="relative">
              <DialogTitle className="pr-8">Edit Product</DialogTitle>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-6 w-6 text-gray-900" />
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
    </div>
  );
}