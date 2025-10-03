import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Celebrity, Brand } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductShoppingCart from "./ProductShoppingCart";
import AdminTaggingInterface from "./AdminTaggingInterface";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Share2, Heart, 
  ShoppingBag, Star, Crown, Eye, Clock, Users, Sparkles,
  ExternalLink, Plus, ChevronRight, Tag, Settings, Bot
} from "lucide-react";

interface VideoProduct {
  id: number;
  brandId: number;
  name: string;
  price: string;
  imageUrl: string;
  purchaseUrl: string;
  position: { x: number; y: number }; // Position on video (percentage)
  timeStart: number; // When tag appears (seconds)
  timeEnd: number; // When tag disappears (seconds)
  confidence?: number; // AI confidence score (0-100)
  source: 'ai' | 'manual'; // Tag source
  status: 'pending' | 'approved' | 'rejected'; // Review status
}

interface CelebrityVideo {
  id: number;
  celebrityId: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  uploadDate: string;
  category: string;
  products: VideoProduct[];
  isExclusive: boolean;
  isPremium: boolean;
}

const sampleVideos: CelebrityVideo[] = [
  {
    id: 1,
    celebrityId: 36,
    title: "Roger Federer's Winning Outfit at Wimbledon",
    description: "Discover the luxury pieces Roger wore during his championship moments",
    videoUrl: "https://www.youtube.com/embed/3S8ynIDYydk",
    thumbnailUrl: "/attached_assets/image_1754197874260.png",
    duration: "5:24",
    views: "1.8M",
    uploadDate: "Aug 15, 2024",
    category: "Fashion",
    isExclusive: true,
    isPremium: true,
    products: [
      {
        id: 1,
        brandId: 72,
        name: "Rolex Submariner Watch",
        price: "$12,550",
        imageUrl: "/assets/rolex-submariner.jpg",
        purchaseUrl: "https://rolex.com/submariner",
        position: { x: 75, y: 30 },
        timeStart: 15,
        timeEnd: 45,
        confidence: 95,
        source: 'ai' as const,
        status: 'approved' as const
      },
      {
        id: 2,
        brandId: 73,
        name: "Nike Court Advantage Shirt",
        price: "$85",
        imageUrl: "/assets/nike-court-shirt.jpg", 
        purchaseUrl: "https://nike.com/court-shirt",
        position: { x: 45, y: 60 },
        timeStart: 30,
        timeEnd: 120,
        confidence: 89,
        source: 'ai' as const,
        status: 'approved' as const
      }
    ]
  }
];

