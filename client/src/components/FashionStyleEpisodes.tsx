import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  ShoppingCart, 
  Heart, 
  Search, 
  Filter, 
  ChevronDown,
  Star,
  Clock,
  ShoppingBag,
  CreditCard,
  Eye,
  Check,
  AlertCircle,
  Palette,
  Lightbulb,
  Sofa,
  Tv,
  Coffee
} from "lucide-react";
import { Celebrity } from "@shared/schema";

interface FashionStyleEpisodesProps {
  celebrity: Celebrity;
}

interface ProductItem {
  id: number;
  name: string;
  price: string;
  compareRetailers?: string;
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  category: string;
  imageUrl: string;
  timestamp: string;
  colors?: string[];
  sizes?: string[];
  retailerLink: string;
  description: string;
}

const livingRoomProducts: ProductItem[] = [
  {
    id: 1,
    name: "West Elm Mid-Century Modern Sofa",
    price: "$1,299",
    compareRetailers: "Compare 5 retailers",
    availability: "In Stock",
    category: "Seating",
    imageUrl: "/assets/home/modern-sofa.jpg",
    timestamp: "02:13",
    colors: ["Charcoal", "Navy", "Cream"],
    retailerLink: "https://westelm.com",
    description: "Luxurious sectional sofa with premium velvet upholstery"
  },
  {
    id: 2,
    name: "CB2 Peekaboo Acrylic Coffee Table",
    price: "$699",
    availability: "Low Stock",
    category: "Tables",
    imageUrl: "/assets/home/coffee-table.jpg",
    timestamp: "03:45",
    retailerLink: "https://cb2.com",
    description: "Clear acrylic coffee table with modern aesthetic"
  },
  {
    id: 3,
    name: "Article Sven Charcoal Gray Rug",
    price: "$459",
    availability: "In Stock",
    category: "Textiles",
    imageUrl: "/assets/home/gray-rug.jpg",
    timestamp: "01:28",
    sizes: ["5x8", "8x10", "9x12"],
    retailerLink: "https://article.com",
    description: "Hand-woven wool rug with geometric pattern"
  },
  {
    id: 4,
    name: "West Elm Penelope Floor Lamp",
    price: "$329",
    availability: "In Stock",
    category: "Lighting",
    imageUrl: "/assets/home/floor-lamp.jpg",
    timestamp: "04:12",
    colors: ["Brass", "Black", "White"],
    retailerLink: "https://westelm.com",
    description: "Contemporary floor lamp with adjustable shade"
  },
  {
    id: 5,
    name: "Samsung 65\" QLED 4K Smart TV",
    price: "$2,199",
    availability: "In Stock",
    category: "Tech",
    imageUrl: "/assets/home/smart-tv.jpg",
    timestamp: "05:33",
    retailerLink: "https://samsung.com",
    description: "Premium 4K QLED television with smart features"
  },
  {
    id: 6,
    name: "Pottery Barn Logan Throw Pillows (Set of 3)",
    price: "$189",
    availability: "In Stock",
    category: "Textiles",
    imageUrl: "/assets/home/throw-pillows.jpg",
    timestamp: "02:45",
    colors: ["Ivory", "Sage", "Terracotta"],
    retailerLink: "https://potterybarn.com",
    description: "Luxurious down-filled throw pillows in premium fabric"
  }
];

const categoryFilters = [
  { id: "all", name: "All Items", icon: Eye },
  { id: "seating", name: "Seating", icon: Sofa },
  { id: "lighting", name: "Lighting", icon: Lightbulb },
  { id: "textiles", name: "Textiles", icon: Palette },
  { id: "tech", name: "Tech", icon: Tv },
  { id: "tables", name: "Tables", icon: Coffee }
];

const priceFilters = [
  { id: "all", name: "All Prices" },
  { id: "under-500", name: "Under $500" },
  { id: "500-1000", name: "$500 - $1,000" },
  { id: "1000-plus", name: "$1,000+" }
];

