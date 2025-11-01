import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CelebrityTournaments from "@/components/CelebrityTournaments";
import { AIFeaturesTabs } from "@/components/AIFeatures";
import { Celebrity, Brand, CelebrityBrand } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ShoppingBag, Sparkles, Upload, Camera, Video, Calendar, Star, UserPlus,  ExternalLink, MapPin, Instagram, Twitter, Youtube, Music2 } from "lucide-react";
import FashionStyleEpisodes from "@/components/FashionStyleEpisodes";
import { useEffect, useState } from "react";
import BrandModal from "@/components/BrandModal";
import BrandImage from "@/components/BrandImage";
import { toast } from "@/hooks/use-toast";
import OccasionPricing from "@/components/OccasionPricing";
import StylingDetails from "@/components/StylingDetails";

import LiveEvents from "@/components/LiveEvents";
import SKKNProducts from "@/components/SKKNProducts";
import MediaUpload from "@/components/MediaUpload";
import { motion } from "framer-motion";
import { FallbackImage } from "@/components/ui/fallback-image";
import { LuxuryItemCard } from "@/components/ui/luxury-item-card";
import PersonalFavourite from "@/components/PersonalFavourite";
import AccessibleCollection from "@/components/AccessibleCollection";

// Define types for celebrityBrands items
export interface CelebrityBrandWithDetails {
  id: number;
  celebrityId: number;
  brandId: number;
  brand?: Brand;
  itemType: string;
  description: string;
  categoryId?: number | null;
  imagePosition?: {
    top: string;
    left: string;
  };
  relationshipStartYear?: number | null;
  equipmentSpecs?: {
    weight?: string;
    size?: string;
    material?: string;
    stringTension?: string;
    color?: string;
    releaseYear?: string;
    price?: string;
    purchaseLink?: string;
    stockStatus?: string;
    serialNumber?: string;
    ratings?: {
      quality?: number;
      comfort?: number;
      style?: number;
      value?: number;
    }
  };
  occasionPricing?: {
    [key: string]: {
      price: string;
      discount?: string;
      availableColors?: string[];
      customOptions?: string[];
      limitedEdition?: boolean;
    }
  } | null;
  grandSlamAppearances?: string[];
}

