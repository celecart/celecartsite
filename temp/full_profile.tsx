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
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="rounded overflow-hidden bg-neutral-50 border border-amber-100 h-24">
                                <img 
                                  src="/assets/kim-kardashian/beauty-wellness/skkn-exfoliator.png" 
                                  alt="SKKN Exfoliator" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="rounded overflow-hidden bg-neutral-50 border border-amber-100 h-24">
                                <img 
                                  src="/assets/kim-kardashian/beauty-wellness/skkn-vitamin-c-serum.png" 
                                  alt="SKKN Vitamin C Serum" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="rounded overflow-hidden bg-neutral-50 border border-amber-100 h-24 col-span-2">
                                <img 
                                  src="/assets/kim-kardashian/beauty-wellness/skkn-hyaluronic-acid-serum.png" 
                                  alt="SKKN Hyaluronic Acid Serum" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{celebrity.id === 15 ? "Signature Brands" : "Signature Equipment"}</h3>
                  <p className="text-gray-700 mb-4">
                    {celebrity.id === 15 
                      ? `${celebrity.name} is known for her influential brand partnerships and business ventures. Her carefully curated portfolio includes beauty, fashion, and lifestyle brands that reflect her personal aesthetic and entrepreneurial vision.`
                      : `${celebrity.name} is known for using premium equipment tailored to their precise specifications. Each piece of gear is carefully selected to match their playing style and performance needs.`
                    }
                  </p>
                  
                  {!brandsLoading && celebrityBrands && Array.isArray(celebrityBrands) && (
                    <SignatureEquipment items={celebrityBrands} />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{celebrity.id === 15 ? "Luxury & Lifestyle" : "Apparel & Accessories"}</h3>
                  <p className="text-gray-700 mb-4">
                    {celebrity.id === 15 
                      ? `${celebrity.name}'s influence extends beyond fashion into luxury lifestyle categories including fragrances, cosmetics, automobiles, and home decor. Her carefully curated selections reflect her sophisticated aesthetic and trendsetting vision.`
                      : `Beyond functional equipment, ${celebrity.name}'s personal style is complemented by carefully selected apparel and luxury accessories that enhance their professional image both on and off the court.`
                    }
                  </p>
                  
                  {!brandsLoading && celebrityBrands && Array.isArray(celebrityBrands) && (
                    <ApparelAccessories items={celebrityBrands} />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tournaments">
              <CelebrityTournaments celebrityId={celebrityId} />
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold">{celebrity.id === 15 ? "Product Details & Purchase Information" : "Technical Specifications"}</h3>
                <p className="text-gray-700">
                  {celebrity.id === 15 
                    ? `Explore the detailed features and purchase information for all of ${celebrity.name}'s signature products, from beauty and skincare to fragrances, clothing, accessories, and more.`
                    : `Professional tennis players require precisely tuned equipment to perform at their best. Below are the detailed specifications of ${celebrity.name}'s key equipment.`
                  }
                </p>
                
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
            </TabsContent>
            
            <TabsContent value="share" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold/20 rounded-full">
                    <Share2 className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Share {celebrity.name}'s Style</h3>
                    <p className="text-gray-700">
                      Love {celebrity.name}'s style? Share their outfit inspirations with your friends and followers on social media.
                      Select an item below and use the social sharing buttons to spread fashion inspiration.
                    </p>
                  </div>
                </div>
                
                {celebrity && (
                  <OutfitShareGrid 
                    celebrityId={celebrity.id} 
                    className="mt-8"
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold/20 rounded-full">
                    <Camera className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Upload Personal Media</h3>
                    <p className="text-gray-700">
                      As {celebrity.name}, share your personal photos and videos with your fans. 
                      These will be featured on your profile and can be used to showcase your life outside of sport.
                    </p>
                  </div>
                </div>
                
                {/* Celebrity Styling Details */}
                {celebrity.stylingDetails && (
                  <div className="mt-8">
                    <h3 className="text-xl font-playfair font-bold mb-4 text-gold">Styling Information</h3>
                    <StylingDetails 
                      looks={celebrity.stylingDetails as any[]} 
                      className="mb-8"
                    />
                  </div>
                )}
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100 mt-8">
                  <MediaUpload />
                </div>
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
                  <TournamentVideoTab celebrity={celebrity} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="mt-6">
              <LiveEvents celebrity={celebrity} />
            </TabsContent>
          </Tabs>
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
