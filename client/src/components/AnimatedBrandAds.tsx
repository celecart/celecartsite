import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Star, ShoppingBag, ExternalLink, Play, 
  ArrowRight, Zap, Clock, Heart
} from "lucide-react";

interface BrandAd {
  id: number;
  brandName: string;
  tagline: string;
  category: string;
  imageUrl: string;
  logoUrl: string;
  price: string;
  discount?: string;
  isHot?: boolean;
  isNew?: boolean;
  purchaseLink: string;
  bgColor: string;
  textColor: string;
}

const brandAds: BrandAd[] = [
  {
    id: 1,
    brandName: "Rolex",
    tagline: "A Crown for Every Achievement",
    category: "Luxury Watches",
    imageUrl: "/assets/brands/rolex/datejust-green.jpg",
    logoUrl: "/assets/brands/rolex/logo.png",
    price: "From $13,150",
    isHot: true,
    purchaseLink: "https://www.rolex.com/",
    bgColor: "from-amber-900 via-yellow-800 to-amber-900",
    textColor: "text-amber-100"
  },
  {
    id: 2,
    brandName: "Lamborghini",
    tagline: "Expect the Unexpected",
    category: "Luxury Automobiles",
    imageUrl: "/assets/brands/lamborghini/urus-yellow.jpg",
    logoUrl: "/assets/brands/lamborghini/logo.png",
    price: "From $233,000",
    discount: "Special Edition Available",
    isNew: true,
    purchaseLink: "https://www.lamborghini.com/",
    bgColor: "from-orange-900 via-yellow-700 to-orange-800",
    textColor: "text-orange-100"
  },
  {
    id: 3,
    brandName: "Creed",
    tagline: "The Art of Fragrance Since 1760",
    category: "Luxury Fragrance",
    imageUrl: "/assets/brands/creed/aventus-luxury.jpg",
    logoUrl: "/assets/brands/creed/logo.png",
    price: "From $445",
    isHot: true,
    purchaseLink: "https://www.creedboutique.com/",
    bgColor: "from-slate-800 via-gray-700 to-slate-900",
    textColor: "text-slate-100"
  },
  {
    id: 4,
    brandName: "Netflix Kids",
    tagline: "Learning Made Fun",
    category: "Educational Content",
    imageUrl: "/assets/brands/netflix-kids/educational-content.jpg",
    logoUrl: "/assets/brands/netflix-kids/logo.png",
    price: "From $15.49/month",
    isNew: true,
    purchaseLink: "https://www.netflix.com/browse/genre/783",
    bgColor: "from-red-900 via-red-700 to-red-800",
    textColor: "text-red-100"
  },
  {
    id: 5,
    brandName: "Armani",
    tagline: "Timeless Elegance",
    category: "Designer Fashion",
    imageUrl: "/assets/brands/armani/executive-suit.jpg",
    logoUrl: "/assets/brands/armani/logo.png",
    price: "From $2,895",
    discount: "20% Off Executive Collection",
    purchaseLink: "https://www.armani.com/",
    bgColor: "from-gray-900 via-slate-800 to-black",
    textColor: "text-gray-100"
  },
  {
    id: 6,
    brandName: "Fisher-Price",
    tagline: "Play. Laugh. Grow.",
    category: "Educational Toys",
    imageUrl: "/assets/brands/fisher-price/learning-toys.jpg",
    logoUrl: "/assets/brands/fisher-price/logo.png",
    price: "From $19.99",
    isNew: true,
    purchaseLink: "https://www.fisher-price.com/",
    bgColor: "from-blue-900 via-indigo-700 to-blue-800",
    textColor: "text-blue-100"
  }
];

