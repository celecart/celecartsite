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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Share2, Sparkles, Upload, Camera, Video, Calendar, Star } from "lucide-react";
import TournamentVideoTab from "@/components/TournamentVideoTab";
import { useState } from "react";
import BrandModal from "@/components/BrandModal";
import BrandImage from "@/components/BrandImage";
import SignatureEquipment from "@/components/SignatureEquipment";
import ApparelAccessories from "@/components/ApparelAccessories";
import { OutfitShareGrid } from "@/components/OutfitShareGrid";
import OccasionPricing from "@/components/OccasionPricing";
import StylingDetails from "@/components/StylingDetails";
import MediaUpload from "@/components/MediaUpload";
import LiveEvents from "@/components/LiveEvents";
import SKKNProducts from "@/components/SKKNProducts";
import { motion } from "framer-motion";
import { FallbackImage } from "@/components/ui/fallback-image";

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

  const { data: celebrityBrands, isLoading: brandsLoading } = useQuery<CelebrityBrandWithDetails[]>({
    queryKey: ["/api/celebritybrands", celebrityId],
    queryFn: async () => {
      const response = await fetch(`/api/celebritybrands/${celebrityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch celebrity brands data');
      }
      const data = await response.json();
      return data;
    },
    enabled: !!celebrityId,
  });

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
                  src={celebrity.imageUrl} 
                  alt={`${celebrity.name} fashion`}
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
              <span className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Celebrity Profile</span>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair text-light mb-4">{celebrity.name}</h1>
              <p className="text-light/70 mb-8">{celebrity.profession}</p>
              
              <div className="mb-8">
                <h2 className="text-gold font-semibold mb-3 uppercase tracking-wider text-sm">About</h2>
                <p className="text-light/80">{celebrity.description}</p>
              </div>
              
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
                  {celebrity.name}'s signature style features a mix of high-end designer pieces with unique personal touches that showcase their distinctive fashion sense.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tournament and Equipment Data Section */}
      <div className="py-16 bg-white text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full mb-8 justify-start border-b">
              <TabsTrigger value="overview">
                <Star className="w-4 h-4 mr-1" />
                <span>Personal Favourite</span>
              </TabsTrigger>
              <TabsTrigger value="specifications">
                <Sparkles className="w-4 h-4 mr-1" />
                <span>Personal Brand</span>
              </TabsTrigger>
              <TabsTrigger value="share" className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>Share outfit</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                <span>Upload media</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Live events</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                <span>Fashion & Style episodes</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              {celebrity.id === 27 ? (
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
                                Featuring Kim, Khloé, and Kourtney in the iconic diamond-inspired bottles. Each fragrance represents their unique personalities with pink, clear, and yellow diamond variants.
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
                      

