import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, ShoppingBag, TrendingUp, ArrowRight, Eye, Heart, Share2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { useQuery } from "@tanstack/react-query";

// Trending categories for filtering
const trendingCategories = [
  { id: "all", label: "All Trending", icon: TrendingUp },
  { id: "apparel", label: "Fashion", icon: Sparkles },
  { id: "accessories", label: "Accessories", icon: Star },
  { id: "beauty", label: "Beauty", icon: Heart },
  { id: "fragrance", label: "Fragrance", icon: Eye }
];

// Enhanced spotlight items with social metrics and authentic celebrity data
const spotlightItems = [
  {
    id: 1,
    title: "Pakistani Couture Excellence",
    celebrityName: "Fawad Khan",
    celebrityImage: "/assets/image_1754012564135.png",
    image: "/assets/trending/canali-suit.jpg",
    brandImage: "/assets/brands/canali_logo.png",
    description: "Fawad Khan's impeccably tailored Canali suit at the Filmfare Awards has redefined men's formal fashion. The exquisite Italian craftsmanship and premium fabric have made this the most discussed Pakistani fashion moment this month.",
    price: "$2,195",
    brand: "Canali",
    category: "apparel",
    trendScore: 9.9,
    link: "https://www.canali.com",
    socialMetrics: {
      views: "2.7M",
      likes: "847K",
      shares: "89K",
      comments: "12.4K"
    },
    trendingTime: "2 days ago",
    occasionContext: "Filmfare Awards 2024"
  },
  {
    id: 2,
    title: "Luxury Timepiece Statement",
    celebrityName: "Tom Cruise",
    celebrityImage: "/assets/image_1754013029728.png",
    image: "/assets/rolex_submariner.jpg",
    brandImage: "/assets/brands/rolex_logo.png",
    description: "Tom Cruise's Rolex Submariner continues to be the gold standard in luxury watches. This iconic timepiece has seen a 285% increase in search volume following his recent red carpet appearances.",
    price: "$8,550",
    brand: "Rolex",
    category: "accessories",
    trendScore: 9.7,
    link: "https://www.rolex.com",
    socialMetrics: {
      views: "5.2M",
      likes: "1.2M",
      shares: "156K",
      comments: "28.7K"
    },
    trendingTime: "1 week ago",
    occasionContext: "Mission: Impossible Premiere"
  },

  {
    id: 4,
    title: "Signature Scent Phenomenon",
    celebrityName: "Zulqadar Rehman",
    celebrityImage: "/assets/image_1754076751598.png",
    image: "/assets/products/creed_aventus.jpg",
    brandImage: "/assets/brands/creed_logo.png",
    description: "Zulqadar Rehman's signature Creed Aventus has become the most coveted men's fragrance. This luxurious scent represents Pakistani business excellence and has influenced fragrance trends across Asia.",
    price: "$435",
    brand: "Creed",
    category: "fragrance",
    trendScore: 9.2,
    link: "https://www.creedboutique.com",
    socialMetrics: {
      views: "1.8M",
      likes: "456K",
      shares: "67K",
      comments: "15.2K"
    },
    trendingTime: "5 days ago",
    occasionContext: "Business Leadership Summit"
  }
];

export default function TrendingSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isHovered, setIsHovered] = useState(false);
  
  // Filter items by category
  const filteredItems = selectedCategory === "all" 
    ? spotlightItems 
    : spotlightItems.filter(item => item.category === selectedCategory);
  
  const currentItem = filteredItems[currentIndex] || spotlightItems[0];
  
  // Auto-rotate spotlight items (pause on hover)
  useEffect(() => {
    if (isHovered) return;
    
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isHovered, filteredItems.length]);
  
  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);
  
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };
  
  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section id="trending" className="py-24 bg-dark relative overflow-hidden">
      {/* Trending content temporarily disabled */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Trending"
          subtitle="No trending content available at the moment."
          align="center"
        />
        <div className="mt-8 text-center">
          <span className="px-4 py-2 rounded-full bg-midgray/50 text-light/70 border border-gold/10">
            No trending items right now. Please check back later.
          </span>
        </div>
      </div>
    </section>
  );
}