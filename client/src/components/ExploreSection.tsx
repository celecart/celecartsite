import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@shared/schema";
import { motion } from "framer-motion";

export default function ExploreSection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
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
      <section id="explore" className="py-16 md:py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-48 bg-midgray mx-auto mb-2" />
            <Skeleton className="h-10 w-96 bg-midgray mx-auto mb-4" />
            <Skeleton className="h-6 w-[500px] bg-midgray mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg bg-midgray" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="explore" className="py-16 md:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Style Categories</span>
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-light">Explore By Occasion</h2>
          <p className="text-light/70 mt-4 max-w-3xl mx-auto">Discover celebrity fashion choices for different events and settings</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories?.map(category => (
            <motion.div key={category.id} variants={item} className="cursor-pointer">
              <div className="group relative overflow-hidden rounded-lg">
                <div className="aspect-square">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6">
                  <h3 className="text-xl font-bold font-playfair text-light group-hover:text-gold transition-colors">{category.name}</h3>
                  <p className="text-light/80 text-sm mt-1 mb-2">{category.description}</p>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gold"></span>
                    <span className="w-2 h-2 rounded-full bg-gold"></span>
                    <span className="w-2 h-2 rounded-full bg-gold"></span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
