import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Crown, 
  Star, 
  TrendingUp, 
  Sparkles, 
  Camera, 
  Palette, 
  ShoppingBag,
  ChevronRight,
  ArrowRight,
  Diamond,
  Shield,
  Users,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function Hero() {
  const [currentBg, setCurrentBg] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  
  const backgroundImages = [
    "https://images.unsplash.com/photo-1595435934344-5f7bfc9d1a31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    "/assets/trending/met-gala-video-thumb.jpg",
    "/assets/trending/canali-suit.jpg"
  ];
  
  const heroTexts = [
    {
      title: "Celebrity Style",
      subtitle: "Explore the signature style and exclusive luxury brands preferred by world-class celebrities"
    },
    {
      title: "Fashion Trends",
      subtitle: "Stay ahead with real-time insights on the latest celebrity fashion movements"
    },
    {
      title: "Elite Collections",
      subtitle: "Discover premium collections and limited edition pieces worn by global icons"
    }
  ];
  
  // Auto-rotate background images and text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgroundImages.length);
      setTextIndex(prev => (prev + 1) % heroTexts.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* Background with premium styling and animation */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.img 
            key={currentBg}
            src={backgroundImages[currentBg]} 
            alt="Celebrity style background" 
            className="w-full h-full object-cover opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/40"></div>
        
        {/* Animated decorative overlay elements */}
        <motion.div 
          className="absolute right-[10%] top-[20%] w-64 h-64 bg-gold/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
        <motion.div 
          className="absolute left-[15%] bottom-[15%] w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 0.9, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        ></motion.div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute right-10 top-1/3 hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="text-gold/60 text-opacity-10">
          <Crown className="h-16 w-16 rotate-12 opacity-60" />
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute left-10 top-1/4 hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
      >
        <div className="text-gold/60 text-opacity-10">
          <Star className="h-20 w-20 -rotate-12 opacity-50" />
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute left-1/4 bottom-1/4 hidden md:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <div className="text-purple-500/40 text-opacity-10">
          <Sparkles className="h-12 w-12 rotate-12 opacity-60" />
        </div>
      </motion.div>
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center max-w-4xl px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center mb-3"
        >
          <span className="px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-medium inline-flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> PREMIUM FASHION INSIGHTS
          </span>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.h1 
            key={textIndex}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-playfair text-light mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-light">Discover</span>{" "}
            <span className="text-gold relative inline-block">
              {heroTexts[textIndex].title}
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gold/40 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
          </motion.h1>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.p 
            key={textIndex}
            className="text-xl md:text-2xl text-light/80 mb-10 font-inter font-light max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {heroTexts[textIndex].subtitle}
          </motion.p>
        </AnimatePresence>
        
        {/* Premium Elite Collections Section */}
        <motion.div 
          className="relative max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Premium background with luxury design */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark/95 via-dark/90 to-dark/95 backdrop-blur-xl border-2 border-gold/20 shadow-2xl">
            {/* Animated luxury pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gold/15 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>
            
            {/* Premium content */}
            <div className="relative z-10 p-8 md:p-12">
              {/* Elite badge */}
              <div className="flex items-center justify-center mb-6">
                <motion.span 
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-gold/90 to-gold text-dark text-sm font-bold inline-flex items-center border border-gold/30 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Diamond className="w-4 h-4 mr-2" />
                  PREMIUM FASHION INSIGHTS
                </motion.span>
              </div>
              
              {/* Title */}
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <span className="text-light">Discover </span>
                <span className="bg-gradient-to-r from-gold via-gold to-gold/80 bg-clip-text text-transparent">
                  Elite Collections
                </span>
              </motion.h2>
              
              {/* Subtitle */}
              <motion.p 
                className="text-light/80 text-center text-lg md:text-xl mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                Discover premium collections and limited edition pieces worn by global icons
              </motion.p>
              
              {/* Premium button grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Celebrity Spotlight - Primary CTA */}
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 25px 50px rgba(234, 179, 8, 0.4)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link href="#trending" className="group relative overflow-hidden block">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold to-gold/90 rounded-2xl"></div>
                    <div className="relative flex items-center justify-center gap-3 px-8 py-6 text-dark font-bold rounded-2xl transition-all text-base md:text-lg">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Camera className="w-6 h-6" />
                      </motion.div>
                      <span>CELEBRITY SPOTLIGHT</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
                
                {/* Trending Products */}
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 25px 50px rgba(234, 179, 8, 0.2)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link href="#trending" className="group relative overflow-hidden block">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-dark/60 rounded-2xl border-2 border-gold/30"></div>
                    <div className="relative flex items-center justify-center gap-3 px-8 py-6 text-light font-bold rounded-2xl transition-all text-base md:text-lg group-hover:text-gold">
                      <TrendingUp className="w-6 h-6" />
                      <span>TRENDING PRODUCTS</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              </div>
              
              {/* Secondary actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link href="#fashion-trends" className="group flex items-center justify-center gap-3 px-6 py-4 bg-dark/40 text-light/90 border border-gold/20 font-semibold rounded-xl hover:bg-gold/10 hover:border-gold/40 hover:text-gold transition-all text-sm md:text-base backdrop-blur-sm">
                    <BarChart3 className="w-5 h-5" />
                    <span>STYLE ANALYTICS</span>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link href="#celebrities" className="group flex items-center justify-center gap-3 px-6 py-4 bg-dark/40 text-light/90 border border-gold/20 font-semibold rounded-xl hover:bg-gold/10 hover:border-gold/40 hover:text-gold transition-all text-sm md:text-base backdrop-blur-sm">
                    <Users className="w-5 h-5" />
                    <span>BROWSE CELEBRITIES</span>
                  </Link>
                </motion.div>
              </div>
              
              {/* Status indicators */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-light/60 text-xs font-medium">LIVE DATA</span>
                </div>
                <div className="w-1 h-1 bg-light/30 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-gold fill-gold" />
                  <span className="text-light/60 text-xs font-medium">PREMIUM ACCESS</span>
                </div>
                <div className="w-1 h-1 bg-light/30 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-gold" />
                  <span className="text-light/60 text-xs font-medium">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentBg ? "bg-gold" : "bg-light/30"
              }`}
              onClick={() => {
                setCurrentBg(index);
                setTextIndex(index);
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <Link href="#featured" className="text-gold animate-bounce hover:text-gold/70 transition-colors">
          <div className="p-2 rounded-full border border-gold/30 bg-dark/80">
            <ChevronDown className="h-6 w-6" />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