export default function InteractiveVideoShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<CelebrityVideo>(sampleVideos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showProducts, setShowProducts] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showAdminInterface, setShowAdminInterface] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // In real app, this would come from auth
  const videoRef = useRef<HTMLIFrameElement>(null);

  const { data: celebrities } = useQuery<Celebrity[]>({
    queryKey: ["/api/celebrities"],
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const categories = [
    { id: "All", label: "All Videos", icon: <Users size={16} /> },
    { id: "Fashion", label: "Fashion", icon: <Crown size={16} /> },
    { id: "Tennis", label: "Tennis", icon: <Star size={16} /> },
    { id: "Beauty", label: "Beauty", icon: <Sparkles size={16} /> },
    { id: "Style", label: "Style", icon: <Eye size={16} /> }
  ];

  // Get visible products based on current time and status
  const visibleProducts = selectedVideo.products.filter(
    product => {
      const timeVisible = currentTime >= product.timeStart && currentTime <= product.timeEnd;
      const statusVisible = product.status === 'approved' || (isAdmin && product.status === 'pending');
      return timeVisible && statusVisible;
    }
  );

  // Update current time (simulated for demo)
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleProductClick = (product: VideoProduct) => {
    // Add to cart
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      priceNumeric: parseInt(product.price.replace(/[^0-9]/g, '')),
      imageUrl: product.imageUrl,
      brandName: brands?.find(b => b.id === product.brandId)?.name || 'Unknown Brand',
      quantity: 1,
      purchaseUrl: product.purchaseUrl
    };
    
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(items => 
        items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(items => [...items, cartItem]);
    }
    
    // Show cart briefly
    setShowCart(true);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const filteredVideos = selectedCategory === "All" 
    ? sampleVideos 
    : sampleVideos.filter(video => video.category === selectedCategory);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-dark via-darkgray to-dark relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-gold/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-l from-gold/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header */}
        <motion.div 
          className="text-center mb-16"
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
              <Play className="w-4 h-4 mr-2" />
              LIVE STREAMING
            </span>
            <span className="ml-3 px-4 py-2 rounded-full bg-gradient-to-r from-gold/30 to-gold/15 border border-gold/40 text-gold text-sm font-bold inline-flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              PREMIUM CONTENT
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-light">Interactive </span>
            <span className="bg-gradient-to-r from-gold via-gold to-gold/80 bg-clip-text text-transparent">
              Video Shopping
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-light/80 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Watch celebrity style videos with clickable product tags. Discover and purchase the exact items they're wearing.
          </motion.p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
                    ? "bg-gradient-to-r from-gold to-gold/90 text-dark shadow-xl shadow-gold/25" 
                    : "bg-dark/60 backdrop-blur-sm border-gold/30 hover:border-gold hover:bg-gold/15 text-light/90 hover:text-gold"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span className="text-sm">{category.label}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <motion.div 
              className="relative bg-gradient-to-br from-dark/80 to-darkgray/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-gold/20 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Video Container */}
              <div className="relative aspect-video">
                <iframe
                  ref={videoRef}
                  src={selectedVideo.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Product Tags Overlay */}
                <AnimatePresence>
                  {showProducts && visibleProducts.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute z-20 cursor-pointer"
                      style={{ 
                        left: `${product.position.x}%`, 
                        top: `${product.position.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => handleProductClick(product)}
                      onHoverStart={() => setHoveredProduct(product.id)}
                      onHoverEnd={() => setHoveredProduct(null)}
                    >
                      {/* Pulsing Tag */}
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                          product.source === 'ai'
                            ? product.status === 'pending'
                              ? 'bg-orange-500 border-orange-300'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-300'
                            : 'bg-gradient-to-r from-gold to-gold/90 border-white/20'
                        }`}>
                          {product.source === 'ai' ? (
                            <Bot className="w-4 h-4 text-white" />
                          ) : (
                            <Plus className="w-4 h-4 text-dark" />
                          )}
                        </div>
                        
                        {/* Pulsing rings - different colors for AI vs manual */}
                        <div className={`absolute inset-0 rounded-full animate-ping ${
                          product.source === 'ai' ? 'bg-blue-400/30' : 'bg-gold/30'
                        }`}></div>
                        <div className={`absolute inset-0 rounded-full animate-ping ${
                          product.source === 'ai' ? 'bg-blue-400/20' : 'bg-gold/20'
                        }`} style={{ animationDelay: '0.75s' }}></div>
                        
                        {/* AI Confidence Badge */}
                        {product.source === 'ai' && product.confidence && product.confidence >= 85 && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <Badge className="text-xs bg-green-500/80 text-white">
                              {product.confidence}%
                            </Badge>
                          </div>
                        )}
                        
                        {/* Product Info Tooltip */}
                        <AnimatePresence>
                          {hoveredProduct === product.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8, y: 10 }}
                              className="absolute -top-32 left-1/2 transform -translate-x-1/2 bg-dark/95 backdrop-blur-sm border border-gold/30 rounded-xl p-4 min-w-64 shadow-2xl"
                            >
                              <div className="flex items-start gap-3">
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="text-light font-semibold text-sm mb-1">
                                    {product.name}
                                  </h4>
                                  <p className="text-gold font-bold text-lg mb-2">
                                    {product.price}
                                  </p>
                                  <Button 
                                    size="sm"
                                    className="bg-gradient-to-r from-gold to-gold/90 text-dark font-semibold hover:shadow-lg transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleProductClick(product);
                                    }}
                                  >
                                    <ShoppingBag className="w-3 h-3 mr-1" />
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Tooltip Arrow */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-dark/95"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Video Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {selectedVideo.isExclusive && (
                    <Badge className="bg-gradient-to-r from-gold/90 to-gold text-dark font-bold">
                      <Crown className="w-3 h-3 mr-1" />
                      EXCLUSIVE
                    </Badge>
                  )}
                  {selectedVideo.isPremium && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold">
                      <Star className="w-3 h-3 mr-1" />
                      PREMIUM
                    </Badge>
                  )}
                </div>
                
                {/* Video Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setShowProducts(!showProducts)}
                    className="bg-dark/80 backdrop-blur-sm border border-gold/30 text-gold px-3 py-2 rounded-full hover:bg-gold/10 transition-all text-sm"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {showProducts ? 'Hide' : 'Show'} Tags
                  </button>
                  
                  <button
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`px-3 py-2 rounded-full text-sm transition-all ${
                      isAdmin 
                        ? 'bg-gold/20 border border-gold/40 text-gold' 
                        : 'bg-dark/80 backdrop-blur-sm border border-gold/30 text-gold hover:bg-gold/10'
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </button>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold font-playfair text-light mb-2">
                      {selectedVideo.title}
                    </h3>
                    <p className="text-light/70 mb-4">
                      {selectedVideo.description}
                    </p>
                    <div className="flex items-center gap-6 text-light/60 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {selectedVideo.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedVideo.uploadDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {selectedVideo.products.length} products
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="border-gold/30 text-light hover:text-gold">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gold/30 text-light hover:text-gold">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* More Videos Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-dark/80 to-darkgray/80 backdrop-blur-sm rounded-3xl border border-gold/10 p-6">
              <h3 className="text-2xl font-bold font-playfair text-light mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-gold" />
                More Videos
              </h3>
              
              <div className="space-y-4">
                {filteredVideos.filter(v => v.id !== selectedVideo.id).map(video => (
                  <motion.div
                    key={video.id}
                    className="group cursor-pointer bg-dark/60 rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-300"
                    onClick={() => setSelectedVideo(video)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex gap-4 p-4">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-24 h-16 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-white opacity-80" />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {video.duration}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-light font-semibold text-sm mb-1 line-clamp-2 group-hover:text-gold transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2 text-light/60 text-xs">
                          <span>{video.views}</span>
                          <span>•</span>
                          <span>{video.uploadDate}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {video.isExclusive && (
                            <Badge variant="outline" className="text-xs border-gold/40 text-gold">
                              Exclusive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Admin Tagging Interface */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mt-12"
            >
              <AdminTaggingInterface
                videoId={selectedVideo.id}
                videoUrl={selectedVideo.videoUrl}
                products={selectedVideo.products}
                onUpdateProducts={(products) => {
                  // Update the selected video with new products
                  const updatedVideo = { ...selectedVideo, products };
                  setSelectedVideo(updatedVideo);
                }}
                isAdmin={isAdmin}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Shopping Cart Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-40"
          initial={{ scale: 0 }}
          animate={{ scale: cartItems.length > 0 ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <motion.button
            onClick={() => setShowCart(true)}
            className="relative bg-gradient-to-r from-gold to-gold/90 text-dark p-4 rounded-full shadow-2xl hover:shadow-gold/25 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </motion.button>
        </motion.div>

        {/* Shopping Cart */}
        <ProductShoppingCart
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      </div>
    </section>
  );
}