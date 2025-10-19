import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Celebrity } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Search, Crown, Star
} from "lucide-react";

export default function CelebrityGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  
  const { data: celebrities, isLoading } = useQuery<Celebrity[]>({
    queryKey: ["/api/celebrities"],
  });
  
  // Filter celebrities by category and search term
  const filteredCelebrities = celebrities?.filter(celebrity => {
    const matchesCategory = selectedCategory === "All" || celebrity.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      celebrity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      celebrity.profession.toLowerCase().includes(searchTerm.toLowerCase());
    return celebrity.isActive && matchesCategory && matchesSearch;
  });
  
  // Display all filtered celebrities without pagination
  const displayedCelebrities = filteredCelebrities;
  
  // Categories for the filter buttons
  const categories = [
    { id: "All", label: "All Celebrities" },
    { id: "On-Court Style", label: "On-Court" },
    { id: "Court Fashion", label: "Court Fashion" },
    { id: "Red Carpet", label: "Red Carpet" },
    { id: "Street Style", label: "Street Style" },
    { id: "Event Fashion", label: "Event" },
    { id: "Sports", label: "Sports" },
    { id: "Politics", label: "Politics" },
    { id: "Fashion", label: "Fashion" },
    { id: "Casual", label: "Casual" },
    { id: "Athleisure", label: "Athleisure" },
    { id: "High Fashion", label: "High Fashion" },
  ];
  
  // Animation variants
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
  
  // Loading state
  if (isLoading) {
    return (
      <section id="celebrities" className="py-16 md:py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-48 bg-midgray mx-auto mb-2" />
            <Skeleton className="h-10 w-96 bg-midgray mx-auto mb-4" />
            <Skeleton className="h-6 w-[500px] bg-midgray mx-auto" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((_, index) => (
              <Skeleton key={index} className="h-10 w-24 bg-midgray rounded-full" />
            ))}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 md:gap-4">
            {[...Array(16)].map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg bg-midgray" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="celebrities" className="min-h-screen py-20 bg-gradient-to-br from-dark via-dark/95 to-dark relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Luxury decorative elements */}
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-gradient-to-r from-gold/10 to-transparent rounded-full blur-3xl opacity-60" aria-hidden="true"></div>
      <div className="absolute right-0 bottom-1/4 w-80 h-80 bg-gradient-to-l from-gold/5 to-transparent rounded-full blur-3xl opacity-60" aria-hidden="true"></div>
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl opacity-40" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header */}
        <motion.div 
          className="text-center mb-20"
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
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold text-sm font-bold inline-flex items-center">
              <Users className="w-4 h-4 mr-2" />
              CELEBRITY SHOWCASE
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-light">Meet Your </span>
            <span className="bg-gradient-to-r from-gold via-gold to-gold/80 bg-clip-text text-transparent">
              Fashion Icons
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-light/80 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Explore the personal style journeys of the world's most influential celebrities and fashion leaders
          </motion.p>
        </motion.div>
        
        {/* Premium Search and Filter Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Luxury Search Input */}
          <div className="relative max-w-xl mx-auto mb-10">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gold/60" />
            </div>
            <input
              type="text"
              className="block w-full pl-16 pr-6 py-5 border-2 border-gold/30 bg-dark/80 backdrop-blur-sm rounded-full text-light placeholder-light/50 focus:outline-none focus:ring-4 focus:ring-gold/20 focus:border-gold/60 text-lg shadow-xl"
              placeholder="Search for your favorite celebrity's style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/5 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Elite Category Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {categories.map(category => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? "bg-gradient-to-r from-gold to-gold/90 text-dark shadow-xl shadow-gold/25 border-2 border-gold" 
                      : "bg-dark/60 backdrop-blur-sm border-2 border-gold/30 hover:border-gold hover:bg-gold/15 text-light/90 hover:text-gold hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="text-sm">{category.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Celebrities Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 md:gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {displayedCelebrities?.map(celebrity => (
            <motion.div 
              key={celebrity.id}
              variants={item}
              onHoverStart={() => setHoveredCardId(celebrity.id)}
              onHoverEnd={() => setHoveredCardId(null)}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link 
                href={`/celebrity/${celebrity.id}`}
                className="block group"
              >
                <div className={`relative bg-dark/60 backdrop-blur-sm rounded-xl overflow-hidden border transition-all duration-300 ${
                  celebrity.isElite 
                    ? 'border-gold/40 group-hover:border-gold/60 group-hover:shadow-xl group-hover:shadow-gold/20' 
                    : 'border-gold/20 group-hover:border-gold/40 group-hover:shadow-lg'
                }`}>
                  {/* Elite Badge */}
                  {celebrity.isElite && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-gold via-gold to-gold/90 px-2 py-1 rounded-full text-dark text-xs font-bold shadow-lg">
                        <Crown className="w-3 h-3" />
                        <span>ELITE</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Celebrity Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <FallbackImage 
                      src={celebrity.imageUrl}
                      alt={`${celebrity.name}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-300 ${
                      celebrity.isElite 
                        ? 'from-dark/30 via-transparent to-gold/5' 
                        : 'from-dark/40 via-transparent to-transparent'
                    }`}></div>
                  </div>
                  
                  {/* Celebrity Info */}
                  <div className="p-3">
                    <h3 className={`text-sm font-semibold transition-colors duration-300 line-clamp-1 mb-1 ${
                      celebrity.isElite 
                        ? 'text-gold group-hover:text-gold/80' 
                        : 'text-light group-hover:text-gold'
                    }`}>
                      {celebrity.name}
                      {celebrity.isElite && <Star className="inline w-3 h-3 ml-1 text-gold" />}
                    </h3>
                    
                    <p className="text-xs text-light/70 line-clamp-1">
                      {celebrity.profession}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Results Summary */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-light/60">
            Showing <span className="text-gold font-semibold">{displayedCelebrities?.length || 0}</span> fashion icons
            {selectedCategory !== "All" && (
              <> in <span className="text-gold font-semibold">{selectedCategory}</span></>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}