export default function FashionStyleEpisodes({ celebrity }: FashionStyleEpisodesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [budgetMode, setBudgetMode] = useState<"Budget" | "Mid" | "Luxury">("Mid");
  const [totalItems, setTotalItems] = useState(0);
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());
  const [currentTime, setCurrentTime] = useState("02:13");

  const filteredProducts = livingRoomProducts.filter(product => {
    if (selectedCategory !== "all" && product.category.toLowerCase() !== selectedCategory) {
      return false;
    }
    
    if (selectedPrice !== "all") {
      const price = parseInt(product.price.replace(/[^0-9]/g, ''));
      switch (selectedPrice) {
        case "under-500":
          return price < 500;
        case "500-1000":
          return price >= 500 && price <= 1000;
        case "1000-plus":
          return price > 1000;
      }
    }
    
    return true;
  });

  const totalPrice = filteredProducts.reduce((sum, product) => {
    return sum + parseInt(product.price.replace(/[^0-9]/g, ''));
  }, 0);

  const bundleDiscount = 0.15; // 15% bundle discount
  const bundlePrice = totalPrice * (1 - bundleDiscount);

  const handleSaveItem = (id: number) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedItems(newSaved);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Episode Masthead */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <Badge variant="outline" className="border-pink-400/30 text-pink-400 bg-pink-400/5 px-6 py-2 text-sm">
                Season 1: A-List Lifestyle
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Episode 03 — <span className="text-pink-400">Living Room Tour</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Step inside this stunning contemporary living space and discover every luxurious detail, 
                from the statement furniture to the carefully curated accessories.
              </p>
            </motion.div>
          </div>

          {/* Hero Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900 mb-8"
          >
            {/* Video placeholder with hotspots */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/30">
                  <Play className="w-8 h-8 text-pink-400 ml-1" />
                </div>
                <p className="text-gray-400">Living Room Tour Video</p>
              </div>
            </div>

            {/* Interactive Hotspots */}
            <motion.div
              className="absolute top-1/4 left-1/3 w-8 h-8 bg-pink-500/20 border-2 border-pink-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              whileHover={{ scale: 1.2 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                <div className="font-medium">Modern Sofa</div>
                <div className="text-pink-400">$1,299 • View</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-3/4 right-1/3 w-8 h-8 bg-pink-500/20 border-2 border-pink-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              whileHover={{ scale: 1.2 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                <div className="font-medium">Coffee Table</div>
                <div className="text-pink-400">$699 • View</div>
              </div>
            </motion.div>

            {/* Timestamp Chips */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Badge className="bg-black/50 text-white border border-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                As seen at 02:13
              </Badge>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button size="sm" variant="outline" className="bg-black/50 border-gray-600 hover:bg-black/70">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Smart Actions & Totals Bar */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-lg font-semibold">
                <span className="text-gray-400">Bundle Total:</span>{" "}
                <span className="text-2xl text-white">${bundlePrice.toLocaleString()}</span>
                <span className="text-sm text-green-400 ml-2">
                  (Save {Math.round(bundleDiscount * 100)}%)
                </span>
              </div>
              <Badge variant="outline" className="border-green-400/30 text-green-400 bg-green-400/5">
                <Check className="w-3 h-3 mr-1" />
                Free Shipping
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Buy the Entire Room
              </Button>
              <Button size="lg" variant="outline" className="border-pink-400/30 text-pink-400 hover:bg-pink-400/10">
                <ShoppingCart className="w-4 h-4 mr-2" />
                One-Click Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters and Budget Toggle */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-pink-400">Budget Preference</h3>
              <div className="flex flex-col gap-2">
                {(["Budget", "Mid", "Luxury"] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={budgetMode === mode ? "default" : "outline"}
                    className={`justify-start ${budgetMode === mode 
                      ? "bg-pink-500 hover:bg-pink-600" 
                      : "border-gray-700 hover:bg-gray-800"
                    }`}
                    onClick={() => setBudgetMode(mode)}
                  >
                    {mode === "Budget" && "💰"}
                    {mode === "Mid" && "⭐"}
                    {mode === "Luxury" && "✨"}
                    <span className="ml-2">{mode}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-pink-400">Room Zones</h3>
              <div className="space-y-2">
                {categoryFilters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <Button
                      key={filter.id}
                      variant={selectedCategory === filter.id ? "default" : "ghost"}
                      className={`w-full justify-start ${selectedCategory === filter.id 
                        ? "bg-pink-500/20 text-pink-400" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedCategory(filter.id)}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {filter.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-pink-400">Price Range</h3>
              <div className="space-y-2">
                {priceFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedPrice === filter.id ? "default" : "ghost"}
                    className={`w-full justify-start ${selectedPrice === filter.id 
                      ? "bg-pink-500/20 text-pink-400" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedPrice(filter.id)}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Styling Notes */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-pink-400">Styling Notes</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p>• Mix textures for visual interest</p>
                <p>• Maintain neutral color palette</p>
                <p>• Add metallic accents for luxury</p>
                <p>• Layer lighting for ambiance</p>
              </div>
            </div>
          </div>

          {/* Main Content - Product Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Shop This Episode
                <span className="text-pink-400 ml-2">({filteredProducts.length} items)</span>
              </h2>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-gray-700">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                <div className="text-sm text-gray-400">
                  Sort: Featured
                  <ChevronDown className="w-4 h-4 inline ml-1" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-pink-400/30 transition-colors group"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">{product.name}</p>
                      </div>
                    </div>
                    
                    {/* Timestamp Badge */}
                    <Badge className="absolute top-3 left-3 bg-black/70 text-white border-none">
                      <Clock className="w-3 h-3 mr-1" />
                      {product.timestamp}
                    </Badge>
                    
                    {/* Save Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className={`absolute top-3 right-3 w-8 h-8 p-0 ${
                        savedItems.has(product.id) 
                          ? "bg-pink-500 border-pink-500 text-white" 
                          : "bg-black/50 border-gray-600"
                      }`}
                      onClick={() => handleSaveItem(product.id)}
                    >
                      <Heart className={`w-4 h-4 ${savedItems.has(product.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400 mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-white group-hover:text-pink-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-white">{product.price}</div>
                      <Badge
                        variant={product.availability === "In Stock" ? "default" : "destructive"}
                        className={
                          product.availability === "In Stock" 
                            ? "bg-green-500/20 text-green-400 border-green-500/30" 
                            : product.availability === "Low Stock"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {product.availability}
                      </Badge>
                    </div>

                    {product.compareRetailers && (
                      <div className="text-xs text-pink-400 hover:underline cursor-pointer">
                        {product.compareRetailers}
                      </div>
                    )}

                    {/* Color/Size Options */}
                    {(product.colors || product.sizes) && (
                      <div className="space-y-2">
                        {product.colors && (
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Colors:</div>
                            <div className="flex gap-1">
                              {product.colors.map((color) => (
                                <div
                                  key={color}
                                  className="w-4 h-4 rounded-full border border-gray-600 bg-gray-700"
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {product.sizes && (
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Sizes:</div>
                            <div className="flex gap-1 flex-wrap">
                              {product.sizes.map((size) => (
                                <Badge key={size} variant="outline" className="text-xs border-gray-700">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button 
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={() => window.open(product.retailerLink, '_blank')}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Buy Now
                      </Button>
                      <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>

                    {/* Shipping Info */}
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                      Free shipping & returns • <span className="text-pink-400">As seen at {product.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            As an affiliate, Celecart may earn from qualifying purchases. 
            <span className="mx-4">•</span>
            <a href="#" className="text-pink-400 hover:underline">Disclosures</a>
            <span className="mx-2">•</span>
            <a href="#" className="text-pink-400 hover:underline">Privacy</a>
            <span className="mx-2">•</span>
            <a href="#" className="text-pink-400 hover:underline">Terms</a>
            <span className="mx-2">•</span>
            <a href="#" className="text-pink-400 hover:underline">Cookie Preferences</a>
          </p>
        </div>
      </div>
    </div>
  );
}