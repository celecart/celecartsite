import { useQuery } from "@tanstack/react-query";
import { Celebrity, Brand } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Crown } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";

interface FeaturedCelebrityProps {
  onBrandClick: (brand: Brand) => void;
}

export default function FeaturedCelebrity({ onBrandClick }: FeaturedCelebrityProps) {
  // Get celebrities data
  const { data: celebrities, isLoading } = useQuery<Celebrity[]>({
    queryKey: ["/api/celebrities"],
  });
  
  // Featured celebrities are those marked as Elite
  const featuredCelebrities = celebrities?.filter(celeb => celeb.isElite && celeb.isActive) || [];
  
  // Get brands for the first 3 elite celebrities to maintain consistent hook calls
  const celebrity1 = featuredCelebrities[0];
  const celebrity2 = featuredCelebrities[1];
  const celebrity3 = featuredCelebrities[2];
  
  const celebrity1Brands = useQuery<any[]>({
    queryKey: [`/api/celebritybrands/${celebrity1?.id}`],
    enabled: !!celebrity1?.id,
  });
  
  const celebrity2Brands = useQuery<any[]>({
    queryKey: [`/api/celebritybrands/${celebrity2?.id}`],
    enabled: !!celebrity2?.id,
  });
  
  const celebrity3Brands = useQuery<any[]>({
    queryKey: [`/api/celebritybrands/${celebrity3?.id}`],
    enabled: !!celebrity3?.id,
  });
  
  const celebrityBrandQueries = [celebrity1Brands, celebrity2Brands, celebrity3Brands];
  
  // Get brands for each celebrity
  const brandsLoading = celebrityBrandQueries.some(query => query.isLoading);
  
  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-darkgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-lg bg-midgray" />
                <Skeleton className="h-6 w-3/4 bg-midgray" />
                <Skeleton className="h-4 w-full bg-midgray" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 bg-midgray" />
                  <Skeleton className="h-6 w-24 bg-midgray" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  // Render available celebrities even if some are missing
  if (!featuredCelebrities || featuredCelebrities.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-darkgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-light/60">
            <p>Featured celebrities will appear here once loaded.</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-darkgray via-dark to-darkgray relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-gold/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-gold/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact section header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold text-xs font-bold inline-flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              FEATURED
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold font-playfair text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-light">Style </span>
            <span className="bg-gradient-to-r from-gold via-gold to-gold/80 bg-clip-text text-transparent">
              Spotlight
            </span>
          </motion.h2>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Render up to 3 elite celebrities */}
          {featuredCelebrities.slice(0, 3).map((celebrity, index) => {
            const celebrityBrandQuery = celebrityBrandQueries[index];
            const celebrityBrands = celebrityBrandQuery?.data;
            const brands = celebrityBrands?.map((item: any) => item.brand).filter(Boolean) || [];
            
            return (
              <motion.div
                key={celebrity.id}
                className="space-y-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
              >
                {/* Celebrity Image */}
                <motion.div 
                  className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dark/60 to-darkgray/60 border border-gold/20 shadow-lg group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <FallbackImage
                      src={celebrity.imageUrl}
                      alt={`${celebrity.name} featured style portrait`}
                      fallbackText={`${celebrity.name} photo unavailable`}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Enhanced overlay gradient with hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-dark/10 group-hover:from-dark/20 transition-all duration-500"></div>
                    
                    {/* Enhanced ranking badge */}
                    <div className="absolute top-3 right-3">
                      <motion.div 
                        className="flex items-center gap-1 bg-gradient-to-r from-gold/90 to-gold/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-dark text-xs font-bold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Crown className="w-3 h-3" />
                        ELITE
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Compact Celebrity Details */}
                <motion.div 
                  className="bg-gradient-to-br from-dark/70 to-darkgray/70 backdrop-blur-sm rounded-xl border border-gold/10 p-3"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                >
                  <h3 className="text-lg md:text-xl font-bold font-playfair text-light mb-1 leading-tight">
                    {celebrity.name}
                  </h3>
                  
                  <p className="text-gold/80 text-xs font-medium mb-2">
                    {celebrity.profession}
                  </p>
                  
                  {/* Style Preview Tags */}
                  <motion.div 
                    className="flex flex-wrap gap-1 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    {celebrity.category && (
                      <span className="px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs">
                        {celebrity.category}
                      </span>
                    )}
                    {celebrity.stylingDetails && celebrity.stylingDetails.length > 0 && (
                      <span className="px-2 py-0.5 bg-light/5 border border-light/20 rounded-full text-light/60 text-xs">
                        {celebrity.stylingDetails.length} Looks
                      </span>
                    )}
                  </motion.div>
                  
                  {/* Minimal Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Link 
                      href={`/celebrity/${celebrity.id}`}
                      className="group inline-flex items-center justify-center w-full px-3 py-2.5 bg-gradient-to-r from-gold via-gold/95 to-gold/90 text-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/25 hover:from-gold hover:to-gold/80 transition-all duration-300 text-xs"
                      data-testid={`button-view-profile-${celebrity.id}`}
                    >
                      View Profile
                      <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
