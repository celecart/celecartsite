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
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-0 w-60 h-60 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <div className="flex items-center justify-center mb-3">
            <span className="px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-sm font-medium inline-flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              TRENDING & SPOTLIGHT
            </span>
          </div>
          <SectionHeading
            title="What's Hot Right Now"
            subtitle="The most talked-about fashion moments and trending styles creating waves globally"
            align="center"
          />
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {trendingCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gold text-dark shadow-lg shadow-gold/25"
                    : "bg-midgray/50 text-light/70 hover:bg-gold/20 hover:text-gold border border-gold/10"
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Image */}
          <div 
            className="relative rounded-xl overflow-hidden h-[500px] shadow-2xl shadow-gold/5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentItem.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0"
              >
                <div className="relative w-full h-full">
                  {/* Image */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/20 to-dark"></div>
                  <img 
                    src={currentItem.image} 
                    alt={currentItem.title} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Enhanced Image overlay elements */}
                  <div className="absolute top-6 left-6 flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Badge className="bg-gold text-dark shadow-lg">HOT RIGHT NOW</Badge>
                      <Badge className="bg-red-600 text-white shadow-lg">MOST WANTED</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-dark/80 text-light border-gold/30">
                        {currentItem.occasionContext}
                      </Badge>
                    </div>
                  </div>

                  {/* Social engagement metrics */}
                  <div className="absolute top-6 right-6 flex flex-col space-y-2">
                    <div className="bg-dark/80 backdrop-blur-sm rounded-lg p-3 text-xs">
                      <div className="flex items-center space-x-2 text-light/80">
                        <Eye className="w-3 h-3" />
                        <span>{currentItem.socialMetrics.views}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-light/80 mt-1">
                        <Heart className="w-3 h-3" />
                        <span>{currentItem.socialMetrics.likes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced brand and price display */}
                  <motion.div 
                    className="absolute bottom-6 left-6 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-dark/90 backdrop-blur-sm rounded-xl p-4 border border-gold/20">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold">
                          <img
                            src={currentItem.brandImage || "/assets/brands/placeholder.jpg"}
                            alt={currentItem.brand}
                            className="w-full h-full object-cover bg-midgray"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gold uppercase tracking-wider">
                            {currentItem.brand}
                          </span>
                          <div className="text-light text-lg font-semibold font-playfair">
                            {currentItem.price}
                          </div>
                        </div>
                        {/* Celebrity avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-light/30">
                          <img
                            src={currentItem.celebrityImage}
                            alt={currentItem.celebrityName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Enhanced Navigation Dots */}
            <div className="absolute bottom-6 right-6 bg-dark/80 backdrop-blur-sm rounded-lg p-2">
              <div className="flex space-x-2">
                {filteredItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "bg-gold shadow-lg shadow-gold/50" 
                        : "bg-light/30 hover:bg-light/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column: Details */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-midgray/50 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-gold/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-purple-600 text-white px-3 py-1 text-xs capitalize">
                      {currentItem.category}
                    </Badge>
                    <span className="text-xs text-light/60">{currentItem.trendingTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 px-3 py-1 bg-dark/40 rounded-full">
                    <Star className="h-4 w-4 text-gold fill-gold" />
                    <span className="text-xs font-semibold text-gold">Trend Score:</span>
                    <span className="text-xs font-bold text-light">{currentItem.trendScore.toFixed(1)}</span>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold font-playfair text-light mb-2">
                  {currentItem.title}
                </h3>
                
                <div className="flex items-center mb-6">
                  <TrendingUp className="h-4 w-4 text-gold mr-2" />
                  <span className="text-sm text-light/70">
                    Worn by <span className="text-gold font-semibold">{currentItem.celebrityName}</span>
                  </span>
                </div>
                
                <p className="text-light/80 mb-6 leading-relaxed">
                  {currentItem.description}
                </p>
                
                {/* Enhanced social metrics */}
                <div className="grid grid-cols-4 gap-4 mb-8 p-4 bg-dark/30 rounded-lg border border-gold/10">
                  <div className="text-center">
                    <Eye className="w-4 h-4 text-gold mx-auto mb-1" />
                    <div className="text-xs font-semibold text-light">{currentItem.socialMetrics.views}</div>
                    <div className="text-xs text-light/60">Views</div>
                  </div>
                  <div className="text-center">
                    <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
                    <div className="text-xs font-semibold text-light">{currentItem.socialMetrics.likes}</div>
                    <div className="text-xs text-light/60">Likes</div>
                  </div>
                  <div className="text-center">
                    <Share2 className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs font-semibold text-light">{currentItem.socialMetrics.shares}</div>
                    <div className="text-xs text-light/60">Shares</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <div className="text-xs font-semibold text-light">{currentItem.socialMetrics.comments}</div>
                    <div className="text-xs text-light/60">Comments</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handlePrev}
                      className="text-light hover:text-gold rounded-full p-2 hover:bg-gold/10"
                    >
                      <ArrowRight className="h-5 w-5 rotate-180" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleNext}
                      className="text-light hover:text-gold rounded-full p-2 hover:bg-gold/10"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <a 
                    href={currentItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gold hover:bg-gold/90 text-dark">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Shop Now
                    </Button>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Decorative element */}
            <div className="absolute -top-8 -right-8 w-16 h-16 text-gold/20 rotate-12 hidden lg:block">
              <Sparkles className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}