export default function AnimatedBrandAds() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate ads every 4 seconds
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % brandAds.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const currentAd = brandAds[currentAdIndex];

  const handleAdClick = (ad: BrandAd) => {
    window.open(ad.purchaseLink, '_blank');
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-16 bg-darkgray relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-amber-900/10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold/20 border border-gold/30 text-gold text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            PREMIUM FASHION INSIGHTS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-light mb-4">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-400">Fashion Trends</span>
          </h2>
          <p className="text-lg text-light/70 max-w-2xl mx-auto mb-6">
            Stay ahead with real-time insights on the latest celebrity fashion movements
          </p>
          
          {/* Current Brand Live Indicator */}
          <motion.div 
            key={currentAdIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-3 bg-dark/80 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-gold/30 shadow-lg"
          >
            <motion.div 
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-light font-medium">LIVE:</span>
            <span className="text-gold font-bold text-lg">{currentAd.brandName}</span>
            <span className="text-light/60">•</span>
            <span className="text-light/80 text-sm">{currentAd.price}</span>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Action Buttons */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-gold/20 to-amber-600/20 border border-gold/30 rounded-xl p-6 cursor-pointer group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center mr-3">
                  <Star className="w-5 h-5 text-gold" />
                </div>
                <span className="text-gold font-semibold">CELEBRITY SPOTLIGHT</span>
              </div>
              <p className="text-light text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                Explore exclusive celebrity fashion collections
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-purple-900/30 to-purple-600/20 border border-purple-500/30 rounded-xl p-6 cursor-pointer group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-purple-400 font-semibold">TRENDING PRODUCTS</span>
              </div>
              <p className="text-light text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                Discover what's hot in luxury fashion right now
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-slate-800/40 to-gray-700/30 border border-slate-600/30 rounded-xl p-6 cursor-pointer group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-slate-600/20 rounded-full flex items-center justify-center mr-3">
                  <ShoppingBag className="w-5 h-5 text-slate-300" />
                </div>
                <span className="text-slate-300 font-semibold">BROWSE CELEBRITIES</span>
              </div>
              <p className="text-light text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                View complete celebrity fashion profiles
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-amber-900/30 to-amber-600/20 border border-amber-500/30 rounded-xl p-6 cursor-pointer group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-amber-400 font-semibold">STYLE ANALYTICS</span>
              </div>
              <p className="text-light text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                Get insights on fashion trends and data
              </p>
            </motion.div>
          </div>

          {/* Center Column - Main Brand Ad Display */}
          <div className="lg:col-span-6">
            <div className="relative bg-dark/60 backdrop-blur-sm rounded-2xl border border-gold/20 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAdIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="relative h-96 cursor-pointer group"
                  onClick={() => handleAdClick(currentAd)}
                >
                  {/* Background with Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentAd.bgColor} opacity-80`} />
                  
                  {/* Animated Background Pattern */}
                  <motion.div 
                    className="absolute inset-0 opacity-10"
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-8">
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                      {/* Brand Info */}
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                        >
                          <span className="text-2xl font-bold text-white">
                            {currentAd.brandName.charAt(0)}
                          </span>
                        </motion.div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-1 font-playfair">
                            {currentAd.brandName}
                          </h3>
                          <p className="text-white/80 text-lg">{currentAd.category}</p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col space-y-2">
                        {currentAd.isHot && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center"
                          >
                            <Zap className="w-4 h-4 mr-1" />
                            HOT
                          </motion.div>
                        )}
                        {currentAd.isNew && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                          >
                            NEW
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Center Content */}
                    <div className="text-center">
                      <motion.h4 
                        className="text-4xl font-bold text-white mb-4 font-playfair"
                        animate={{ 
                          opacity: [0.8, 1, 0.8],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {currentAd.tagline}
                      </motion.h4>
                      
                      {/* Brand Category Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30"
                      >
                        <span className="text-white/90 text-sm font-medium uppercase tracking-wide">
                          {currentAd.category}
                        </span>
                      </motion.div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-end justify-between">
                      <div>
                        <motion.div 
                          className="text-4xl font-bold text-white mb-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          {currentAd.price}
                        </motion.div>
                        {currentAd.discount && (
                          <div className="text-amber-300 text-lg font-medium">
                            {currentAd.discount}
                          </div>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/30 px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdClick(currentAd);
                        }}
                      >
                        <span>Shop Now</span>
                        <ExternalLink className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Ad Controls */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-dark/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gold/20">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={togglePlayPause}
                  className="text-white hover:text-gold transition-colors"
                >
                  <Play className={`w-4 h-4 ${isPlaying ? 'opacity-50' : 'opacity-100'}`} />
                </Button>
                
                <div className="flex space-x-2">
                  {brandAds.map((_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setCurrentAdIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentAdIndex ? 'bg-gold w-8' : 'bg-white/50 w-2 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-white/70 text-sm">
                  {currentAdIndex + 1} / {brandAds.length}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Running Brand Ticker */}
          <div className="lg:col-span-3">
            <div className="bg-dark/60 backdrop-blur-sm rounded-xl border border-gold/20 p-6 h-96 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-light font-playfair">Live Brand Feed</h3>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-green-400">LIVE</span>
                </div>
              </div>

              {/* Scrolling Brand Ticker */}
              <div className="space-y-3 h-full overflow-hidden">
                <motion.div
                  animate={{ y: [0, -400] }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="space-y-3"
                >
                  {[...brandAds, ...brandAds].map((ad, index) => (
                    <motion.div
                      key={`${ad.id}-${index}`}
                      whileHover={{ scale: 1.05 }}
                      className="bg-midgray/30 rounded-lg p-4 cursor-pointer border border-gold/10 hover:border-gold/30 transition-all"
                      onClick={() => handleAdClick(ad)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-light text-sm">{ad.brandName}</span>
                        <ArrowRight className="w-4 h-4 text-gold" />
                      </div>
                      <div className="text-xs text-light/70 mb-2">{ad.category}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gold">{ad.price}</span>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 text-red-400 mr-1" />
                          <span className="text-xs text-light/60">
                            {Math.floor(Math.random() * 1000) + 100}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Moving Brand Ticker */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-dark via-midgray to-dark border-y border-gold/20 py-4 overflow-hidden">
            <motion.div
              animate={{ x: [0, -2000] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex items-center space-x-12 whitespace-nowrap"
            >
              {[...brandAds, ...brandAds, ...brandAds].map((ad, index) => (
                <div 
                  key={`ticker-${ad.id}-${index}`}
                  className="flex items-center space-x-4 cursor-pointer group"
                  onClick={() => handleAdClick(ad)}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <img 
                      src={ad.logoUrl}
                      alt={`${ad.brandName} logo`}
                      className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-light/70 group-hover:text-gold transition-colors">
                    <span className="font-medium">{ad.brandName}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{ad.price}</span>
                  </div>
                  <div className="text-gold">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}