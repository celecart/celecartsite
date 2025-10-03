import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart, Share2, ShoppingBag, ExternalLink } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";

interface TrendingProduct {
  id: number;
  name: string;
  brand: string;
  imageUrl: string;
  price: string;
  celebrityName: string;
  celebrityImageUrl: string;
  link: string;
  isNew: boolean;
  isTrending?: boolean;
  isMostWanted?: boolean;
  eventName?: string;
  category: string;
  seenDate?: string;
  trendRating?: number;
  styleNotes?: string;
}

const trendingProducts: TrendingProduct[] = [
  {
    id: 10,
    name: "Canali Italian Suit",
    brand: "Canali",
    imageUrl: "/assets/trending/canali-suit.jpg",
    price: "$2,195",
    celebrityName: "Fawad Khan",
    celebrityImageUrl: "/assets/celebrities/fawad_khan.png",
    link: "https://www.canali.com/us/suits",
    isNew: true,
    isTrending: true,
    isMostWanted: true,
    eventName: "Filmfare Awards 2025",
    category: "Apparel",
    seenDate: "April 18, 2025",
    trendRating: 9.9,
    styleNotes: "The perfectly tailored Italian suit is making waves after Fawad Khan's stunning appearance"
  },
  {
    id: 1,
    name: "Serpenti Forever Bag",
    brand: "Bulgari",
    imageUrl: "/assets/trending/bulgari-bag.jpg",
    price: "$2,800",
    celebrityName: "Blake Lively",
    celebrityImageUrl: "/assets/celebrities/blake_lively.jpg",
    link: "https://www.bulgari.com/en-us/bags-and-accessories/womens/bags",
    isNew: true,
    isTrending: true,
    isMostWanted: true,
    eventName: "Met Gala 2025",
    category: "Accessories",
    seenDate: "April 12, 2025",
    trendRating: 9.8,
    styleNotes: "This season's must-have accessory for red carpet events, seen on multiple A-list celebrities"
  },
  {
    id: 2,
    name: "SKKN Oil Drops",
    brand: "SKKN by Kim",
    imageUrl: "/assets/products/skkn_oil_drops.jpg",
    price: "$95",
    celebrityName: "Kim Kardashian",
    celebrityImageUrl: "/assets/celebrities/kim_kardashian.jpg",
    link: "https://skknbykim.com",
    isNew: true,
    isTrending: true,
    isMostWanted: false,
    category: "Beauty",
    seenDate: "April 5, 2025",
    trendRating: 9.2,
    styleNotes: "Trending heavily on social media with beauty influencers praising its hydrating formula"
  },
  {
    id: 3,
    name: "Nike CL Tennis Jacket",
    brand: "Nike",
    imageUrl: "/assets/trending/nike-tennis-jacket.jpg",
    price: "$120",
    celebrityName: "Roger Federer",
    celebrityImageUrl: "/assets/celebrities/roger_federer.jpg",
    link: "https://www.nike.com/tennis",
    isNew: false,
    isTrending: true,
    isMostWanted: false,
    eventName: "Wimbledon 2025",
    category: "Apparel",
    seenDate: "March 28, 2025",
    trendRating: 8.7,
    styleNotes: "Classic tennis style making a comeback in streetwear, spotted on multiple athletes"
  },
  {
    id: 4,
    name: "Fit Plus Boxing Gloves",
    brand: "Everlast",
    imageUrl: "/assets/trending/everlast-gloves.jpg",
    price: "$189",
    celebrityName: "Floyd Mayweather",
    celebrityImageUrl: "/assets/celebrities/floyd_mayweather.jpg",
    link: "https://www.everlast.com",
    isNew: true,
    isTrending: false,
    isMostWanted: true,
    category: "Equipment",
    seenDate: "April 8, 2025",
    trendRating: 8.9,
    styleNotes: "Becoming a status symbol in fitness circles, with celebrities showing them off on Instagram"
  },
  {
    id: 5,
    name: "Creed Aventus EDP",
    brand: "Creed",
    imageUrl: "/assets/products/creed_aventus.jpg",
    price: "$435",
    celebrityName: "Zulqadar Rehman",
    celebrityImageUrl: "/assets/celebrities/founder_profile.jpg",
    link: "https://www.creedboutique.com/collections/aventus",
    isNew: false,
    isTrending: false,
    isMostWanted: false,
    category: "Fragrance",
    seenDate: "February 15, 2025",
    trendRating: 9.0,
    styleNotes: "The signature scent of numerous male celebrities and business leaders"
  },
  {
    id: 6,
    name: "Rare Beauty Blush",
    brand: "Rare Beauty",
    imageUrl: "/assets/trending/rare-beauty-blush.jpg",
    price: "$23",
    celebrityName: "Selena Gomez",
    celebrityImageUrl: "/assets/celebrities/selena_gomez.jpg",
    link: "https://www.rarebeauty.com",
    isNew: true,
    isTrending: true,
    isMostWanted: true,
    category: "Beauty",
    seenDate: "April 15, 2025",
    trendRating: 9.6,
    styleNotes: "Currently the #1 trending beauty product on TikTok with over 1 billion views"
  },
  {
    id: 7,
    name: "Balenciaga Triple S Sneakers",
    brand: "Balenciaga",
    imageUrl: "/assets/trending/balenciaga-sneakers.jpg",
    price: "$995",
    celebrityName: "Kylie Jenner",
    celebrityImageUrl: "/assets/celebrities/kylie_jenner.jpg",
    link: "https://www.balenciaga.com",
    isNew: false,
    isTrending: true,
    isMostWanted: true,
    category: "Accessories",
    seenDate: "April 10, 2025",
    trendRating: 9.4,
    styleNotes: "The chunky sneaker trend continues with this celebrity favorite seen all over social media"
  },
  {
    id: 8,
    name: "Dyson Airwrap Complete",
    brand: "Dyson",
    imageUrl: "/assets/trending/dyson-airwrap.jpg",
    price: "$599",
    celebrityName: "Kendall Jenner",
    celebrityImageUrl: "/assets/celebrities/kendall_jenner.jpg",
    link: "https://www.dyson.com",
    isNew: false,
    isTrending: true,
    isMostWanted: true,
    category: "Beauty",
    seenDate: "March 25, 2025",
    trendRating: 9.7,
    styleNotes: "The cult-favorite styling tool behind many red carpet hairstyles"
  },
  {
    id: 9,
    name: "Louis Vuitton Neverfull",
    brand: "Louis Vuitton",
    imageUrl: "/assets/trending/lv-neverfull.jpg",
    price: "$1,960",
    celebrityName: "Emma Watson",
    celebrityImageUrl: "/assets/celebrities/emma_watson.jpg",
    link: "https://www.louisvuitton.com",
    isNew: false,
    isTrending: true,
    isMostWanted: false,
    category: "Accessories",
    seenDate: "April 7, 2025",
    trendRating: 9.1,
    styleNotes: "The timeless bag experiencing a resurgence after being featured in multiple celebrity street style photos"
  }
];

