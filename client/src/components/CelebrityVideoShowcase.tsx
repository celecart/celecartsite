import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Video, Clock, Award, Eye, Star, Sparkles, ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  embedId: string;
  category: string;
  duration: string;
  views: string;
  celebrity: string;
  date: string;
}

const videoContents: VideoContent[] = [
  {
    id: "v1",
    title: "Roger Federer's Winning Outfit at Wimbledon",
    description: "A detailed look at Roger Federer's iconic all-white Wimbledon outfit that combines performance technology with classic tennis style. Discover the luxury brands behind his championship looks.",
    thumbnail: "/assets/Roger-Federer-US-Open-2007.webp",
    embedId: "dQw4w9WgXcQ",
    category: "Tennis",
    duration: "5:24",
    views: "1.8M",
    celebrity: "Roger Federer",
    date: "Aug 15, 2024"
  },
  {
    id: "v2",
    title: "Blake Lively's Met Gala Fashion Statements",
    description: "Explore Blake Lively's most iconic Met Gala looks and how she consistently delivers show-stopping red carpet moments with exclusive designer pieces.",
    thumbnail: "/assets/trending/bulgari-bag.jpg",
    embedId: "9bZkp7q19f0",
    category: "Fashion",
    duration: "7:12",
    views: "3.2M",
    celebrity: "Blake Lively",
    date: "May 3, 2024"
  },
  {
    id: "v3",
    title: "Selena Gomez: Behind Rare Beauty's Success",
    description: "How Selena Gomez built Rare Beauty into a powerhouse brand with inclusive messaging and quality formulations that revolutionized the beauty industry.",
    thumbnail: "/assets/trending/rare-beauty-blush.jpg",
    embedId: "JGwWNGJdvx8",
    category: "Beauty",
    duration: "8:46",
    views: "5.4M",
    celebrity: "Selena Gomez",
    date: "Jun 22, 2024"
  },
  {
    id: "v4",
    title: "Fawad Khan: South Asian Fashion Icon",
    description: "A look at how actor Fawad Khan has influenced men's fashion with his sophisticated style choices and brand collaborations across international markets.",
    thumbnail: "/assets/trending/canali-suit.jpg",
    embedId: "kJQP7kiw5Fk",
    category: "Style",
    duration: "6:18",
    views: "2.7M",
    celebrity: "Fawad Khan",
    date: "Jul 12, 2024"
  },
  {
    id: "v5",
    title: "Jay-Z's Luxury Watch Collection",
    description: "An exclusive inside look at Jay-Z's incredible collection of luxury timepieces, featuring Patek Philippe, Richard Mille, and rare vintage pieces.",
    thumbnail: "/assets/Jay-Z.webp",
    embedId: "fJ9rUzIMcZQ",
    category: "Style",
    duration: "9:32",
    views: "4.1M",
    celebrity: "Jay-Z",
    date: "Sep 8, 2024"
  },
  {
    id: "v6",
    title: "Tom Cruise: Action Hero Style Evolution",
    description: "From Top Gun to Mission Impossible, explore how Tom Cruise's iconic style has evolved while maintaining his signature sophisticated edge.",
    thumbnail: "/assets/image_1754013029728.png",
    embedId: "M7lNBMGmGF0",
    category: "Fashion",
    duration: "6:45",
    views: "2.9M",
    celebrity: "Tom Cruise",
    date: "Oct 14, 2024"
  }
];

