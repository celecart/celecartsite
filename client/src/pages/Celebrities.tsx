import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Celebrity } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Users, Search, Crown, Star, Filter
} from "lucide-react";

export default function Celebrities() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  // Categories for the filter buttons
  const categories = [
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

  if (isLoading) {
    return (
      <div className="bg-darkgray min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-darkgray min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20 pt-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Celebrity <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Gallery</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the fashion choices and style inspirations of your favorite celebrities
            </p>
            <div className="flex items-center justify-center gap-4 text-white/80">
              <Users className="h-5 w-5" />
              <span>{celebrities?.length || 0} Celebrities</span>
              <Star className="h-5 w-5 ml-4" />
              <span>{celebrities?.filter(c => c.isElite).length || 0} Elite Members</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search celebrities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${
                    selectedCategory === category.id
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-700/50 hover:bg-gray-600 text-gray-300 border-gray-600"
                  }`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 mb-6 text-gray-400">
          <Filter className="h-4 w-4" />
          <span>
            Showing {filteredCelebrities?.length || 0} of {celebrities?.length || 0} celebrities
          </span>
        </div>

        {/* Celebrity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCelebrities?.map((celebrity, index) => (
            <motion.div
              key={celebrity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/celebrity/${celebrity.id}`}>
                <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-colors duration-200 cursor-pointer group overflow-hidden">
                  <div className="relative overflow-hidden">
                    {(() => {
                      const slug = celebrity.name.toLowerCase().replace(/\s+/g, '-');
                      const primary = `/assets/${slug}/profile.jpg`;
                      const backups = [
                        `/assets/${slug}/profile.png`,
                        `/assets/${slug}.jpg`,
                        `/assets/${slug}.png`,
                        `/assets/celebrities/${slug}.jpg`,
                        `/assets/celebrities/${slug}.png`,
                        `/assets/profiles/${slug}.jpg`,
                        `/assets/profiles/${slug}.png`,
                        celebrity.imageUrl,
                      ];
                      return (
                        <FallbackImage
                          src={primary}
                          backupSrc={backups}
                          alt={celebrity.name}
                          className="w-full h-64 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                          fallbackSrc="/assets/placeholder-celebrity.svg"
                        />
                      );
                    })()}
                    
                    {/* Elite Badge */}
                    {celebrity.isElite && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                          <Crown className="h-3 w-3 mr-1" />
                          Elite
                        </Badge>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {celebrity.category}
                      </Badge>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                          {celebrity.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-200">
                      {celebrity.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {celebrity.profession}
                    </p>
                    
                    {/* Manager Info */}
                    {celebrity.managerInfo && (
                      <div className="text-xs text-gray-500 mb-2">
                        Manager: {celebrity.managerInfo.name}
                      </div>
                    )}

                    {/* Styling Details */}
                    {celebrity.stylingDetails && celebrity.stylingDetails.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Style: {celebrity.stylingDetails[0].occasion}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCelebrities?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No celebrities found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
