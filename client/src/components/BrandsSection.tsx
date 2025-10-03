import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Brand } from "@shared/schema";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star, ChevronRight, Crown, Award } from "lucide-react";

interface BrandsSectionProps {
  onBrandClick: (brand: Brand) => void;
}

export default function BrandsSection({ onBrandClick }: BrandsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });
  
  // Display only the first n brands, where n is visibleCount
  const displayedBrands = brands?.slice(0, visibleCount);
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 3);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  if (isLoading) {
    return (
      <section id="brands" className="py-16 md:py-24 bg-gradient-to-b from-darkgray to-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-48 bg-midgray mx-auto mb-2" />
            <Skeleton className="h-10 w-96 bg-midgray mx-auto mb-4" />
            <Skeleton className="h-6 w-[500px] bg-midgray mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-[280px] rounded-lg bg-midgray" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="brands" className="py-16 md:py-24 bg-gradient-to-b from-darkgray to-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Premium floating elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute top-[10%] left-[15%] w-32 h-32 bg-gold/5 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <motion.div 
              className="absolute top-[20%] right-[10%] w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 0.8, 1],
                opacity: [0.2, 0.4, 0.2] 
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 2
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-3 shadow-lg shadow-gold/20">
              <Crown className="w-5 h-5 text-gold" />
              <span className="text-gold text-sm font-bold uppercase tracking-wider">Luxury Brands</span>
              <Sparkles className="w-4 h-4 text-gold/80" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-7xl font-bold font-playfair text-center mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-light">Premium </span>
            <span className="bg-gradient-to-r from-gold via-gold/90 to-gold/70 bg-clip-text text-transparent drop-shadow-2xl">
              Fashion Brands
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-light/80 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the world's most coveted luxury fashion brands worn by A-list celebrities. 
            From <span className="text-gold font-semibold">exclusive timepieces</span> to <span className="text-gold font-semibold">haute couture</span>, 
            experience the epitome of style and craftsmanship.
          </motion.p>

          {/* Exclusive access badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-gold/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-6 py-3 text-light/90"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium">Exclusive Celebrity Collections • Authenticated Luxury</span>
            <Star className="w-4 h-4 text-gold fill-gold" />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {displayedBrands?.map(brand => (
            <motion.div 
              key={brand.id} 
              variants={item}
              onClick={() => onBrandClick(brand)}
              className="cursor-pointer group"
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative bg-gradient-to-br from-dark/90 to-darkgray/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-gold/20 group-hover:border-gold/40 group-hover:shadow-2xl group-hover:shadow-gold/30 transition-all duration-500">
                {/* Premium badge */}
                <div className="absolute top-6 left-6 z-10">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-gold via-gold/90 to-gold/80 text-dark px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                    <Crown className="w-4 h-4" />
                    LUXURY
                  </div>
                </div>

                {/* Exclusive indicator */}
                <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-400/30">
                    <Star className="w-4 h-4 text-purple-400 fill-purple-400/50" />
                  </div>
                </div>
                
                {/* Enhanced image section */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={brand.imageUrl} 
                    alt={`${brand.name} showcase`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent group-hover:from-dark/50 transition-all duration-500"></div>
                  
                  {/* Luxury shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                  
                  {/* Floating action button */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold to-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center text-dark shadow-lg hover:shadow-gold/30 transition-all duration-300">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Price indicator */}
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-dark/80 backdrop-blur-sm border border-gold/20 rounded-full px-4 py-2">
                      <span className="text-gold text-sm font-bold">From $999+</span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced content section */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold font-playfair text-light group-hover:text-gold transition-colors duration-300 mb-2">
                        {brand.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-gold fill-gold" />
                          <Star className="w-4 h-4 text-gold fill-gold" />
                          <Star className="w-4 h-4 text-gold fill-gold" />
                          <Star className="w-4 h-4 text-gold fill-gold" />
                          <Star className="w-4 h-4 text-gold fill-gold" />
                        </div>
                        <span className="text-gold text-sm font-bold">5.0 • Premium</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-gold font-bold text-lg">From $999+</div>
                      <div className="text-light/60 text-xs">Celebrity Choice</div>
                    </div>
                  </div>
                  
                  <p className="text-light/80 text-sm mb-6 leading-relaxed">
                    {brand.description}
                  </p>
                  
                  {/* Celebrity endorsement highlight */}
                  <div className="bg-gradient-to-r from-gold/10 to-purple-500/10 rounded-2xl p-4 mb-6 border border-gold/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-gold" />
                      <span className="text-gold text-xs font-bold uppercase tracking-wider">Celebrity Endorsed</span>
                    </div>
                    <p className="text-light/70 text-xs leading-relaxed">
                      "This brand represents the pinnacle of luxury and craftsmanship. Every piece tells a story of excellence." - Celebrity Fashion Council
                    </p>
                  </div>
                  
                  {/* Enhanced celebrity wearers section */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gold font-medium uppercase tracking-wider">Worn by A-List:</span>
                      <div className="flex -space-x-2">
                        {brand.celebWearers.slice(0, 4).map((initial, index) => (
                          <motion.div 
                            key={index} 
                            className="w-9 h-9 rounded-full bg-gradient-to-r from-gold to-gold/90 border-2 border-dark flex items-center justify-center text-dark text-xs font-bold shadow-lg"
                            whileHover={{ scale: 1.2, zIndex: 10, y: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {initial}
                          </motion.div>
                        ))}
                        {brand.celebWearers.length > 4 && (
                          <div className="w-9 h-9 rounded-full bg-purple-500/20 border-2 border-dark flex items-center justify-center text-purple-400 text-xs font-bold">
                            +{brand.celebWearers.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <motion.div
                      className="flex items-center gap-1 text-light/60 group-hover:text-gold transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-medium">Verified Authentic</span>
                    </motion.div>
                  </div>

                  {/* Call to action */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-light/60">
                      Available at select boutiques
                    </div>
                    <div className="flex items-center gap-2 text-gold">
                      <span className="text-sm font-medium">Explore Collection</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {brands && brands.length > visibleCount && (
          <motion.div 
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="outline"
              className="px-12 py-4 border-2 border-gold text-gold hover:bg-gradient-to-r hover:from-gold hover:to-gold/90 hover:text-dark transition-all font-bold rounded-full text-lg shadow-lg hover:shadow-gold/30 group"
              onClick={handleLoadMore}
            >
              <Crown className="w-5 h-5 mr-2" />
              Discover More Luxury Brands
              <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