export default function TrendingProducts() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const [visibleProducts, setVisibleProducts] = useState<TrendingProduct[]>([]);

  useEffect(() => {
    if (activeCategory) {
      setVisibleProducts(trendingProducts.filter(product => product.category === activeCategory));
    } else {
      setVisibleProducts(trendingProducts);
    }
  }, [activeCategory]);

  const categories = Array.from(new Set(trendingProducts.map(p => p.category)));

  const handleLike = () => {
    toast({
      title: "Added to favorites",
      description: "This product has been added to your favorites",
      duration: 2000,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Product link has been copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <section className="py-16 bg-darkgray px-4 md:px-6">
      <SectionHeading
        title="What's Hot Right Now"
        subtitle="Celebrity-approved products trending in the fashion world today"
        align="center"
      />

      <div className="flex flex-wrap justify-center gap-2 mb-8 mt-6">
        <Button
          variant={activeCategory === null ? "gold" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
          className="text-xs"
        >
          All Categories
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "gold" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-7xl mx-auto">
        {visibleProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-midgray border-dark overflow-hidden group h-full flex flex-col">
              <div className="relative overflow-hidden bg-gradient-to-b from-transparent to-black/20">
                {/* Main product image */}
                <FallbackImage
                  src={product.imageUrl}
                  fallbackSrc="/assets/product-placeholder.jpg"
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                {/* Status badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-gold text-dark">NEW</Badge>
                  )}
                  {product.isTrending && (
                    <Badge className="bg-purple-600 text-white">TRENDING</Badge>
                  )}
                  {product.isMostWanted && (
                    <Badge className="bg-red-600 text-white">MOST WANTED</Badge>
                  )}
                </div>
                {/* Celebrity attribution with improved visibility */}
                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold shadow-lg">
                    <FallbackImage
                      src={product.celebrityImageUrl}
                      fallbackSrc="/assets/celebrity-placeholder.jpg"
                      alt={product.celebrityName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-white bg-dark/80 px-2 py-1 rounded-full">
                    {product.celebrityName}
                  </span>
                </div>
              </div>
              <CardContent className="py-5 flex-grow flex flex-col">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-gold font-bold">{product.brand}</span>
                  {product.trendRating && (
                    <div className="flex items-center bg-dark/40 px-2 py-1 rounded">
                      <span className="text-xs font-medium text-gold mr-1">Trend Rating:</span>
                      <span className="text-xs font-bold text-white">{product.trendRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start mb-3">
                  {/* Product thumbnail image */}
                  <div className="w-16 h-16 rounded overflow-hidden mr-3 border border-gray-700">
                    <FallbackImage
                      src={product.imageUrl}
                      fallbackSrc="/assets/product-placeholder.jpg"
                      alt={`${product.name} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-playfair text-xl text-light mb-1 font-medium">{product.name}</h3>
                    {product.seenDate && (
                      <span className="text-xs font-medium text-lightgray block">
                        Spotted: {product.seenDate}
                      </span>
                    )}
                    {product.eventName && (
                      <span className="text-xs font-medium text-lightgray block">
                        Event: {product.eventName}
                      </span>
                    )}
                  </div>
                </div>
                
                {product.styleNotes && (
                  <p className="text-xs text-lightgray mb-3 italic">{product.styleNotes}</p>
                )}
                <div className="text-lg text-gold font-medium mb-3">{product.price}</div>
                <div className="mt-auto flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleLike}
                      className="text-light hover:text-gold"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleShare}
                      className="text-light hover:text-gold"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <a 
                    href={product.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Button size="sm" className="bg-gold hover:bg-gold/90 text-dark">
                      <ShoppingBag className="mr-1 h-4 w-4" />
                      Shop Now
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button 
          variant="outline" 
          className="border-gold text-gold hover:bg-gold/10"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          See All Celebrity Style Favorites
        </Button>
      </div>
      
      <div className="flex justify-center mt-6 gap-4">
        <Badge variant="outline" className="border-purple-600 text-purple-600 py-1 px-3">
          <span className="mr-2">•</span> TRENDING: Currently viral on social media
        </Badge>
        <Badge variant="outline" className="border-red-600 text-red-600 py-1 px-3">
          <span className="mr-2">•</span> MOST WANTED: High demand celebrity products
        </Badge>
      </div>
    </section>
  );
}