export default function CelebrityVideoShowcase() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(videoContents[0]);
  
  const filteredVideos = activeTab === "all" 
    ? videoContents 
    : videoContents.filter(video => video.category.toLowerCase() === activeTab.toLowerCase());
  
  return (
    <section id="videos" className="py-24 bg-gradient-to-br from-dark via-dark to-darkgray relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-gold/10 to-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-l from-purple-600/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-gold/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Premium grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-gold/10 rounded-sm"></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.span 
              className="px-4 py-2 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold text-sm font-bold inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Video className="w-4 h-4 mr-2" />
              EXCLUSIVE CONTENT
            </motion.span>
          </div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-light">Celebrity </span>
            <span className="bg-gradient-to-r from-gold via-gold to-gold/80 bg-clip-text text-transparent">
              Video
            </span>
            <span className="text-light"> Showcase</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-light/80 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Watch exclusive videos featuring celebrity style insights and brand stories from the world's most influential fashion icons
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-light/60">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Live Streaming</span>
            </div>
            <div className="flex items-center gap-2 text-light/60">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-sm font-medium">Premium Content</span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="bg-dark/60 backdrop-blur-sm border border-gold/20 p-1 rounded-2xl">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-gold/90 data-[state=active]:text-dark data-[state=active]:shadow-lg font-semibold px-6 py-2 rounded-xl transition-all"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="fashion" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-gold/90 data-[state=active]:text-dark data-[state=active]:shadow-lg font-semibold px-6 py-2 rounded-xl transition-all"
                >
                  Fashion
                </TabsTrigger>
                <TabsTrigger 
                  value="tennis" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-gold/90 data-[state=active]:text-dark data-[state=active]:shadow-lg font-semibold px-6 py-2 rounded-xl transition-all"
                >
                  Tennis
                </TabsTrigger>
                <TabsTrigger 
                  value="beauty" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-gold/90 data-[state=active]:text-dark data-[state=active]:shadow-lg font-semibold px-6 py-2 rounded-xl transition-all"
                >
                  Beauty
                </TabsTrigger>
                <TabsTrigger 
                  value="style" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold data-[state=active]:to-gold/90 data-[state=active]:text-dark data-[state=active]:shadow-lg font-semibold px-6 py-2 rounded-xl transition-all"
                >
                  Style
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Main video player */}
          <div className="lg:col-span-8">
            <motion.div 
              className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-dark to-darkgray shadow-2xl shadow-black/40 aspect-video border-2 border-gold/20"
              layout
              layoutId={selectedVideo?.id}
              transition={{ duration: 0.5, type: "spring" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Premium video frame */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/20 via-transparent to-dark/20 z-10"></div>
              
              <iframe
                className="w-full h-full relative z-0"
                src={`https://www.youtube.com/embed/${selectedVideo?.embedId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`}
                title={selectedVideo?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              {/* Premium overlay elements */}
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-gradient-to-r from-gold/90 to-gold text-dark font-bold px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  EXCLUSIVE
                </Badge>
              </div>
              
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <motion.div 
                  className="flex items-center gap-1 bg-dark/60 backdrop-blur-sm px-3 py-1 rounded-full text-light/80 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <TrendingUp className="w-3 h-3 text-gold" />
                  TRENDING
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-8 p-6 bg-gradient-to-br from-dark/80 to-darkgray/80 backdrop-blur-sm rounded-2xl border border-gold/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-gradient-to-r from-gold to-gold/90 text-dark font-bold px-3 py-1">
                    {selectedVideo?.category}
                  </Badge>
                  <div className="flex items-center text-light/60 text-sm font-medium">
                    <Clock className="mr-1 w-4 h-4" /> 
                    {selectedVideo?.duration}
                  </div>
                  <div className="flex items-center text-light/60 text-sm font-medium">
                    <Eye className="mr-1 w-4 h-4" /> 
                    {selectedVideo?.views} views
                  </div>
                </div>
                
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-gold/20 hover:bg-gold/30 border border-gold/30 text-gold rounded-xl transition-all font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Star className="w-4 h-4" />
                  Save
                </motion.button>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-light font-playfair mb-3 leading-tight">
                {selectedVideo?.title}
              </h3>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Award className="text-gold w-5 h-5" />
                  <span className="text-gold font-semibold text-lg">{selectedVideo?.celebrity}</span>
                </div>
                <div className="w-1 h-1 bg-light/30 rounded-full"></div>
                <span className="text-light/60 text-sm font-medium">{selectedVideo?.date}</span>
                <div className="w-1 h-1 bg-light/30 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Live</span>
                </div>
              </div>
              
              <p className="text-light/80 leading-relaxed text-lg">
                {selectedVideo?.description}
              </p>
              
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gold/10">
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold/90 text-dark font-bold rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4" />
                  Watch Similar
                </motion.button>
                
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-dark/60 border border-gold/30 text-light font-semibold rounded-xl hover:bg-gold/10 hover:border-gold/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronRight className="w-4 h-4" />
                  View Profile
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          {/* Enhanced Video playlist */}
          <div className="lg:col-span-4">
            <motion.div 
              className="bg-gradient-to-br from-dark/60 to-darkgray/60 backdrop-blur-sm rounded-2xl border border-gold/10 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-light font-playfair">
                  More Videos
                </h3>
                <Badge className="bg-gold/20 text-gold border border-gold/30 px-3 py-1">
                  {filteredVideos.length}
                </Badge>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-dark/20">
                <AnimatePresence>
                  {filteredVideos.map((video, index) => (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`group flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedVideo?.id === video.id 
                          ? "bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/40 shadow-lg shadow-gold/10" 
                          : "bg-dark/40 border border-gold/10 hover:bg-dark/60 hover:border-gold/20"
                      }`}
                      onClick={() => setSelectedVideo(video)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex-shrink-0 w-28 h-20 overflow-hidden rounded-lg">
                        <img 
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {selectedVideo?.id !== video.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-dark/60 backdrop-blur-sm transition-opacity group-hover:bg-dark/40">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Play className="w-6 h-6 text-gold fill-gold drop-shadow-lg" />
                            </motion.div>
                          </div>
                        )}
                        {selectedVideo?.id === video.id && (
                          <div className="absolute top-2 right-2">
                            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                          </div>
                        )}
                        
                        <div className="absolute bottom-1 right-1 bg-dark/80 text-light text-xs px-2 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-light font-semibold text-sm mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center text-xs text-light/60 mb-1">
                          <Award className="w-3 h-3 mr-1 text-gold" />
                          <span className="font-medium">{video.celebrity}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-light/50">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {video.views}
                            </span>
                            <span>{video.date}</span>
                          </div>
                          {selectedVideo?.id === video.id && (
                            <motion.div 
                              className="text-gold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <motion.div
                className="mt-6 pt-6 border-t border-gold/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline"
                  className="w-full border-2 border-gold/30 text-gold hover:bg-gradient-to-r hover:from-gold/10 hover:to-gold/5 hover:border-gold/50 font-semibold py-3 rounded-xl transition-all"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Browse All Videos
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}