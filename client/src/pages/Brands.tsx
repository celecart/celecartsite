import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Brand } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";

export default function Brands() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  // Modal removed; navigate to brand products page on click

  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const filteredBrands = useMemo(() => {
    const list = brands || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((b) =>
      [b.name, b.description || "", b.sourceType || ""].some((t) => t.toLowerCase().includes(q))
    );
  }, [brands, search]);

  const handleOpen = (brand: Brand) => {
    if (brand?.id) setLocation(`/brands/${brand.id}/products`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="bg-darkgray min-h-screen">
      <Header />

      <section className="pt-36 md:pt-44 pb-16 bg-gradient-to-b from-darkgray to-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-3 shadow-lg shadow-gold/20">
              <Crown className="w-5 h-5 text-gold" />
              <span className="text-gold text-sm font-bold uppercase tracking-wider">All Brands</span>
              <Sparkles className="w-4 h-4 text-gold/80" />
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl font-bold font-playfair text-light">
              Explore Celebrity-Endorsed Luxury Brands
            </h1>
            <p className="mt-3 text-light/80 max-w-3xl mx-auto">
              Browse the full catalogue of premium brands featured across Celecart. Use search to quickly find your favorites.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-8">
            <div className="relative flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands by name, description, or source…"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 py-6 rounded-xl"
              />
            </div>
            <Button
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-dark rounded-xl"
              onClick={() => setSearch(search.trim())}
            >
              Search
            </Button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[280px] rounded-2xl bg-midgray" />
              ))}
            </div>
          )}

          {!isLoading && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredBrands.map((brand) => (
                <motion.div
                  key={brand.id}
                  variants={item}
                  className="group cursor-pointer"
                  onClick={() => handleOpen(brand)}
                >
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-gold/40 transition-all duration-300">
                    {/* Image with simple overlay title */}
                    <div className="relative h-64 md:h-80">
                      <img
                        src={brand.imageUrl}
                        alt={`${brand.name} showcase`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-white text-3xl md:text-4xl font-bold font-playfair tracking-wide drop-shadow-lg">
                          {brand.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && filteredBrands.length === 0 && (
            <div className="text-center text-light/70 py-20">No brands match your search.</div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}