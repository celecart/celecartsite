import Header from "@/components/Header";
import React, { useEffect, useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { User, Edit, Save, X, Star, Sparkles, ShoppingBag, Link2, Wand2, Video, Camera, Upload, BookOpen, Plus, Trash2, ExternalLink, Mail, Phone, MapPin, Calendar, Instagram, Twitter, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MultiImageUpload from '@/components/MultiImageUpload';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface ProfileData {
  displayName: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  profession: string;
  description: string;
  category: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
}

interface CelebrityProduct {
  id: number;
  celebrityId: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string | string[]; // Support both single URL and array of URLs
  price: string; // Changed from number to string to match schema
  location: string;
  website: string;
  purchaseLink: string;
  rating: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isCelebrity, setIsCelebrity] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<CelebrityProduct[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CelebrityProduct | null>(null);
  // Add nested products tab state
  const [productTab, setProductTab] = useState<
    'personalFavourite' | 'personalBrand' | 'shoppingPlaylist' | 'celeconnect' | 'aiStylist' | 'fashionEpisodes'
  >('personalFavourite');
  // Track where Add Product was triggered to prefill category and render placement
  const [addProductContext, setAddProductContext] = useState<'zulqadarExperiences' | 'luxuryBrandPreferences' | 'personalBrandProducts' | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    profession: '',
    description: '',
    category: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: ''
  });
  const { toast } = useToast();

  // Check if user can access celebrity details (super admin or celebrity user)
  const canAccessCelebrityDetails = () => {
    return isAdmin || isCelebrity;
  };

  // Load celebrity products
  const loadProducts = async (celebrityId: number) => {
    try {
      const res = await fetch(`/api/celebrity-products?celebrityId=${celebrityId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Create or update product
  const saveProduct = async (productData: Partial<CelebrityProduct>) => {
    try {
      const url = editingProduct ? `/api/celebrity-products/${editingProduct.id}` : '/api/celebrity-products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      // Ensure imageUrl is properly formatted for the backend
      const formattedData = {
        ...productData,
        celebrityId: user.id
      };
      
      console.log('Sending product data to backend:', formattedData);
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formattedData)
      });

      if (res.ok) {
        const savedProduct = await res.json();
        if (editingProduct) {
          setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
        } else {
          setProducts([...products, savedProduct]);
        }
        setShowAddProduct(false);
        setEditingProduct(null);
        // Refresh products data to ensure we have the latest
        await loadProducts(user.id);
        toast({ title: "Success", description: `Product ${editingProduct ? 'updated' : 'created'} successfully` });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  // Delete product
  const deleteProduct = async (productId: number) => {
    try {
      const res = await fetch(`/api/celebrity-products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== productId));
        toast({ title: "Success", description: "Product deleted successfully" });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };


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

  // Check if user has celebrity role
  const checkCelebrityRole = async (userId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}/roles`, { credentials: 'include' });
      if (res.ok) {
        const userRoles = await res.json();
        
        // Fetch all roles to find celebrity role ID
        const rolesRes = await fetch('/api/roles', { credentials: 'include' });
        if (rolesRes.ok) {
          const allRoles = await rolesRes.json();
          const celebrityRole = allRoles.find((role: any) => role.name.toLowerCase() === 'celebrity');
          
          if (celebrityRole) {
          const hasCelebrityRole = userRoles.some((ur: any) => ur.roleId === celebrityRole.id);
          setIsCelebrity(hasCelebrityRole);
          
          // Load products if user is celebrity
          if (hasCelebrityRole && userId) {
            loadProducts(userId);
          }
        }
        }
      }
    } catch (error) {
      console.error('Error checking celebrity role:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/auth/user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          
          // Check if user is admin
          setIsAdmin(data.user?.role === 'admin');
          
          // Check celebrity role
          if (data.user?.id) {
            await checkCelebrityRole(data.user.id);
            // Load products for celebrity users
            await loadProducts(data.user.id);
          }
          
          // Initialize profile data with user data
          setProfileData({
            displayName: data.user.displayName || '',
            email: data.user.email || '',
            username: data.user.username || '',
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            phone: data.user.phone || '',
            profession: data.user.profession || '',
            description: data.user.description || '',
            category: data.user.category || '',
            instagram: data.user.instagram || '',
            twitter: data.user.twitter || '',
            youtube: data.user.youtube || '',
            tiktok: data.user.tiktok || ''
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        
        // Update profileData state to reflect the saved changes
        setProfileData({
          displayName: updatedUser.displayName || '',
          email: updatedUser.email || '',
          username: updatedUser.username || '',
          firstName: updatedUser.firstName || '',
          lastName: updatedUser.lastName || '',
          phone: updatedUser.phone || '',
          profession: updatedUser.profession || '',
          description: updatedUser.description || '',
          category: updatedUser.category || '',
          instagram: updatedUser.instagram || '',
          twitter: updatedUser.twitter || '',
          youtube: updatedUser.youtube || '',
          tiktok: updatedUser.tiktok || ''
        });
        
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setProfileData({
      displayName: user.displayName || '',
      email: user.email || '',
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      profession: user.profession || '',
      description: user.description || '',
      category: user.category || '',
      instagram: user.instagram || '',
      twitter: user.twitter || '',
      youtube: user.youtube || '',
      tiktok: user.tiktok || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {loading ? (
          <div className="text-white/70 text-center">Loading...</div>
        ) : !user ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-8 text-center">
              <div className="text-white/80">
                <p className="mb-4">You are not signed in.</p>
                <Link href="/login">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black rounded-full">Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">Your Profile</CardTitle>
                        <p className="text-white/60 text-sm">
                          {isCelebrity ? 'Manage your celebrity profile' : isAdmin ? 'Admin profile management' : 'Edit your account details'}
                        </p>
                      </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSave}
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button 
                          onClick={handleCancel}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Profile Content */}
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className={`grid w-full ${canAccessCelebrityDetails() ? 'grid-cols-4' : 'grid-cols-1'} bg-white/5 border-white/10`}>
                <TabsTrigger value="basic" className="text-white data-[state=active]:bg-white/10">Basic Info</TabsTrigger>
                {canAccessCelebrityDetails() && (
                  <>
                    <TabsTrigger value="celebrity" className="text-white data-[state=active]:bg-white/10">Celebrity Details</TabsTrigger>
                    <TabsTrigger value="products" className="text-white data-[state=active]:bg-white/10">Products</TabsTrigger>
                    <TabsTrigger value="social" className="text-white data-[state=active]:bg-white/10">Social Media</TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 mb-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.profilePicture || user.imageUrl || user.picture || user.avatarUrl} alt={user.name || user.email} />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70">Display Name</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.displayName}
                            onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        ) : (
                          <div className="text-white font-medium p-2">{user.displayName || '—'}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-white/70">Email</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        ) : (
                          <div className="text-white font-medium p-2">{user.email || '—'}</div>
                        )}
                      </div>

                      <div>
                        <Label className="text-white/70">Username</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.username}
                            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        ) : (
                          <div className="text-white font-medium p-2">{user.username || '—'}</div>
                        )}
                      </div>

                      <div>
                        <Label className="text-white/70">Phone</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        ) : (
                          <div className="text-white font-medium p-2">{user.phone || '—'}</div>
                        )}
                      </div>

                      <div>
                        <Label className="text-white/70">First Name</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        ) : (
                          <div className="text-white font-medium p-2">{user.firstName || '—'}</div>
                        )}
                      </div>

                      <div>
                        <Label className="text-white/70">Last Name</Label>
                        {isEditing ? (
                          <Input
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        ) : (
                          <div className="text-white font-medium p-2">{user.lastName || '—'}</div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label className="text-white/70">Role</Label>
                        <div className="text-white font-medium p-2 flex items-center gap-2">
                          {isCelebrity && <Star className="w-4 h-4 text-amber-400" />}
                          {isAdmin && <span className="text-red-400 font-semibold">Admin</span>}
                          {isCelebrity && <span className="text-amber-400 font-semibold">Celebrity</span>}
                          {!isAdmin && !isCelebrity && <span className="text-gray-400">User</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {canAccessCelebrityDetails() && (
                <TabsContent value="celebrity" className="space-y-6">
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" />
                        Celebrity Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70">Profession</Label>
                          {isEditing ? (
                            <Input
                              value={profileData.profession}
                              onChange={(e) => setProfileData({...profileData, profession: e.target.value})}
                              placeholder="e.g., Actor, Singer, Athlete"
                              className="bg-white/5 border-white/20 text-white"
                            />
                          ) : (
                            <div className="text-white font-medium p-2">{user.profession || '—'}</div>
                          )}
                        </div>

                        <div>
                          <Label className="text-white/70">Category</Label>
                          {isEditing ? (
                            <Select value={profileData.category} onValueChange={(value) => setProfileData({...profileData, category: value})}>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="text-white font-medium p-2">{user.category || '—'}</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-white/70">Description</Label>
                        {isEditing ? (
                          <Textarea
                            value={profileData.description}
                            onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                            placeholder="Brief description about yourself"
                            rows={4}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        ) : (
                          <div className="text-white font-medium p-2 min-h-[100px] whitespace-pre-wrap">{user.description || '—'}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {canAccessCelebrityDetails() && (
                <TabsContent value="social" className="space-y-6">
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Social Media Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70">Instagram</Label>
                          {isEditing ? (
                            <Input
                              value={profileData.instagram}
                              onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                              placeholder="@username or full URL"
                              className="bg-white/5 border-white/20 text-white"
                            />
                          ) : (
                            <div className="text-white font-medium p-2">{user.instagram || '—'}</div>
                          )}
                        </div>

                        <div>
                          <Label className="text-white/70">Twitter</Label>
                          {isEditing ? (
                            <Input
                              value={profileData.twitter}
                              onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                              placeholder="@username or full URL"
                              className="bg-white/5 border-white/20 text-white"
                            />
                          ) : (
                            <div className="text-white font-medium p-2">{user.twitter || '—'}</div>
                          )}
                        </div>

                        <div>
                          <Label className="text-white/70">YouTube</Label>
                          {isEditing ? (
                            <Input
                              value={profileData.youtube}
                              onChange={(e) => setProfileData({...profileData, youtube: e.target.value})}
                              placeholder="Channel URL"
                              className="bg-white/5 border-white/20 text-white"
                            />
                          ) : (
                            <div className="text-white font-medium p-2">{user.youtube || '—'}</div>
                          )}
                        </div>

                        <div>
                          <Label className="text-white/70">TikTok</Label>
                          {isEditing ? (
                            <Input
                              value={profileData.tiktok}
                              onChange={(e) => setProfileData({...profileData, tiktok: e.target.value})}
                              placeholder="@username or full URL"
                              className="bg-white/5 border-white/20 text-white"
                            />
                          ) : (
                            <div className="text-white font-medium p-2">{user.tiktok || '—'}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {canAccessCelebrityDetails() && (
                <TabsContent value="products" className="space-y-6">
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardHeader />
                    <CardContent className="space-y-4">
                      {/* Products sub-tabs navbar */}
                      <Tabs value={productTab} onValueChange={(v) => setProductTab(v as any)}>
                        <TabsList className="relative w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1 overflow-x-auto scrollbar-hide whitespace-nowrap">
                          <TabsTrigger value="personalFavourite" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-3 py-2 text-white">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              <span>Favourite</span>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value="personalBrand" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-3 py-2 text-white">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              <span>Personal Brand</span>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value="shoppingPlaylist" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-3 py-2 text-white">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4" />
                              <span>Shopping playlist</span>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value="celeconnect" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-3 py-2 text-white">
                            <div className="flex items-center gap-2">
                              <Link2 className="w-4 h-4" />
                              <span>Celeconnect</span>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value="aiStylist" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-3 py-2 text-white">
                            <div className="flex items-center gap-2">
                              <Wand2 className="w-4 h-4" />
                              <span>AI Stylist</span>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value="fashionEpisodes" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black rounded-xl px-3 py-2 text-white">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              <span>Fashion & Style episodes</span>
                            </div>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personalFavourite" className="mt-4 space-y-6">

                          {/* Moved accordions from Personal Brand to Favourite and beautified */}
                          <Accordion type="multiple" defaultValue={["zulqadarExperiences", "luxuryBrandPreferences"]} className="w-full space-y-4">
                            <AccordionItem value="zulqadarExperiences" className="group bg-gradient-to-r from-white/5 to-violet-500/10 backdrop-blur-xl border-white/10 rounded-2xl hover:border-violet-400/30 transition-colors">
                              <AccordionTrigger className="px-4 text-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                                  <span className="font-medium">Zulqadar's Favorite Experiences</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                <div className="flex justify-end mb-3">
                                  <Button onClick={() => { setEditingProduct(null); setAddProductContext('zulqadarExperiences'); setShowAddProduct(true); }} className="bg-amber-500 hover:bg-amber-600 text-black rounded-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                  </Button>
                                </div>
                                {products.filter(p => (p.category || '').toLowerCase() === 'zulqadar experiences').length === 0 ? (
                                  <div className="text-white/70">No experiences added yet.</div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {products
                                      .filter(p => (p.category || '').toLowerCase() === 'zulqadar experiences')
                                      .map((product) => (
                                        <Card key={product.id} className="relative bg-gradient-to-br from-white/10 to-amber-50/10 border-white/10 rounded-2xl shadow-lg">
                                          {product.isFeatured && (
                                            <Badge className="absolute -top-3 left-4 bg-amber-500 text-black shadow-md">Most Popular</Badge>
                                          )}
                                          <CardContent className="p-5">
                                            <div className="w-full h-44 bg-white/10 rounded-lg mb-4 overflow-hidden">
                                              {product.imageUrl ? (
                                                Array.isArray(product.imageUrl) ? (
                                                  <div className="w-full h-full flex">
                                                    {product.imageUrl.slice(0, 2).map((url, index) => (
                                                      <img
                                                        key={index}
                                                        src={url}
                                                        alt={`${product.name} ${index + 1}`}
                                                        className={`${product.imageUrl.length === 1 ? 'w-full' : 'w-1/2'} h-full object-cover ${index > 0 ? 'border-l border-white/20' : ''}`}
                                                        onError={(e) => {
                                                          const target = e.target as HTMLImageElement;
                                                          target.onerror = null;
                                                          target.src = "/placeholder-celebrity.jpg";
                                                        }}
                                                      />
                                                    ))}
                                                    {product.imageUrl.length > 2 && (
                                                      <div className="w-1/2 h-full bg-black/50 flex items-center justify-center text-white/70 text-sm border-l border-white/20">
                                                        +{product.imageUrl.length - 2} more
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <img
                                                    src={product.imageUrl as string}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                      const target = e.target as HTMLImageElement;
                                                      target.onerror = null;
                                                      target.src = "/placeholder-celebrity.jpg";
                                                    }}
                                                  />
                                                )
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/50">No Image</div>
                                              )}
                                            </div>
                                            <h3 className="text-violet-200 font-playfair font-semibold mb-2">{product.name}</h3>
                                            <div className="text-sky-400 font-medium mb-2">{product.category}</div>
                                            <div className="flex items-center gap-3 mb-3">
                                              <span className="px-2 py-1 bg-green-600 text-white rounded-full text-sm">${product.price}</span>
                                            </div>
                                            <p className="text-white/70 text-sm mb-4 line-clamp-2">{product.description}</p>
                                            <div className="flex items-center justify-between">
                                              <div className="flex gap-2">
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => { setEditingProduct(product); setShowAddProduct(true); }}
                                                  className="border-white/20 text-white hover:bg-white/10"
                                                >
                                                  <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => deleteProduct(product.id)}
                                                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </Button>
                                              </div>
                                              {product.purchaseLink && (
                                                <Button
                                                  size="sm"
                                                  onClick={() => window.open(product.purchaseLink, '_blank')}
                                                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-full"
                                                >
                                                  Shop Now
                                                </Button>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="luxuryBrandPreferences" className="group bg-gradient-to-r from-white/5 to-fuchsia-500/10 backdrop-blur-xl border-white/10 rounded-2xl hover:border-fuchsia-400/30 transition-colors">
                              <AccordionTrigger className="px-4 text-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                                  <span className="font-medium">Luxury Brand Preferences</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                <div className="flex justify-end mb-3">
                                  <Button onClick={() => { setEditingProduct(null); setAddProductContext('luxuryBrandPreferences'); setShowAddProduct(true); }} className="bg-amber-500 hover:bg-amber-600 text-black rounded-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                  </Button>
                                </div>
                                {products.filter(p => (p.category || '').toLowerCase() === 'luxury brand preferences').length === 0 ? (
                                  <div className="text-white/70">No luxury brand items yet.</div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {products
                                      .filter(p => (p.category || '').toLowerCase() === 'luxury brand preferences')
                                      .map((product) => (
                                        <Card key={product.id} className="relative bg-gradient-to-br from-white/10 to-amber-50/10 border-white/10 rounded-2xl shadow-lg">
                                          {product.isFeatured && (
                                            <Badge className="absolute -top-3 left-4 bg-amber-500 text-black shadow-md">Most Popular</Badge>
                                          )}
                                          <CardContent className="p-5">
                                            <div className="w-full h-44 bg-white/10 rounded-lg mb-4 overflow-hidden">
                                              {product.imageUrl ? (
                                                Array.isArray(product.imageUrl) ? (
                                                  <div className="w-full h-full flex">
                                                    {product.imageUrl.slice(0, 2).map((url, index) => (
                                                      <img
                                                        key={index}
                                                        src={url}
                                                        alt={`${product.name} ${index + 1}`}
                                                        className={`${product.imageUrl.length === 1 ? 'w-full' : 'w-1/2'} h-full object-cover ${index > 0 ? 'border-l border-white/20' : ''}`}
                                                        onError={(e) => {
                                                          const target = e.target as HTMLImageElement;
                                                          target.onerror = null;
                                                          target.src = "/placeholder-celebrity.jpg";
                                                        }}
                                                      />
                                                    ))}
                                                    {product.imageUrl.length > 2 && (
                                                      <div className="w-1/2 h-full bg-black/50 flex items-center justify-center text-white/70 text-sm border-l border-white/20">
                                                        +{product.imageUrl.length - 2} more
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <img
                                                    src={product.imageUrl as string}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                      const target = e.target as HTMLImageElement;
                                                      target.onerror = null;
                                                      target.src = "/placeholder-celebrity.jpg";
                                                    }}
                                                  />
                                                )
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/50">No Image</div>
                                              )}
                                            </div>
                                            <h3 className="text-violet-200 font-playfair font-semibold mb-2">{product.name}</h3>
                                            <div className="text-sky-400 font-medium mb-2">{product.category}</div>
                                            <div className="flex items-center gap-3 mb-3">
                                              <span className="px-2 py-1 bg-green-600 text-white rounded-full text-sm">${product.price}</span>
                                            </div>
                                            <p className="text-white/70 text-sm mb-4 line-clamp-2">{product.description}</p>
                                            <div className="flex items-center justify-between">
                                              <div className="flex gap-2">
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => {
                                                    setEditingProduct(product);
                                                    setShowAddProduct(true);
                                                  }}
                                                  className="border-white/20 text-white hover:bg-white/10"
                                                >
                                                  <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => deleteProduct(product.id)}
                                                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </Button>
                                              </div>
                                              {product.purchaseLink && (
                                                <Button
                                                  size="sm"
                                                  onClick={() => window.open(product.purchaseLink, '_blank')}
                                                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-full"
                                                >
                                                  Shop Now
                                                </Button>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TabsContent>

                        <TabsContent value="personalBrand" className="mt-4 space-y-6">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="brandProducts" className="group bg-gradient-to-r from-white/5 to-amber-500/10 backdrop-blur-xl border-white/10 rounded-2xl hover:border-amber-400/30 transition-colors">
                              <AccordionTrigger className="px-4 text-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
                                  <span className="font-medium">Personal Brand Products</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                <div className="flex justify-end mb-3">
                                  <Button onClick={() => { setEditingProduct(null); setAddProductContext('personalBrandProducts'); setShowAddProduct(true); }} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black rounded-full px-4 py-2 shadow">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                  </Button>
                                </div>
                                {products.filter(p => (p.category || '').toLowerCase() === 'personal brand products').length === 0 ? (
                                  <div className="text-white/70">No personal brand products yet.</div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {products
                                      .filter(p => (p.category || '').toLowerCase() === 'personal brand products')
                                      .map((product) => (
                                        <Card key={product.id} className="relative bg-gradient-to-br from-white/10 to-amber-50/10 border-white/10 rounded-2xl shadow-lg">
                                          {product.isFeatured && (
                                            <Badge className="absolute -top-3 left-4 bg-amber-500 text-black shadow-md">Most Popular</Badge>
                                          )}
                                          <CardContent className="p-5">
                                            <div className="w-full h-44 bg-white/10 rounded-lg mb-4 overflow-hidden">
                                              {product.imageUrl ? (
                                                Array.isArray(product.imageUrl) ? (
                                                  <div className="w-full h-full flex">
                                                    {product.imageUrl.slice(0, 2).map((url, index) => (
                                                      <img
                                                        key={index}
                                                        src={url}
                                                        alt={`${product.name} ${index + 1}`}
                                                        className={`${product.imageUrl.length === 1 ? 'w-full' : 'w-1/2'} h-full object-cover ${index > 0 ? 'border-l border-white/20' : ''}`}
                                                        onError={(e) => {
                                                          const target = e.target as HTMLImageElement;
                                                          target.onerror = null;
                                                          target.src = "/placeholder-celebrity.jpg";
                                                        }}
                                                      />
                                                    ))}
                                                    {product.imageUrl.length > 2 && (
                                                      <div className="w-1/2 h-full bg-black/50 flex items-center justify-center text-white/70 text-sm border-l border-white/20">
                                                        +{product.imageUrl.length - 2} more
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <img
                                                    src={product.imageUrl as string}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                      const target = e.target as HTMLImageElement;
                                                      target.onerror = null;
                                                      target.src = "/placeholder-celebrity.jpg";
                                                    }}
                                                  />
                                                )
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/50">No Image</div>
                                              )}
                                            </div>
                                            <h3 className="text-violet-200 font-playfair font-semibold mb-2">{product.name}</h3>
                                            <div className="text-sky-400 font-medium mb-2">{product.category}</div>
                                            <div className="flex items-center gap-3 mb-3">
                                              <span className="px-2 py-1 bg-green-600 text-white rounded-full text-sm">${product.price}</span>
                                            </div>
                                            <p className="text-white/70 text-sm mb-4 line-clamp-2">{product.description}</p>
                                            <div className="flex items-center justify-between">
                                              <div className="flex gap-2">
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => { setEditingProduct(product); setShowAddProduct(true); }}
                                                  className="border-white/20 text-white hover:bg-white/10"
                                                >
                                                  <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => deleteProduct(product.id)}
                                                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </Button>
                                              </div>
                                              {product.purchaseLink && (
                                                <Button
                                                  size="sm"
                                                  onClick={() => window.open(product.purchaseLink, '_blank')}
                                                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-full"
                                                >
                                                  Shop Now
                                                </Button>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TabsContent>

                        <TabsContent value="shoppingPlaylist" className="mt-4">
                          <div className="text-white/80">Build shopping playlists with curated products.</div>
                        </TabsContent>
                        <TabsContent value="celeconnect" className="mt-4">
                          <div className="text-white/80">Connect with fans and brands through product links.</div>
                        </TabsContent>
                        <TabsContent value="aiStylist" className="mt-4">
                          <div className="text-white/80">AI stylist recommendations will appear here.</div>
                        </TabsContent>
                        <TabsContent value="fashionEpisodes" className="mt-4">
                          <div className="text-white/80">Fashion & Style episodes will be listed here.</div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            {/* Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Link href="/">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                      Home
                    </Button>
                  </Link>
                  <Link href="/add-blog">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Cele Blog
                    </Button>
                  </Link>
                  {isCelebrity && (
                    <Link href={`/celebrity/${user.id}`}>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-black rounded-full">
                        View Public Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showAddProduct && (
        <ProductModal
          product={editingProduct}
          onSave={saveProduct}
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
            setAddProductContext(null);
          }}
          initialCategory={addProductContext === 'zulqadarExperiences' 
            ? 'Zulqadar Experiences' 
            : addProductContext === 'luxuryBrandPreferences' 
              ? 'Luxury Brand Preferences' 
              : addProductContext === 'personalBrandProducts' 
                ? 'Personal Brand Products' 
                : undefined}
        />
      )}
    </div>
  );
}

// Product Modal Component
function ProductModal({ 
  product, 
  onSave, 
  onClose,
  initialCategory
}: { 
  product: CelebrityProduct | null; 
  onSave: (data: Partial<CelebrityProduct>) => Promise<void>; 
  onClose: () => void; 
  initialCategory?: string;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || initialCategory || '',
    imageUrls: Array.isArray(product?.imageUrl) ? product.imageUrl : (product?.imageUrl ? [product.imageUrl] : []),
    price: product?.price || '',
    location: product?.location || '',
    website: product?.website || '',
    purchaseLink: product?.purchaseLink || '',
    rating: product?.rating || 5,
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false
  });
  const formRef = useRef(formData);
  useEffect(() => { formRef.current = formData; }, [formData]);

  const handleImagesChange = async (imageUrls: string[]) => {
    setFormData(prev => ({ ...prev, imageUrls }));

    // Auto-save the product when images are uploaded (only for existing products)
    if (product && imageUrls.length > 0) {
      const submitData: any = {
        ...formRef.current,
        imageUrl: imageUrls
      };
      // Remove imageUrls since backend expects imageUrl
      delete submitData.imageUrls;
      console.log('Auto-saving product with new images:', submitData.imageUrl);

      try {
        await onSave(submitData);
        toast({ 
          title: "Images Updated", 
          description: "Product images have been saved successfully" 
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        toast({ 
          title: "Auto-save Failed", 
          description: "Images uploaded but failed to save to product. Please click Save Product manually.", 
          variant: "destructive" 
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Map imageUrls to imageUrl for backend compatibility
    const submitData = {
      ...formData,
      imageUrl: formData.imageUrls
    };
    // Remove imageUrls since backend expects imageUrl
    delete submitData.imageUrls;
    console.log('Submitting product with imageUrl:', submitData.imageUrl);
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-gray-900 border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            {product ? 'Edit Product' : 'Add New Product'}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/70">Product Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white/70">Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Restaurant, Lounge, City"
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-white/70">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product or experience"
                rows={3}
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/70">Price ($)</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white/70">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white/70">Product Images</Label>
              <MultiImageUpload
                onImagesChange={handleImagesChange}
                initialImages={formData.imageUrls}
                maxFiles={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/70">Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://website.com"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white/70">Purchase Link</Label>
                <Input
                  value={formData.purchaseLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseLink: e.target.value }))}
                  placeholder="https://buy-link.com"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-white/70">Rating (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isActive" className="text-white/70">Active</Label>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isFeatured" className="text-white/70">Featured</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black">
                {product ? 'Update Product' : 'Add Product'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}