export default function CelebrityProfile() {
  const [_, params] = useRoute("/celebrity/:id");
  const celebrityId = params?.id ? parseInt(params.id) : 0;
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Allow deep linking to a specific tab via query string or hash
  const initialTabFromUrl = new URLSearchParams(window.location.search).get('tab') || (window.location.hash ? window.location.hash.slice(1) : null);
  const [activeTab, setActiveTab] = useState<string>(initialTabFromUrl || 'overview');

  const { data: celebrity, isLoading, error } = useQuery<Celebrity>({
    queryKey: ["/api/celebrities", celebrityId],
    queryFn: async () => {
      const response = await fetch(`/api/celebrities/${celebrityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch celebrity data');
      }
      return response.json();
    },
    enabled: !!celebrityId,
  });

  // Prefer the resolved celebrity.id from API; fall back to route param
  const effectiveCelebrityId = celebrity?.id ?? celebrityId;

  // Fetch linked user to display social media links
  const { data: celebrityUser } = useQuery<any>({
    queryKey: ["/api/users", celebrity?.userId ?? 0],
    queryFn: async () => {
      if (!celebrity?.userId) return null;
      const response = await fetch(`/api/users/${celebrity.userId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!celebrity?.userId,
  });

  const toSocialUrl = (platform: "instagram" | "twitter" | "youtube" | "tiktok", value: string) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    const handle = value.replace(/^@/, "");
    switch (platform) {
      case "instagram":
        return `https://instagram.com/${handle}`;
      case "twitter":
        return `https://twitter.com/${handle}`;
      case "youtube":
        return `https://youtube.com/@${handle}`;
      case "tiktok":
        return `https://tiktok.com/@${handle}`;
      default:
        return value;
    }
  };

  const platformStyles = {
    instagram: {
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      ring: "ring-pink-400/40",
      Icon: Instagram,
    },
    twitter: {
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      ring: "ring-sky-400/40",
      Icon: Twitter,
    },
    youtube: {
      color: "text-red-500",
      bg: "bg-red-500/10",
      ring: "ring-red-500/40",
      Icon: Youtube,
    },
    tiktok: {
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
      ring: "ring-fuchsia-400/40",
      Icon: Music2,
    },
  } as const;

  const SocialBadge = (
    { platform, value }: { platform: "instagram" | "twitter" | "youtube" | "tiktok"; value: string }
  ) => {
    if (!value) return null;
    const href = toSocialUrl(platform, value);
    const label = formatSocialLabel(platform, value);
    const { Icon, color, bg, ring } = platformStyles[platform];
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${platform} ${label}`}
        title={`${platform} ${label}`}
        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition"
      >
        <span className={`inline-flex items-center justify-center rounded-full ${bg} ${ring} ring-1 w-9 h-9`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </span>
      </a>
    );
  };

  const formatSocialLabel = (
    platform: "instagram" | "twitter" | "youtube" | "tiktok",
    value: string
  ) => {
    if (!value) return "";
    // If a handle or simple string, normalize to @handle
    if (!/^https?:\/\//i.test(value)) {
      const handle = value.replace(/^@/, "");
      return `@${handle}`;
    }
    // For URLs, try to extract a friendly handle; otherwise show platform name
    try {
      const url = new URL(value);
      const path = url.pathname.replace(/^\/+/, "");
      const parts = path.split("/").filter(Boolean);
      if (platform === "instagram") {
        const handle = parts[0];
        return handle ? `@${handle}` : "Instagram";
      }
      if (platform === "twitter") {
        const handle = parts[0];
        return handle ? `@${handle}` : "Twitter";
      }
      if (platform === "youtube") {
        const m = path.match(/@([^\/]+)/);
        return m ? `@${m[1]}` : "YouTube";
      }
      if (platform === "tiktok") {
        const m = path.match(/@([^\/]+)/);
        const handle = m ? m[1] : parts[0];
        return handle ? `@${handle}` : "TikTok";
      }
      return value;
    } catch {
      return value;
    }
  };

  const { data: celebrityBrands, isLoading: brandsLoading } = useQuery<CelebrityBrandWithDetails[]>({
    queryKey: ["/api/celebritybrands", effectiveCelebrityId],
    queryFn: async () => {
      const response = await fetch(`/api/celebritybrands/${effectiveCelebrityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch celebrity brands data');
      }
      const data = await response.json();
      return data;
    },
    enabled: !!effectiveCelebrityId,
  });

  // AI style analysis for Style Notes
  const { data: styleAnalysis, isLoading: styleLoading } = useQuery<string>({
    queryKey: ["/api/ai/style-analysis", celebrityId],
    queryFn: async () => {
      const response = await fetch(`/api/ai/style-analysis/${celebrityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch style analysis');
      }
      const json = await response.json();
      return json.analysis as string;
    },
    enabled: !!celebrityId,
  });

  // Celebrity products type and query for filtered sections
  interface CelebrityProduct {
    id: number;
    celebrityId: number;
    name: string;
    description: string;
    category: string;
    imageUrl: string | string[];
    price: string;
    location?: string;
    website?: string;
    purchaseLink?: string;
    rating?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery<CelebrityProduct[]>({
    queryKey: ['celebrity-products', effectiveCelebrityId],
    queryFn: async () => {
      const res = await fetch(`/api/celebrity-products?celebrityId=${effectiveCelebrityId}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json() as CelebrityProduct[];
    },
    enabled: !!effectiveCelebrityId,
  });

  // Load the currently logged-in user for personalized headings
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/auth/user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleOpenBrandModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowBrandModal(true);
  };

  const handleCloseBrandModal = () => {
    setShowBrandModal(false);
  };

  if (isLoading) {
    return (
      <div className="bg-dark min-h-screen">
        <Header />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-[500px] w-full bg-midgray" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !celebrity) {
    return (
      <div className="bg-dark min-h-screen">
        <Header />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="text-center max-w-lg">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Celebrity Not Found</h1>
            <p className="text-light/70 mb-6">
              We couldn't find the celebrity you're looking for. They might be keeping a low profile.
            </p>
            <Button asChild>
              <a href="/">Return to Homepage</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Guard: hide inactive profiles from public view
  if (celebrity && celebrity.isActive === false) {
    return (
      <div className="bg-dark min-h-screen">
        <Header />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="text-center max-w-lg">
            <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Celebrity Unavailable</h1>
            <p className="text-light/70 mb-6">
              This profile is currently inactive.
            </p>
            <Button asChild>
              <a href="/">Return to Homepage</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="bg-dark min-h-screen">
      <Header />
      
      <motion.div 
        className="pt-24 pb-16 bg-darkgray"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left column: Celebrity image and info */}
            <div className="md:w-1/2">
              <div className="aspect-[3/4] overflow-hidden rounded-lg relative max-w-[400px] mx-auto">
                <FallbackImage 
                  src={celebrity.imageUrl || ""} 
                  backupSrc={celebrityUser?.profilePicture || celebrityUser?.imageUrl || undefined}
                  alt={`${celebrity.name} fashion`}
                  fallbackSrc="/assets/product-placeholder.svg"
                  fallbackText={celebrity.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Brand hotspots */}
                {!brandsLoading && celebrityBrands && Array.isArray(celebrityBrands) && celebrityBrands
                  .filter(item => item.imagePosition !== undefined)
                  .map((item: CelebrityBrandWithDetails) => (
                    <div 
                      key={item.id} 
                      className="absolute" 
                      style={{ 
                        top: item.imagePosition?.top || '0', 
                        left: item.imagePosition?.left || '0' 
                      }}
                      onClick={() => item.brand && handleOpenBrandModal(item.brand)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/80 border-2 border-light flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
                        <span className="text-xs font-bold text-dark">+</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Right column: Details */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold uppercase tracking-widest text-sm font-semibold">Celebrity Profile</span>
                <Button 
                  className="bg-gold text-dark hover:bg-gold/80 text-sm px-4 py-2 h-auto font-bold border-none shadow-lg"
                  onClick={() => {
                    toast({
                      title: "Following " + celebrity.name,
                      description: "You are now following " + celebrity.name + "'s style updates",
                    });
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2 fill-dark" /> FOLLOW
                </Button>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair text-light mb-4">{celebrity.name}</h1>
              <p className="text-light/70 mb-8">{celebrity.profession}</p>
              
              <div className="mb-8">
                <h2 className="text-gold font-semibold mb-3 uppercase tracking-wider text-sm">About</h2>
                <p className="text-light/80">{celebrity.description}</p>
              </div>

              {celebrityUser && (celebrityUser.instagram || celebrityUser.twitter || celebrityUser.youtube || celebrityUser.tiktok) && (
                <div className="mb-8">
                  <h2 className="text-gold font-semibold mb-3 uppercase tracking-wider text-sm">Social</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    {celebrityUser.instagram && (
                      <SocialBadge platform="instagram" value={celebrityUser.instagram} />
                    )}
                    {celebrityUser.twitter && (
                      <SocialBadge platform="twitter" value={celebrityUser.twitter} />
                    )}
                    {celebrityUser.youtube && (
                      <SocialBadge platform="youtube" value={celebrityUser.youtube} />
                    )}
                    {celebrityUser.tiktok && (
                      <SocialBadge platform="tiktok" value={celebrityUser.tiktok} />
                    )}
                  </div>
                </div>
              )}
              
              {!brandsLoading && celebrityBrands && Array.isArray(celebrityBrands) && (
                <div className="mb-8">
                  <h2 className="text-gold font-semibold mb-3 uppercase tracking-wider text-sm">Brands Worn</h2>
                  <div className="flex flex-wrap gap-2">
                    {celebrityBrands.map((item: CelebrityBrandWithDetails) => (
                      <span 
                        key={item.id}
                        onClick={() => item.brand && handleOpenBrandModal(item.brand)}
                        className="brand-tag px-3 py-1 rounded bg-midgray text-light hover:bg-gold hover:text-dark cursor-pointer transition-colors"
                      >
                        {item.brand?.name} ({item.itemType})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h2 className="text-gold font-semibold mb-3 uppercase tracking-wider text-sm">Style Notes</h2>
                <p className="text-light/80">
                  {styleLoading
                    ? 'Analyzing style…'
                    : (celebrity.styleNotes ?? styleAnalysis ?? `${celebrity.name}'s signature style features a mix of high-end designer pieces with unique personal touches that showcase their distinctive fashion sense.`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tournament and Equipment Data Section */}
      <div className="py-16 bg-white text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)} className="w-full">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-1 mb-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-transparent to-amber-600/20 animate-pulse"></div>
              <TabsList className="relative w-full bg-transparent border-none justify-start overflow-x-auto scrollbar-hide">
                <TabsTrigger 
                  value="overview" 
                  className="tab-glow group relative px-6 py-3 text-white hover:text-amber-400 data-[state=active]:text-amber-400 data-[state=active]:bg-amber-600/10 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-600/30 data-[state=active]:border-amber-600/50 backdrop-blur-sm shadow-lg hover:shadow-amber-600/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <Star className="w-4 h-4 mr-2 relative z-10 group-hover:text-amber-400 transition-colors" />
                  <span className="relative z-10 font-medium whitespace-nowrap">Personal Favourite</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="specifications"
                  className="tab-glow group relative px-6 py-3 text-white hover:text-amber-400 data-[state=active]:text-amber-400 data-[state=active]:bg-amber-600/10 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-600/30 data-[state=active]:border-amber-600/50 backdrop-blur-sm shadow-lg hover:shadow-amber-600/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <Sparkles className="w-4 h-4 mr-2 relative z-10 group-hover:text-amber-400 transition-colors" />
                  <span className="relative z-10 font-medium whitespace-nowrap">Personal Brand</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="shopping" 
                  className="tab-glow group relative px-6 py-3 text-white hover:text-amber-400 data-[state=active]:text-amber-400 data-[state=active]:bg-amber-600/10 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-600/30 data-[state=active]:border-amber-600/50 backdrop-blur-sm shadow-lg hover:shadow-amber-600/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <ShoppingBag className="w-4 h-4 mr-2 relative z-10 group-hover:text-amber-400 transition-colors" />
                  <span className="relative z-10 font-medium whitespace-nowrap">Shopping playlist</span>
                </TabsTrigger><TabsTrigger 
                  value="media" 
                  className="tab-glow group relative px-6 py-3 text-white hover:text-amber-400 data-[state=active]:text-amber-400 data-[state=active]:bg-amber-600/10 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-600/30 data-[state=active]:border-amber-600/50 backdrop-blur-sm shadow-lg hover:shadow-amber-600/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <Upload className="w-4 h-4 mr-2 relative z-10 group-hover:text-amber-400 transition-colors" />
                  <span className="relative z-10 font-medium whitespace-nowrap">Celeconnect</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="events" 
                  className="tab-glow group relative px-6 py-3 text-white hover:text-amber-400 data-[state=active]:text-amber-400 data-[state=active]:bg-amber-600/10 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-600/30 data-[state=active]:border-amber-600/50 backdrop-blur-sm shadow-lg hover:shadow-amber-600/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <Sparkles className="w-4 h-4 mr-2 relative z-10 group-hover:text-amber-400 transition-colors" />
                  <span className="relative z-10 font-medium whitespace-nowrap">AI Stylist</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="videos" 
                  className="tab-glow group relative px-6 py-3 text-white hover:text-amber-400 data-[state=active]:text-amber-400 data-[state=active]:bg-amber-600/10 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-600/30 data-[state=active]:border-amber-600/50 backdrop-blur-sm shadow-lg hover:shadow-amber-600/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <Video className="w-4 h-4 mr-2 relative z-10 group-hover:text-amber-400 transition-colors" />
                  <span className="relative z-10 font-medium whitespace-nowrap">Fashion & Style episodes</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="mt-6">
              {celebrity.id === 100 ? (
                <div className="mb-8">
                  <h3 className="text-3xl font-playfair font-bold mb-8 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">
                    {(() => {
                      const disp = (currentUser?.displayName || currentUser?.firstName || currentUser?.username || (currentUser?.email ? currentUser.email.split('@')[0] : '') || '').trim();
                      return disp ? `${disp}'s Favorite Experiences` : `${celebrity.name}'s Favorite Experiences`;
                    })()}
                  </h3>
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-8 rounded-lg shadow-md mb-8 border border-amber-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Favorite Restaurant */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
                        <h4 className="text-xl font-playfair font-semibold mb-6 text-amber-600 border-b border-amber-200 pb-2">
                          Favorite Restaurant
                        </h4>
                        <div className="space-y-5">
                          <div className="flex flex-col space-y-4">
                            <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/places/cut_wolfgang_puck.jpg" 
                                alt="Cut by Wolfgang Puck" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Michelin-Starred Steakhouse</span>
                              </div>
                              <a
                                href="https://www.wolfgangpuck.com/dining/cut/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                Cut by Wolfgang Puck
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Fine Dining</span>
                                <span className="ml-2 text-xs text-neutral-500">Premium Steaks</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                Michelin-starred steakhouse by legendary chef Wolfgang Puck, known for premium cuts of beef, sophisticated ambiance, and exceptional service.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Favorite Cities */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
                        <h4 className="text-xl font-playfair font-semibold mb-6 text-amber-600 border-b border-amber-200 pb-2">
                          Favorite Cities
                        </h4>
                        <div className="space-y-5">
                          <div className="flex flex-col space-y-4">
                            <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/places/london_dubai.jpg" 
                                alt="London and Dubai" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Global Metropolises</span>
                              </div>
                              <div className="text-lg font-playfair text-amber-600">
                                London & Dubai
                              </div>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Luxury Lifestyle</span>
                                <span className="ml-2 text-xs text-neutral-500">Cultural Hubs</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                London and Dubai - Cosmopolitan hubs blending tradition with innovation, offering unparalleled luxury experiences and cultural diversity.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Favorite Lounge */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
                        <h4 className="text-xl font-playfair font-semibold mb-6 text-amber-600 border-b border-amber-200 pb-2">
                          Favorite Lounge
                        </h4>
                        <div className="space-y-5">
                          <div className="flex flex-col space-y-4">
                            <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/places/bungalow_santa_monica.jpg" 
                                alt="Bungalow Santa Monica" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Beachfront Lounge</span>
                              </div>
                              <a
                                href="https://www.thebungalow.com/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                Bungalow Santa Monica
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Exclusive</span>
                                <span className="ml-2 text-xs text-neutral-500">Craft Cocktails</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                Stylish beachfront lounge in Santa Monica offering craft cocktails, ocean views, and sophisticated atmosphere with a curated music selection.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  {celebrity.stylingDetails && celebrity.id !== 100 && (
                    <div className="mt-8">
                      <h3 className="text-3xl font-playfair font-bold mb-8 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Luxury Brand Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {celebrity.stylingDetails
                          .filter(look => 
                            look.occasion !== "Favorite Restaurant" && 
                            look.occasion !== "Favorite Cities" && 
                            look.occasion !== "Favorite Lounge" &&
                            look.occasion !== "Executive Fashion"
                          )
                          .map((look, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
                              <h4 className="text-xl font-playfair font-semibold mb-6 text-amber-600 border-b border-amber-200 pb-2">
                                {look.occasion}
                              </h4>
                              <div className="space-y-4">
                                <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                                  <img 
                                    src={look.image} 
                                    alt={look.outfit.designer} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="mb-1">
                                    <span className="font-medium text-neutral-700">{look.outfit.designer}</span>
                                  </div>
                                  <a
                                    href={look.outfit.purchaseLink || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-lg font-playfair text-amber-600 hover:underline"
                                  >
                                    {look.outfit.designer}
                                  </a>
                                  <div className="flex items-center mt-1">
                                    <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{look.outfit.price}</span>
                                  </div>
                                  <p className="mt-2 text-sm text-gray-600">
                                    {look.outfit.details}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              ) : celebrity.id === 10 ? (
                <div className="mb-8">
                  <h3 className="text-3xl font-playfair font-bold mb-8 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Taylor's Favorite Places</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Favorite Restaurant */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-6">
                        <h4 className="text-xl font-playfair font-semibold mb-4 text-amber-600 border-b border-gray-200 pb-2">
                          Favorite Restaurant
                        </h4>
                        <div className="rounded-lg overflow-hidden mb-4">
                          <img 
                            src={celebrity.stylingDetails?.find(detail => detail.occasion === "Favorite Restaurant")?.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"} 
                            alt="Cornelia Street Cafe" 
                            className="w-full h-48 object-cover" 
                          />
                        </div>
                        <h5 className="text-lg font-medium text-gray-800 mb-1">Michelin-Starred Cafe</h5>
                        <h6 className="text-amber-600 font-semibold mb-3">Cornelia Street Cafe</h6>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Fine Dining</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Artistic Atmosphere</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Intimate Greenwich Village cafe that inspired her song 'Cornelia Street', known for its artistic atmosphere and delicious comfort food.
                        </p>
                      </div>
                    </div>

                    {/* Favorite Cities */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-6">
                        <h4 className="text-xl font-playfair font-semibold mb-4 text-amber-600 border-b border-gray-200 pb-2">
                          Favorite Cities
                        </h4>
                        <div className="rounded-lg overflow-hidden mb-4">
                          <div className="grid grid-cols-2 gap-1">
                            <img 
                              src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                              alt="New York" 
                              className="w-full h-48 object-cover" 
                            />
                            <img 
                              src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                              alt="London" 
                              className="w-full h-48 object-cover" 
                            />
                          </div>
                        </div>
                        <h5 className="text-lg font-medium text-gray-800 mb-1">Global Metropolises</h5>
                        <h6 className="text-amber-600 font-semibold mb-3">New York & London</h6>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Luxury Lifestyle</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Cultural Hubs</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          New York inspired her album '1989', while London became her part-time home and influenced songs like 'London Boy'.
                        </p>
                      </div>
                    </div>

                    {/* Favorite Lounge */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-6">
                        <h4 className="text-xl font-playfair font-semibold mb-4 text-amber-600 border-b border-gray-200 pb-2">
                          Favorite Lounge
                        </h4>
                        <div className="rounded-lg overflow-hidden mb-4">
                          <img 
                            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                            alt="Electric Lady Studios" 
                            className="w-full h-48 object-cover" 
                          />
                        </div>
                        <h5 className="text-lg font-medium text-gray-800 mb-1">Iconic Recording Studio</h5>
                        <h6 className="text-amber-600 font-semibold mb-3">Electric Lady Studios</h6>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Exclusive</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Recording Studios</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Historic New York recording studio founded by Jimi Hendrix where Taylor recorded parts of her albums 'Folklore' and 'Midnights'.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {celebrity.stylingDetails && (
                    <div className="mt-8">
                      <StylingDetails 
                        looks={celebrity.stylingDetails.filter(look => 
                          !['Favorite Restaurant', 'Favorite Cities', 'Favorite Lounge'].includes(look.occasion)
                        ) as any[]} 
                        className="mb-8"
                      />
                    </div>
                  )}
                </div>
              ) : celebrity.id === 22 ? (
                <div className="mb-8">
                  <h3 className="text-3xl font-playfair font-bold mb-8 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Tom Cruise's Personal Favourites</h3>
                  
                  {/* Personal Favourite tab content */}
                  <PersonalFavourite 
                    items={celebrityBrands || []} 
                    celebrity={celebrity}
                  />

                  {celebrity.stylingDetails && (
                    <div className="mt-8">
                      <StylingDetails 
                        looks={celebrity.stylingDetails.filter(look => !look.occasion.includes("Favorite")) as any[]} 
                        className="mb-8"
                      />
                    </div>
                  )}
                </div>
              ) : celebrity.id === 27 ? (
                <div className="mb-8">
                  <h3 className="text-3xl font-playfair font-bold mb-8 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Shah Rukh Khan's Favorite Places</h3>
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-8 rounded-lg shadow-md mb-8 border border-amber-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Favorite Restaurants */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
                        <h4 className="text-xl font-playfair font-semibold mb-6 text-amber-600 border-b border-amber-200 pb-2">
                          Favorite Restaurants
                        </h4>
                        <div className="space-y-5">
                          <div className="flex flex-col space-y-4">
                            <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/bungalow/entrance.jpg" 
                                alt="Bungalow NYC" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Exclusive NYC Restaurant</span>
                              </div>
                              <a
                                href="https://www.bungalowny.com/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                Bungalow NYC
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Upscale Dining</span>
                                <span className="ml-2 text-xs text-neutral-500">Creative Cocktails</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                Shah Rukh Khan enjoys dining at Bungalow in NYC, an exclusive restaurant known for its upscale atmosphere, creative cocktails, and contemporary American cuisine with global influences.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  {celebrity.stylingDetails && (
                    <div className="mt-8">
                      <StylingDetails 
                        looks={celebrity.stylingDetails.filter(look => look.occasion !== "Personal Favorite Restaurant") as any[]} 
                        className="mb-8"
                      />
                    </div>
                  )}
                </div>
              ) : celebrity.id === 15 ? (
                <div className="mb-8">
                  <h3 className="text-3xl font-playfair font-bold mb-8 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Kim's Favorite Things</h3>
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-8 rounded-lg shadow-md mb-8 border border-amber-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Fragrance Preferences */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
                        <h4 className="text-xl font-playfair font-semibold mb-6 text-amber-600 border-b border-amber-200 pb-2">
                          Fragrance Preferences
                        </h4>
                        <div className="space-y-5">
                          <div className="flex flex-col space-y-4">
                            <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/kim-kardashian/perfume/kkw-fragrance.png" 
                                alt="KKW Fragrance Collection" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">KKW Fragrance Collection</span>
                              </div>
                              <a
                                href="https://kkwfragrance.com/collections/all-products" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                KKW Diamonds Collection
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">$40.00 - $60.00</span>
                                <span className="ml-2 text-xs text-neutral-500">Signature crystal bottle design</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                Featuring Kim, KhloÃ©, and Kourtney in the iconic diamond-inspired bottles. Each fragrance represents their unique personalities with pink, clear, and yellow diamond variants.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-4 mt-8">
                            <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/kim-kardashian/perfume/kai-perfume.png" 
                                alt="Kai Perfume Oil" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Signature Scent</span>
                              </div>
                              <a
                                href="https://kaifragrance.com/collections/all/products/kai-perfume-oil" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                Kai Perfume Oil
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">$48.00</span>
                                <span className="ml-2 text-xs text-neutral-500">Gardenia & white exotics</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                This luxurious perfume oil is known for its delicate white floral scent, featuring gardenia as the primary note. The oil format makes it long-lasting and subtle, perfect for layering or wearing alone.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-4 mt-8">
                            <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/kim-kardashian/perfume/diptyque-candles.png" 
                                alt="Diptyque Candle Collection" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Home Scent Collection</span>
                              </div>
                              <a
                                href="https://www.diptyqueparis.com/en_us/p/scented-candle-baies-berries-190g.html" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                Diptyque Luxury Candles
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">$70.00 - $120.00</span>
                                <span className="ml-2 text-xs text-neutral-500">Baies, Ambre, Feu de Bois</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                Kim's home features the iconic Diptyque candle collection, especially the Baies scent (blackcurrant and rose). These luxury candles are known for their sophisticated glass containers with the brand's distinctive oval labels and long-lasting fragrances.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      

                      {/* Fashion Favorites */}
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
                        <h4 className="text-xl font-playfair font-semibold mb-6 text-amber-600 border-b border-amber-200 pb-2">
                          Fashion Favorites
                        </h4>
                        <div className="space-y-5">
                          <div>
                            <div className="mb-3">
                              <span className="font-medium text-neutral-700">Preferred Designers</span>
                            </div>
                            <div className="w-full overflow-hidden rounded-lg border border-amber-100 mb-4">
                              <img 
                                src="/assets/kim-kardashian/fashion-favorites/preferred-designers-new.png" 
                                alt="Kim Kardashian's preferred designers" 
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3">
                              <a
                                href="https://www.balenciaga.com/en-us/collections/women" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex flex-col items-center"
                              >
                                <div className="w-32 h-16 bg-white rounded-md overflow-hidden border border-gray-200 flex items-center justify-center p-1">
                                  <img 
                                    src="/assets/brands/balenciaga-logo.webp" 
                                    alt="Balenciaga logo" 
                                    className="w-full h-auto object-contain"
                                  />
                                </div>
                                <span className="text-amber-600 hover:underline text-sm mt-1 font-medium">Balenciaga</span>
                              </a>
                              <a
                                href="https://www.rickowens.eu/en/US/women/products/new-collection" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex flex-col items-center"
                              >
                                <div className="w-32 h-16 bg-black rounded-md overflow-hidden border border-gray-600 flex items-center justify-center p-1">
                                  <img 
                                    src="/assets/brands/rick-owens-logo.png" 
                                    alt="Rick Owens logo" 
                                    className="w-full h-auto object-contain"
                                  />
                                </div>
                                <span className="text-amber-600 hover:underline text-sm mt-1 font-medium">Rick Owens</span>
                              </a>
                              <a
                                href="https://www.mugler.com/us/en" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex flex-col items-center"
                              >
                                <div className="w-32 h-16 bg-black rounded-md overflow-hidden border border-gray-600 flex items-center justify-center p-1">
                                  <img 
                                    src="/assets/brands/mugler-logo.webp" 
                                    alt="Mugler logo" 
                                    className="w-full h-auto object-contain"
                                  />
                                </div>
                                <span className="text-amber-600 hover:underline text-sm mt-1 font-medium">Mugler</span>
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-4 mt-6">
                            <div className="w-full h-56 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/kim-kardashian/fashion/skims-bodysuit.png" 
                                alt="Kim wearing SKIMS bodysuit" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">SKIMS Signature Look</span>
                              </div>
                              <a
                                href="https://skims.com/products/sculpting-bodysuit-above-the-knee-onyx" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                SKIMS Sculpting Bodysuit
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">$68.00</span>
                                <span className="ml-2 text-xs text-neutral-500">Nude sculpting bodysuit</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                As the founder of SKIMS, Kim regularly showcases her own shapewear line. This sculpting bodysuit is one of her signature pieces, designed to contour and enhance the natural silhouette while providing comfort for everyday wear.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-4 mt-6">
                            <div className="w-full h-48 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                              <img 
                                src="/assets/kim-kardashian/fashion/manolo-blahnik-heels.png" 
                                alt="Manolo Blahnik pink suede heels" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Luxury Footwear</span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <a
                                  href="https://www.manoloblahnik.com/us/women/shoes/" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-lg font-playfair text-amber-600 hover:underline"
                                >
                                  Manolo Blahnik BB Pumps
                                </a>
                              </div>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">$665.00 - $995.00</span>
                                <span className="ml-2 text-xs text-neutral-500">Pink suede, 105mm heel</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">
                                Kim is frequently spotted wearing Manolo Blahnik's signature BB pumps, often pairing them with sleek outfits for a sophisticated look. The pointed-toe stilettos have become a staple in her wardrobe for red carpet events and formal appearances.
                              </p>
                              <div className="mt-3">
                                <span className="text-sm font-medium text-neutral-700">Also Wears:</span>
                                <div className="flex items-center gap-2 flex-wrap mt-1">
                                  <a
                                    href="https://yeezygap.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-amber-600 hover:underline font-playfair"
                                  >
                                    Yeezy shoes
                                  </a>
                                  <span className="text-amber-300 font-light">|</span>
                                  <a
                                    href="https://www.balenciaga.com/en-us/women/shoes/pumps" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-amber-600 hover:underline font-playfair"
                                  >
                                    Balenciaga pumps
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Beauty & Wellness Section */}
                    <div className="mt-8">
                      <h4 className="text-xl font-playfair font-semibold mb-6 text-amber-600 border-b border-amber-200 pb-2">
                        Beauty & Wellness
                      </h4>
                      
                      <div className="w-full overflow-hidden rounded-lg border border-amber-100 mb-6">
                        <img 
                          src="/assets/kim-kardashian/beauty-wellness/beauty-wellness-grid.png" 
                          alt="Kim Kardashian's beauty and wellness products" 
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
                          <div className="flex flex-col h-full">
                            <div className="w-full h-48 mb-4 rounded overflow-hidden bg-neutral-50 border border-amber-100">
                              <img 
                                src="https://skknbykim.com/cdn/shop/files/SKKN-9-Piece-Bundle-Site-2.png" 
                                alt="SKKN BY KIM" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Skincare</span>
                              </div>
                              <a
                                href="https://skknbykim.com/collections/all-products/products/the-complete-collection" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                SKKN BY KIM nine-step routine
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">$575.00</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
                          <div className="flex flex-col h-full">
                            <h4 className="text-amber-700 font-medium mb-4">SKKN Core Products</h4>
                            <div className="mb-4 overflow-hidden rounded-lg">
                              <img 
                                src="/assets/kim-kardashian/beauty-wellness/skkn-exfoliator.png" 
                                alt="SKKN Exfoliator" 
                                className="w-full h-32 object-contain"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">SKKN Core Products</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <a
                                  href="https://skknbykim.com/collections/all-products/products/exfoliator" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-amber-600 hover:underline text-sm font-medium"
                                >
                                  Exfoliator <span className="text-xs text-amber-700 bg-amber-50 px-1 rounded">$45</span>
                                </a>
                                <a
                                  href="https://skknbykim.com/collections/all-products/products/hyaluronic-acid-serum" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-amber-600 hover:underline text-sm font-medium"
                                >
                                  Hyaluronic Acid Serum <span className="text-xs text-amber-700 bg-amber-50 px-1 rounded">$90</span>
                                </a>
                                <a
                                  href="https://skknbykim.com/collections/all-products/products/vitamin-c8-serum" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-amber-600 hover:underline text-sm font-medium"
                                >
                                  Vitamin C8 Serum <span className="text-xs text-amber-700 bg-amber-50 px-1 rounded">$90</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
                          <div className="flex flex-col h-full">
                            <div className="w-full h-48 mb-4 rounded overflow-hidden bg-neutral-50 border border-amber-100">
                              <img 
                                src="https://cdn.shopify.com/s/files/1/0019/6436/0396/products/product-contour-contour-kit-900x900_900x.jpg" 
                                alt="KKW Beauty contour kit" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="mb-1">
                                <span className="font-medium text-neutral-700">Makeup</span>
                              </div>
                              <a
                                href="https://kkwbeauty.com/collections/face/products/classic-contour-kit" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-playfair text-amber-600 hover:underline"
                              >
                                KKW Beauty contour kits
                              </a>
                              <div className="flex items-center mt-1">
                                <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">$32.00</span>
                                <span className="ml-2 text-xs text-neutral-500">And neutral lip colors</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 w-16 h-16 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                                <img 
                                  src="https://www.cartier.com/dw/image/v2/BGTJ_PRD/on/demandware.static/-/Sites-cartier-master/default/dw03d2e7d4/images/large/637761399468773287-2093904.png" 
                                  alt="Cartier watch" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <div className="mb-1">
                                  <span className="font-medium text-neutral-700">Accessories</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <a
                                    href="https://www.cartier.com/en-us/watches/collections/tank/" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-amber-600 hover:underline text-sm font-playfair"
                                  >
                                    Vintage Cartier watches
                                  </a>
                                  <span className="text-amber-300 font-light">|</span>
                                  <a
                                    href="https://www.balenciaga.com/en-us/accessories/sunglasses" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-amber-600 hover:underline text-sm font-playfair"
                                  >
                                    Statement sunglasses
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 w-16 h-16 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                                <img 
                                  src="https://m.media-amazon.com/images/I/61hIPZ+dxKL._SL1000_.jpg" 
                                  alt="Color Wow Dream Coat" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <div className="mb-1">
                                  <span className="font-medium text-neutral-700">Hair Care</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <a
                                    href="https://colorwow.com/products/dream-coat-supernatural-spray" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-amber-600 hover:underline text-sm font-playfair"
                                  >
                                    Color Wow Dream Coat
                                  </a>
                                  <span className="text-sm bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">$28</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <a
                                    href="https://olaplex.com/products/no-3-hair-perfector" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-amber-600 hover:underline text-sm font-playfair"
                                  >
                                    Olaplex treatments
                                  </a>
                                  <span className="text-sm bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">$30</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-16 h-16 bg-neutral-50 rounded-md overflow-hidden border border-amber-100">
                                <img 
                                  src="https://www.rolls-roycemotorcars.com/content/dam/rrmc/marketUK/rollsroycemotorcars_com/ghost-family/page-properties/rolls-royce-ghost-front-facing-hero-d.jpg" 
                                  alt="Rolls-Royce Ghost" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="mb-1">
                                  <span className="font-medium text-neutral-700">Luxury Indulgence</span>
                                </div>
                                <a
                                  href="https://www.rolls-roycemotorcars.com/en_US/showroom/ghost.html" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-amber-600 hover:underline text-sm font-playfair"
                                >
                                  Rolls-Royce Ghost
                                </a>
                                <div className="flex items-center mt-1">
                                  <span className="text-sm bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">$350,000+</span>
                                  <span className="ml-1 text-xs text-neutral-500">(custom gray)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              
              

              {/* Favourite Products from celebrity products (filtered) */}
              <div className="mt-12">
                {celebrity.id === 100 ? (
                  <>
                    {/* Zulqadar's Favorite (Experiences) Section */}
                    <h3 className="text-3xl font-playfair font-bold mb-6 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">{`${celebrity.name}'s Favorite Experiences`}</h3>
                    {productsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-48 bg-gray-200 animate-pulse"></div>
                            <div className="p-4 space-y-3">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      (() => {
                        const favExperiences = (products || []).filter(p => ((p.category || '').toLowerCase().includes('experiences')));
                        if (!favExperiences.length) {
                          const experienceLooks = (celebrity.stylingDetails || []).filter(look => 
                            look.occasion === 'Favorite Restaurant' ||
                            look.occasion === 'Favorite Lounge' ||
                            look.occasion === 'Favorite Cities' ||
                            look.occasion === 'Executive Fashion'
                          );
                          if (!experienceLooks.length) {
                            return (
                              <div className="text-center py-8 text-gray-600">No favourites added yet.</div>
                            );
                          }
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {experienceLooks.map((look, index) => {
                                const purchaseUrl = look.outfit?.purchaseLink || '';
                                return (
                                  <div key={index} className="group relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl border border-amber-200 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 hover:rotate-[0.15deg] ring-1 ring-amber-200 hover:ring-amber-400/50 overflow-hidden">
                                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                                      <img src={look.image || '/assets/placeholder.png'} alt={look.occasion} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <div className="p-6 space-y-3 bg-white/60 backdrop-blur-md">
                                      <h4 className="text-lg font-playfair font-semibold text-purple-900">{look.occasion}</h4>
                                      <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-1"></div>
                                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">{look.outfit?.designer}</div>
                                      {look.outfit?.price && (
                                        <div className="mt-1"><Badge className="bg-amber-100 text-amber-800 rounded-md px-2 py-0.5 ring-1 ring-amber-200 font-semibold">{look.outfit.price}</Badge></div>
                                      )}
                                      <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3">
                                        {purchaseUrl && (
                                          <Button asChild size="sm" className="w-full sm:flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg">
                                            <a href={purchaseUrl} target="_blank" rel="noreferrer" className="relative overflow-hidden"><span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span><ExternalLink className="w-4 h-4 mr-1 relative z-10" /> <span className="relative z-10">Shop Now</span></a>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favExperiences.map((product) => {
                              const img = (() => { const val = product.imageUrl as any; if (!val) return ''; if (Array.isArray(val)) return val[0] || ''; if (typeof val === 'string') { const trimmed = val.trim(); if (trimmed.startsWith('[')) { try { const arr = JSON.parse(trimmed); if (Array.isArray(arr)) return arr[0] || ''; } catch {} } return val; } return ''; })();
                              const purchaseUrl = product.purchaseLink || product.website || '';
                              return (
                                <div key={product.id} className="group relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 hover:rotate-[0.15deg] ring-1 ring-purple-200 hover:ring-purple-400/50 overflow-hidden">
                                  {product.isFeatured ? (
                                    <div className="absolute top-3 left-3"><Badge className="bg-purple-600 text-white">Most Popular</Badge></div>
                                  ) : null}
                                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                                    <img src={img || '/assets/placeholder.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <Sparkles className="absolute top-3 right-3 w-5 h-5 text-purple-400/70 drop-shadow" />
                                  </div>
                                  <div className="p-6 space-y-3 bg-white/60 backdrop-blur-md">
                                    <h4 className="text-lg font-playfair font-semibold text-purple-900">{product.name}</h4>
                                    <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-1"></div>
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">{product.category}</div>
                                    {/* Location hidden per request */}
                                    {/* {product.location && (
                                      <div className="flex items-center text-xs text-gray-500"><MapPin className="w-3 h-3 mr-1" />{product.location}</div>
                                    )} */}
                                    {product.price && (
                                      <div className="mt-1"><Badge className="bg-amber-100 text-amber-800 rounded-md px-2 py-0.5 ring-1 ring-amber-200 font-semibold">{product.price}</Badge></div>
                                    )}
                                    <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3">
                                      {purchaseUrl && (
                                        <Button asChild size="sm" className="w-full sm:flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg">
                                          <a href={purchaseUrl} target="_blank" rel="noreferrer" className="relative overflow-hidden"><span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span><ExternalLink className="w-4 h-4 mr-1 relative z-10" /> <span className="relative z-10">Shop Now</span></a>
                                        </Button>
                                      )}
                                      {product.website && (
                                        <Button asChild size="sm" variant="outline" className="w-full sm:flex-1 rounded-full border-purple-300 text-purple-700 hover:bg-purple-50">
                                          <a href={product.website} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Website</a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    )}

                    {/* Luxury Brand Preferences Section */}
                    <h3 className="text-3xl font-playfair font-bold mb-6 mt-12 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Luxury Brand Preferences</h3>
                    {productsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-48 bg-gray-200 animate-pulse"></div>
                            <div className="p-4 space-y-3">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      (() => {
                        const luxuryPrefs = (products || []).filter(p => ((p.category || '').toLowerCase() === 'luxury brand preferences'));
                        if (!luxuryPrefs.length) {
                          const luxuryLooks = (celebrity.stylingDetails || []).filter(look => 
                            look.occasion !== 'Favorite Restaurant' &&
                            look.occasion !== 'Favorite Lounge' &&
                            look.occasion !== 'Favorite Cities' &&
                            look.occasion !== 'Executive Fashion'
                          );
                          if (!luxuryLooks.length) {
                            return (
                              <div className="text-center py-8 text-gray-600">No luxury preferences added yet.</div>
                            );
                          }
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {luxuryLooks.map((look, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                                    <img src={look.image || '/assets/placeholder.png'} alt={look.occasion} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="p-6 space-y-3">
                                    <h4 className="text-lg font-playfair font-semibold text-amber-900">{look.occasion}</h4>
                                    <div className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent font-medium">{look.outfit?.designer}</div>
                                    {look.outfit?.price && (
                                      <div className="mt-1"><Badge className="bg-amber-100 text-amber-700 rounded-full px-2 ring-1 ring-amber-200">{look.outfit.price}</Badge></div>
                                    )}
                                    {look.outfit?.purchaseLink && (
                                      <div className="pt-3">
                                        <Button asChild size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700 text-white">
                                          <a href={look.outfit.purchaseLink} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Explore</a>
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {luxuryPrefs.map((product) => {
                              const img = (() => { const val = product.imageUrl as any; if (!val) return ''; if (Array.isArray(val)) return val[0] || ''; if (typeof val === 'string') { const trimmed = val.trim(); if (trimmed.startsWith('[')) { try { const arr = JSON.parse(trimmed); if (Array.isArray(arr)) return arr[0] || ''; } catch {} } return val; } return ''; })();
                              const purchaseUrl = product.purchaseLink || product.website || '';
                              return (
                                <div key={product.id} className="group relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 hover:rotate-[0.15deg] ring-1 ring-purple-200 hover:ring-purple-400/50 overflow-hidden">
                                  {product.isFeatured ? (
                                    <div className="absolute top-3 left-3"><Badge className="bg-purple-600 text-white">Most Popular</Badge></div>
                                  ) : null}
                                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                                    <img src={img || '/assets/placeholder.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <Sparkles className="absolute top-3 right-3 w-5 h-5 text-purple-400/70 drop-shadow" />
                                  </div>
                                  <div className="p-6 space-y-3 bg-white/60 backdrop-blur-md">
                                    <h4 className="text-lg font-playfair font-semibold text-purple-900">{product.name}</h4>
                                    <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-1"></div>
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">{product.category}</div>
                                    {/* Location hidden per request */}
                                    {/* {product.location && (
                                      <div className="flex items-center text-xs text-gray-500"><MapPin className="w-3 h-3 mr-1" />{product.location}</div>
                                    )} */}
                                    {product.price && (
                                      <div className="mt-1"><Badge className="bg-amber-100 text-amber-800 rounded-md px-2 py-0.5 ring-1 ring-amber-200 font-semibold">{product.price}</Badge></div>
                                    )}
                                    <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3">
                                      {purchaseUrl && (
                                        <Button asChild size="sm" className="w-full sm:flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg">
                                          <a href={purchaseUrl} target="_blank" rel="noreferrer" className="relative overflow-hidden"><span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span><ExternalLink className="w-4 h-4 mr-1 relative z-10" /> <span className="relative z-10">Shop Now</span></a>
                                        </Button>
                                      )}
                                      {product.website && (
                                        <Button asChild size="sm" variant="outline" className="w-full sm:flex-1 rounded-full border-purple-300 text-purple-700 hover:bg-purple-50">
                                          <a href={product.website} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Website</a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-playfair font-bold mb-6 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">{`${celebrity.name}'s Favorite Experiences`}</h3>
                    {productsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-48 bg-gray-200 animate-pulse"></div>
                            <div className="p-4 space-y-3">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      (() => {
                        const favExperiences = (products || []).filter(p => ((p.category || '').toLowerCase().includes('experiences')));
                        if (!favExperiences.length) {
                          const experienceLooks = (celebrity.stylingDetails || []).filter(look => 
                            look.occasion === 'Favorite Restaurant' ||
                            look.occasion === 'Favorite Lounge' ||
                            look.occasion === 'Favorite Cities' ||
                            look.occasion === 'Executive Fashion'
                          );
                          if (!experienceLooks.length) {
                            return (
                              <div className="text-center py-8 text-gray-600">No experiences added yet.</div>
                            );
                          }
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {experienceLooks.map((look, index) => {
                                const purchaseUrl = look.outfit?.purchaseLink || '';
                                return (
                                  <div key={index} className="group relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 hover:rotate-[0.15deg] ring-1 ring-purple-200 hover:ring-purple-400/50 overflow-hidden">
                                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                                      <img src={look.image || '/assets/placeholder.png'} alt={look.occasion} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                      <Sparkles className="absolute top-3 right-3 w-5 h-5 text-amber-400/70 drop-shadow" />
                                    </div>
                                    <div className="p-6 space-y-3 bg-white/60 backdrop-blur-md">
                                      <h4 className="text-lg font-playfair font-semibold text-amber-900">{look.occasion}</h4>
                                      <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-1"></div>
                                      <div className="text-sm text-gray-600">{look.outfit?.designer || 'Premium Experience'}</div>
                                      {purchaseUrl && (
                                        <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3">
                                          <Button asChild size="sm" className="w-full sm:flex-1 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 shadow-md hover:shadow-lg">
                                            <a href={purchaseUrl} target="_blank" rel="noreferrer" className="relative overflow-hidden">
                                              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>
                                              <ExternalLink className="w-4 h-4 mr-1 relative z-10" /> <span className="relative z-10">Explore</span>
                                            </a>
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favExperiences.map((product) => {
                              const img = (() => { const val = product.imageUrl as any; if (!val) return ''; if (Array.isArray(val)) return val[0] || ''; if (typeof val === 'string') { const trimmed = val.trim(); if (trimmed.startsWith('[')) { try { const arr = JSON.parse(trimmed); if (Array.isArray(arr)) return arr[0] || ''; } catch {} } return val; } return ''; })();
                              const purchaseUrl = product.purchaseLink || product.website || '';
                              return (
                                <div key={product.id} className="group relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl border border-amber-200 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 hover:rotate-[0.15deg] ring-1 ring-amber-200 hover:ring-amber-400/50 overflow-hidden">
                                  {product.isFeatured ? (
                                    <div className="absolute top-3 left-3"><Badge className="bg-amber-600 text-white">Most Popular</Badge></div>
                                  ) : null}
                                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                                    <img src={img || '/assets/placeholder.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <Sparkles className="absolute top-3 right-3 w-5 h-5 text-amber-400/70 drop-shadow" />
                                  </div>
                                  <div className="p-6 space-y-3 bg-white/60 backdrop-blur-md">
                                    <h4 className="text-lg font-playfair font-semibold text-amber-900">{product.name}</h4>
                                    <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-1"></div>
                                    <div className="bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent font-medium">{product.category}</div>
                                    {/* Location hidden per request */}
                                    {/* {product.location && (
                                      <div className="flex items-center text-xs text-gray-500"><MapPin className="w-3 h-3 mr-1" />{product.location}</div>
                                    )} */}
                                    {product.price && (
                                      <div className="mt-1"><Badge className="bg-amber-100 text-amber-800 rounded-md px-2 py-0.5 ring-1 ring-amber-200 font-semibold">{product.price}</Badge></div>
                                    )}
                                   {/* {product.description && (
                                      <p className="text-gray-600 text-sm">{product.description}</p>
                                    )}*/}
                                    <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3">
                                      {purchaseUrl && (
                                        <Button asChild size="sm" className="w-full sm:flex-1 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 shadow-md hover:shadow-lg">
                                          <a href={purchaseUrl} target="_blank" rel="noreferrer" className="relative overflow-hidden"><span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span><ExternalLink className="w-4 h-4 mr-1 relative z-10" /> <span className="relative z-10">Shop Now</span></a>
                                        </Button>
                                      )}
                                      {product.website && (
                                        <Button asChild size="sm" variant="outline" className="w-full sm:flex-1 rounded-full border-amber-300 text-amber-700 hover:bg-amber-50">
                                          <a href={product.website} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Website</a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    )}
                    <h3 className="text-3xl font-playfair font-bold mb-6 mt-10 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Luxury Brand Preferences</h3>
                    {productsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-48 bg-gray-200 animate-pulse"></div>
                            <div className="p-4 space-y-3">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      (() => {
                        const luxuryPrefs = (products || []).filter(p => ((p.category || '').toLowerCase() === 'luxury brand preferences'));
                        if (!luxuryPrefs.length) {
                          const luxuryLooks = (celebrity.stylingDetails || []).filter(look => 
                            look.occasion !== 'Favorite Restaurant' &&
                            look.occasion !== 'Favorite Lounge' &&
                            look.occasion !== 'Favorite Cities' &&
                            look.occasion !== 'Executive Fashion'
                          );
                          if (!luxuryLooks.length) {
                            return (
                              <div className="text-center py-8 text-gray-600">No luxury preferences added yet.</div>
                            );
                          }
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {luxuryLooks.map((look, index) => (
                                <div key={index} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
                                  <div className="relative bg-white overflow-hidden flex items-center justify-center h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
                                    <img src={look.image || '/assets/placeholder.png'} alt={look.occasion} className="max-h-full max-w-full object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.03] will-change-transform" loading="lazy" />
                                  </div>
                                  <div className="p-4 sm:p-5 space-y-3 flex flex-col">
                                    <h4 className="text-lg font-playfair font-semibold line-clamp-2">{look.occasion}</h4>
                                    {look.outfit?.designer && (
                                      <div className="text-sm text-neutral-600 line-clamp-1">{look.outfit.designer}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {luxuryPrefs.map((product) => {
                              const img = (() => { const val = product.imageUrl as any; if (!val) return ''; if (Array.isArray(val)) return val[0] || ''; if (typeof val === 'string') { const trimmed = val.trim(); if (trimmed.startsWith('[')) { try { const arr = JSON.parse(trimmed); if (Array.isArray(arr)) return arr[0] || ''; } catch {} } return val; } return ''; })();
                              const purchaseUrl = product.purchaseLink || product.website || '';
                              const discountedPrice = (product as any).discountedPrice || (product as any).salePrice || '';
                              return (
                                <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-md">
                                  <div className="relative bg-white overflow-hidden flex items-center justify-center h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
                                    <img src={img || '/assets/placeholder.png'} alt={product.name} className="max-h-full max-w-full object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.03] will-change-transform" loading="lazy" />
                                  </div>
                                  <div className="p-4 sm:p-5 space-y-3 flex flex-col">
                                    <h4 className="text-lg font-playfair font-semibold line-clamp-2">{product.name}</h4>
                                    <div className="text-sm text-neutral-600 line-clamp-1">{product.category}</div>
                                    {(product.price || discountedPrice) && (
                                      <div className="mt-1 flex items-baseline gap-3">
                                        {discountedPrice ? (
                                          <>
                                            <span className="text-lg font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-amber-200" aria-label={`Discounted price ${discountedPrice}`}>{discountedPrice}</span>
                                            {product.price && (
                                              <span className="text-sm text-neutral-500 line-through" aria-label={`Original price ${product.price}`}>{product.price}</span>
                                            )}
                                          </>
                                        ) : (
                                          <span className="text-base font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full ring-1 ring-amber-200" aria-label={`Price ${product.price}`}>{product.price}</span>
                                        )}
                                      </div>
                                    )}
                                    {purchaseUrl && (
                                      <div className="pt-2 flex justify-center">
                                        <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-white px-8 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-semibold min-w-[160px] sm:min-w-[180px] shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200">
                                          <a href={purchaseUrl} target="_blank" rel="noreferrer" aria-label={`Buy ${product.name}`}><ExternalLink className="w-5 h-5 mr-2" /> Buy</a>
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    )}
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tournaments">
              <CelebrityTournaments celebrityId={celebrityId} />
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold">
                  {celebrity.id === 15 
                    ? "Product Details & Purchase Information" 
                    : celebrity.id === 100 
                      ? "Luxury Collection"
                      : "Technical Specifications"
                  }
                </h3>
                <p className="text-gray-700">
                  {celebrity.id === 15 
                    ? `Explore the detailed features and purchase information for all of ${celebrity.name}'s signature products, from beauty and skincare to fragrances, clothing, accessories, and more.`
                    : celebrity.id === 100
                      ? `Discover both luxury and accessible collections curated for every budget. From premium brands to celebrity-inspired affordable alternatives.`
                      : `Professional tennis players require precisely tuned equipment to perform at their best. Below are the detailed specifications of ${celebrity.name}'s key equipment.`
                  }
                </p>
                
                {/* Add Accessible Collection for celebrity ID 100 (Zulqadar Rehman) at the top */}
                {celebrity.id === 100 && (
                  <AccessibleCollection />
                )}
                
                {celebrity.id === 15 ? (
                  <div className="mt-8">
                    <SKKNProducts />
                  </div>
                ) : !brandsLoading && celebrityBrands && Array.isArray(celebrityBrands) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {celebrityBrands
                      .filter((item: CelebrityBrandWithDetails) => item.equipmentSpecs && Object.keys(item.equipmentSpecs).length > 0)
                      .map((item: CelebrityBrandWithDetails) => (
                        <div key={item.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-xl">{item.description}</h4>
                              <p className="text-sm text-gray-500">{item.brand?.name}</p>
                            </div>
                            <div className="text-sm text-white bg-gold px-2 py-1 rounded">
                              {item.itemType}
                            </div>
                          </div>
                          
                          {item.equipmentSpecs && (
                            <div className="space-y-2">
                              {item.equipmentSpecs.weight && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Weight</span>
                                  <span className="font-medium">{item.equipmentSpecs.weight}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.size && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Size</span>
                                  <span className="font-medium">{item.equipmentSpecs.size}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.material && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Material</span>
                                  <span className="font-medium">{item.equipmentSpecs.material}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.stringTension && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">String Tension</span>
                                  <span className="font-medium">{item.equipmentSpecs.stringTension}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.color && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Color</span>
                                  <span className="font-medium">{item.equipmentSpecs.color}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.releaseYear && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Release Year</span>
                                  <span className="font-medium">{item.equipmentSpecs.releaseYear}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.price && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Price</span>
                                  <span className="font-medium text-gold">{item.equipmentSpecs.price}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.stockStatus && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Availability</span>
                                  <span className="font-medium">{item.equipmentSpecs.stockStatus}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.serialNumber && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Edition</span>
                                  <span className="font-medium">{item.equipmentSpecs.serialNumber}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.purchaseLink && (
                                <div className="mt-4">
                                  <a 
                                    href={item.equipmentSpecs.purchaseLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-gold text-dark py-2 px-4 rounded text-sm font-medium inline-flex items-center hover:bg-gold/90 transition-colors"
                                    data-testid="button-buy-luxury"
                                  >
                                    <span className="mr-2">Buy Now</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17L17 7"/></svg>
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Occasion-based pricing */}
                          {item.occasionPricing && Object.keys(item.occasionPricing).length > 0 && (
                            <OccasionPricing item={item} />
                          )}
                          
                          {item.grandSlamAppearances && item.grandSlamAppearances.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium text-sm mb-1">Used at</h5>
                              <div className="flex flex-wrap gap-1">
                                {item.grandSlamAppearances.map((tournament: string, idx: number) => (
                                  <span key={idx} className="inline-block text-xs bg-gray-200 px-2 py-1 rounded">
                                    {tournament}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Personal Brand Products from celebrity products (filtered) */}
              <div className="mt-12">
                <h3 className="text-3xl font-playfair font-bold mb-6 text-center bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 bg-clip-text text-transparent">Personal Brand Products</h3>
                {productsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-48 bg-gray-200 animate-pulse"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  (() => {
                    const personalBrandProducts = (products || []).filter(p => (p.category || '').toLowerCase() === 'personal brand products');
                    if (!personalBrandProducts.length) {
                      return (
                        <div className="text-center py-8 text-gray-600">No personal brand products added yet.</div>
                      );
                    }
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {personalBrandProducts.map((product) => {
                          const img = Array.isArray(product.imageUrl) ? (product.imageUrl[0] || '') : (product.imageUrl || '');
                          const purchaseUrl = product.purchaseLink || product.website || '';
                          return (
                                <div key={product.id} className="group relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 hover:rotate-[0.15deg] ring-1 ring-purple-200 hover:ring-purple-400/50 overflow-hidden flex flex-col">
                                  {product.isFeatured ? (
                                    <div className="absolute top-3 left-3"><Badge className="bg-purple-600 text-white">Most Popular</Badge></div>
                                  ) : null}
                                  <div className="relative aspect-[6/5] bg-neutral-100 overflow-hidden">
                                    <img src={img || '/assets/placeholder.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <Sparkles className="absolute top-3 right-3 w-5 h-5 text-purple-400/70 drop-shadow" />
                                  </div>
                                  <div className="p-3 space-y-2 bg-white/60 backdrop-blur-md">
                                    <h4 className="text-lg font-playfair font-semibold text-purple-900 line-clamp-2 leading-tight">{product.name}</h4>
                                    <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-1"></div>
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium line-clamp-1">{product.category}</div>
                                    {/* Location hidden per request */}
                                    {/* {product.location && (
                                      <div className="flex items-center text-xs text-gray-500"><MapPin className="w-3 h-3 mr-1" />{product.location}</div>
                                    )} */}
                                    {product.price && (
                                      <div className="mt-1"><Badge className="bg-emerald-100 text-emerald-700 rounded-full px-2 ring-1 ring-emerald-200">{product.price}</Badge></div>
                                    )}
                                    <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3">
                                      {purchaseUrl && (
                                        <Button asChild size="sm" className="w-full sm:flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg">
                                          <a href={purchaseUrl} target="_blank" rel="noreferrer" className="relative overflow-hidden"><span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span><ExternalLink className="w-4 h-4 mr-1 relative z-10" /> <span className="relative z-10">Shop Now</span></a>
                                        </Button>
                                      )}
                                      {product.website && (
                                        <Button asChild size="sm" variant="outline" className="w-full sm:flex-1 rounded-full border-purple-300 text-purple-700 hover:bg-purple-50">
                                          <a href={product.website} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Website</a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                    );
                  })()
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="shopping" className="mt-6">
              <div className="space-y-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-playfair font-bold mb-3 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                        {celebrity.name}'s Shopping Playlist
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        Curated collections of <span className="font-semibold text-amber-700">{celebrity.name}</span>'s favorite items. From signature pieces to everyday essentials, explore the products that define their style and discover where to purchase authentic items.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Weekly Shopping Playlist - Single Elegant Checklist */}
                <div className="bg-gradient-to-br from-slate-900 via-neutral-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl border border-gold/30 relative overflow-hidden">
                  {/* Elegant background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-amber-600/5"></div>
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-20 -left-20 w-40 h-40 bg-amber-600/5 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-gold to-amber-600 rounded-2xl shadow-lg">
                          <ShoppingBag className="w-8 h-8 text-dark" />
                        </div>
                        <div>
                          <h4 className="text-3xl font-playfair font-bold text-gold mb-1">Weekly Shopping Playlist</h4>
                          <p className="text-gray-300 text-sm">Curated items from {celebrity.name}'s signature style collection</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full border border-gold/20">
                        <div className="w-3 h-3 bg-gold rounded-full animate-pulse"></div>
                        <span className="text-gold text-sm font-medium">Updated Weekly</span>
                      </div>
                    </div>
                    
                    {/* Checklist Items */}
                    <div className="space-y-4 mb-8">
                      {/* Signature Items */}
                      {celebrityBrands && celebrityBrands.slice(0, 3).map((item: CelebrityBrandWithDetails, index) => (
                        <div key={item.id} className="group cursor-pointer">
                          <div className="flex items-start gap-4 p-5 bg-gold/5 hover:bg-gold/10 rounded-2xl border border-gold/20 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
                            {/* Premium Checkbox */}
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-6 h-6 rounded-lg border-2 border-gold/60 bg-gradient-to-br from-gold/20 to-amber-600/20 flex items-center justify-center group-hover:border-gold transition-all duration-200 group-hover:scale-105">
                                <div className="w-3 h-3 bg-gold rounded-full opacity-90"></div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <p className="font-semibold text-gold text-base leading-tight mb-2">{item.description}</p>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-400 font-medium">{item.brand?.name}</span>
                                    <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">SIGNATURE</span>
                                  </div>
                                </div>
                                {item.equipmentSpecs?.price && (
                                  <span className="text-gold font-bold text-lg whitespace-nowrap">{item.equipmentSpecs.price}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Premium Platform Item */}
                      <div className="group cursor-pointer">
                        <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-gold/15 to-amber-600/15 rounded-2xl border border-gold/40 hover:border-gold/60 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-lg border-2 border-gold bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg">
                              <div className="w-3 h-3 bg-dark rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-gold text-base mb-2">Founder and visionary behind Celecart, the revolutionary fashion discovery platform.</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-amber-400 font-medium">Premium Platform</span>
                                  <span className="px-2 py-1 bg-gradient-to-r from-gold to-amber-600 text-dark text-xs font-bold rounded-full">FEATURED</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Luxury Items */}
                      <div className="group cursor-pointer">
                        <div className="flex items-start gap-4 p-5 bg-gold/5 hover:bg-gold/10 rounded-2xl border border-gold/20 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-lg border-2 border-gold/60 bg-gradient-to-br from-gold/20 to-amber-600/20 flex items-center justify-center group-hover:border-gold transition-all duration-200 group-hover:scale-105">
                              <div className="w-3 h-3 bg-gold rounded-full opacity-90"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-gold text-base leading-tight mb-2">Creed Aventus signature fragrance, known for its sophisticated blend of fruity and woody notes.</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-400 font-medium">Creed</span>
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full">PREMIUM</span>
                                </div>
                              </div>
                              <span className="text-gold font-bold text-lg whitespace-nowrap">$435</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group cursor-pointer">
                        <div className="flex items-start gap-4 p-5 bg-gold/5 hover:bg-gold/10 rounded-2xl border border-gold/20 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-lg border-2 border-gold/60 bg-gradient-to-br from-gold/20 to-amber-600/20 flex items-center justify-center group-hover:border-gold transition-all duration-200 group-hover:scale-105">
                              <div className="w-3 h-3 bg-gold rounded-full opacity-90"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-gold text-base leading-tight mb-2">The Lamborghini Urus luxury SUV, embodying performance and distinctive Italian design.</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-400 font-medium">Lamborghini</span>
                                  <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full">LUXURY</span>
                                </div>
                              </div>
                              <span className="text-gold font-bold text-lg whitespace-nowrap">$225,500</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="group cursor-pointer">
                        <div className="flex items-start gap-4 p-5 bg-gold/5 hover:bg-gold/10 rounded-2xl border border-gold/20 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-lg border-2 border-gold/60 bg-gradient-to-br from-gold/20 to-amber-600/20 flex items-center justify-center group-hover:border-gold transition-all duration-200 group-hover:scale-105">
                              <div className="w-3 h-3 bg-gold rounded-full opacity-90"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-gold text-base leading-tight mb-2">Rolex timepieces representing sophistication and entrepreneurial success.</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-400 font-medium">Rolex</span>
                                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs font-bold rounded-full">TRENDING</span>
                                </div>
                              </div>
                              <span className="text-gold font-bold text-lg whitespace-nowrap">$14,800</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Armani Suits */}
                      <div className="group cursor-pointer">
                        <div className="flex items-start gap-4 p-5 bg-gold/5 hover:bg-gold/10 rounded-2xl border border-gold/20 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-lg border-2 border-gold/60 bg-gradient-to-br from-gold/20 to-amber-600/20 flex items-center justify-center group-hover:border-gold transition-all duration-200 group-hover:scale-105">
                              <div className="w-3 h-3 bg-gold rounded-full opacity-90"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-gold text-base leading-tight mb-2">Armani suits representing sophisticated executive style and entrepreneurial success.</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-400 font-medium">Armani</span>
                                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full">ESSENTIAL</span>
                                </div>
                              </div>
                              <span className="text-gold font-bold text-lg whitespace-nowrap">$1,995-$3,500</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="flex-1 bg-gradient-to-r from-gold to-amber-600 hover:from-gold/90 hover:to-amber-600/90 text-dark font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-gold/25 hover:scale-105">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Shop Complete Collection
                      </Button>
                      <Button variant="outline" className="flex-1 border-2 border-gold/40 text-gold hover:bg-gold/10 font-bold py-4 rounded-2xl transition-all duration-300 hover:border-gold/60">
                        <Star className="w-5 h-5 mr-2" />
                        Save to Wishlist
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Shopping Features */}
                <div className="bg-gradient-to-r from-neutral-50 to-amber-50 rounded-2xl p-8 border border-amber-200">
                  <h4 className="text-2xl font-playfair font-bold mb-6 text-center text-amber-800">Shopping Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-white" />
                      </div>
                      <h5 className="font-semibold text-amber-800 mb-2">Curated Collections</h5>
                      <p className="text-gray-600 text-sm">Handpicked items organized by style, occasion, and preference</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h5 className="font-semibold text-amber-800 mb-2">Authentic Products</h5>
                      <p className="text-gray-600 text-sm">Direct links to official retailers and authorized sellers</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <h5 className="font-semibold text-amber-800 mb-2">Price Tracking</h5>
                      <p className="text-gray-600 text-sm">Get notified of price drops and exclusive deals</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="mt-6">
              <div className="space-y-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-playfair font-bold mb-3 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                        Celeconnect
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        Welcome to Celeconnect - a social media platform where fans can interact with celebrities like <span className="font-semibold text-amber-700">{celebrity.name}</span>. 
                        Connect, share experiences, and get exclusive access to celebrity content and interactions.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">ðŸ’¬ Direct Messages</span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">ðŸŽ­ Exclusive Content</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">ðŸ‘¥ Fan Community</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Styling Information Section */}
                <div className="bg-gradient-to-br from-neutral-50 to-amber-50/30 rounded-2xl p-6 border border-amber-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-amber-700">Styling Information</h3>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl p-6 border border-amber-200/50">
                    <p className="text-gray-600 italic mb-4 text-center">
                      "Connect with your favorite celebrities and access exclusive content"
                    </p>
                    
                    {/* Styling Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white rounded-lg p-4 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-lg">ðŸ‘”</span>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1">Executive Fashion</h4>
                          <p className="text-sm text-gray-600">Business & formal wear</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-lg">ðŸ½ï¸</span>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1">Favorite Restaurant</h4>
                          <p className="text-sm text-gray-600">Dining preferences</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-lg">ðŸ™ï¸</span>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1">Favorite Cities</h4>
                          <p className="text-sm text-gray-600">Travel destinations</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-lg">ðŸ¸</span>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1">Favorite Lounge</h4>
                          <p className="text-sm text-gray-600">Entertainment venues</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Media Upload Component */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
                    <div className="flex items-center gap-3">
                      <Camera className="w-6 h-6 text-white" />
                      <h4 className="text-xl font-semibold text-white">Media Studio</h4>
                    </div>
                    <p className="text-amber-100 mt-2">Upload and manage your personal content</p>
                  </div>
                  
                  <div className="p-6">
                    <MediaUpload />
                  </div>
                </div>

                {/* Outfit Details Section */}
                <div className="bg-gradient-to-br from-neutral-900 via-gray-800 to-neutral-900 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-500/20 rounded-full">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-amber-400">Outfit Details</h3>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl p-6 border border-amber-500/20">
                    <p className="text-gray-300 text-lg text-center mb-6">
                      Discover the stories behind {celebrity.name}'s signature looks and style choices
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">ðŸ‘‘</span>
                        </div>
                        <h4 className="font-semibold text-amber-400 mb-2">Signature Style</h4>
                        <p className="text-gray-400 text-sm">Timeless elegance meets modern sophistication</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">ðŸ’Ž</span>
                        </div>
                        <h4 className="font-semibold text-amber-400 mb-2">Luxury Accessories</h4>
                        <p className="text-gray-400 text-sm">Carefully curated premium pieces</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">âœ¨</span>
                        </div>
                        <h4 className="font-semibold text-amber-400 mb-2">Style Evolution</h4>
                        <p className="text-gray-400 text-sm">Fashion journey through the years</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Celebrity Styling Details */}
                {celebrity.stylingDetails && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
                    <h3 className="text-2xl font-playfair font-bold mb-6 text-amber-700 text-center">
                      Professional Styling Details
                    </h3>
                    <StylingDetails 
                      looks={celebrity.stylingDetails as any[]} 
                      className="mb-8"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold/20 rounded-full">
                    <Video className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {celebrity.id === 15 
                        ? `${celebrity.name}'s Style Episode Series` 
                        : `${celebrity.name}'s Tournament Videos`}
                    </h3>
                    <p className="text-gray-700">
                      {celebrity.id === 15 
                        ? `Explore our exclusive 6-part episode series on ${celebrity.name}'s fashion evolution, business ventures, and style influence. Each episode covers a different aspect of her journey to becoming a fashion icon.` 
                        : `Watch ${celebrity.name} in action at various tournaments and events. These videos showcase their performance, style, and equipment in real competitive scenarios.`}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <FashionStyleEpisodes celebrity={celebrity} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="mt-6">
              <div className="space-y-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-8 border border-amber-200 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-playfair font-bold mb-3 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                        AI Stylist
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        Get personalized fashion recommendations powered by AI, based on <span className="font-semibold text-amber-700">{celebrity.name}</span>'s style preferences. 
                        Discover outfit combinations, color palettes, and styling tips tailored just for you.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">ðŸŽ¨ Style Analysis</span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">ðŸ‘— Outfit Suggestions</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">ðŸ¤– AI Recommendations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Features Grid */}
                <div className="bg-gradient-to-br from-neutral-50 to-amber-50/30 rounded-2xl p-6 border border-amber-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-amber-700">AI Styling Features</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">ðŸŽ¯</span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-center">Personal Style Analysis</h4>
                      <p className="text-sm text-gray-600 text-center">AI analyzes your preferences to create personalized style profiles</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">ðŸ‘•</span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-center">Smart Outfit Builder</h4>
                      <p className="text-sm text-gray-600 text-center">Mix and match clothing items based on celebrity style patterns</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">ðŸŒˆ</span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-center">Color Palette Generator</h4>
                      <p className="text-sm text-gray-600 text-center">Find perfect color combinations that complement your style</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent></Tabs>
        </div>
      </div>
      
      {/* AI-Powered Features Section */}
      <div className="py-16 bg-midgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="h-5 w-5 text-gold mr-2" />
              <span className="text-gold uppercase tracking-widest text-sm font-semibold">AI-Powered Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-light mb-4">
              Explore {celebrity.name}'s Style with AI
            </h2>
            <p className="text-light/70 max-w-2xl mx-auto">
              Leverage our cutting-edge AI to analyze {celebrity.name}'s fashion choices, get personalized recommendations,
              and discover similar styles across sports celebrities.
            </p>
          </div>
          
          {/* AI Features Tabs */}
          <AIFeaturesTabs celebrity={celebrity} />
        </div>
      </div>

      <Newsletter />
      <Footer />
      
      {showBrandModal && selectedBrand && (
        <BrandModal brand={selectedBrand} onClose={handleCloseBrandModal} />
      )}
    </div>
  );
}

