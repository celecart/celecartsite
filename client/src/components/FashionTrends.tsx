import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, Clock, BarChart3, Zap, Instagram, 
  ShoppingBag, Share2, Heart, PlayCircle, ArrowRight, Twitter 
} from "lucide-react";

const trendingCategories = [
  {
    id: "celebrity",
    name: "Celebrity Impact",
    icon: <Instagram className="w-5 h-5 mr-2" />,
    color: "bg-pink-600",
    stats: {
      growth: "+347%",
      timeframe: "past month",
      description: "Average search volume increase after celebrity endorsement"
    },
    items: [
      {
        id: 1,
        name: "Rare Beauty Blush",
        celebrity: "Selena Gomez",
        impact: "14.7M TikTok videos",
        imageUrl: "/assets/trending/rare-beauty-blush.jpg"
      },
      {
        id: 2,
        name: "Bulgari Serpenti Bag",
        celebrity: "Blake Lively",
        impact: "320% search increase",
        imageUrl: "/assets/trending/bulgari-bag.jpg"
      },
      {
        id: 3,
        name: "Canali Italian Suits",
        celebrity: "Fawad Khan",
        impact: "189% sales growth",
        imageUrl: "/assets/trending/canali-suit.jpg"
      }
    ]
  },
  {
    id: "seasonal",
    name: "Seasonal Trends",
    icon: <Clock className="w-5 h-5 mr-2" />,
    color: "bg-blue-600",
    stats: {
      growth: "60%",
      timeframe: "season change",
      description: "Average consumer style shift with seasonal transitions"
    },
    items: [
      {
        id: 1,
        name: "Lightweight Trench Coats",
        celebrity: "Emma Watson",
        impact: "Spring essential",
        imageUrl: "/assets/trending/lv-neverfull.jpg"
      },
      {
        id: 2,
        name: "Pastel Color Palette",
        celebrity: "Kendall Jenner",
        impact: "Color trend of the season",
        imageUrl: "/assets/trending/dyson-airwrap.jpg"
      },
      {
        id: 3,
        name: "Tennis-inspired Outfits",
        celebrity: "Roger Federer",
        impact: "Court to casual transition",
        imageUrl: "/assets/trending/nike-tennis-jacket.jpg"
      }
    ]
  },
  {
    id: "viral",
    name: "Viral Sensations",
    icon: <Zap className="w-5 h-5 mr-2" />,
    color: "bg-purple-600", 
    stats: {
      growth: "24hrs",
      timeframe: "to sell out",
      description: "Average time for viral products to deplete global inventory"
    },
    items: [
      {
        id: 1,
        name: "SKKN Oil Drops",
        celebrity: "Kim Kardashian",
        impact: "Sold out in 2 hours",
        imageUrl: "/assets/products/skkn_oil_drops.jpg"
      },
      {
        id: 2,
        name: "Balenciaga Sneakers",
        celebrity: "Kylie Jenner",
        impact: "7.2M hashtag views",
        imageUrl: "/assets/trending/balenciaga-sneakers.jpg"
      },
      {
        id: 3,
        name: "Everlast Boxing Gloves",
        celebrity: "Floyd Mayweather",
        impact: "Fitness trend leader",
        imageUrl: "/assets/trending/everlast-gloves.jpg"
      }
    ]
  }
];

export default function FashionTrends() {
  const [activeCategory, setActiveCategory] = useState("celebrity");
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const selectedCategory = trendingCategories.find(category => category.id === activeCategory) || trendingCategories[0];
  
  // Parallax effect for background elements
  const rightCircleY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const leftCircleY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  // Counter animation for statistics
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        if (count < 95) {
          setCount(prev => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [count, isVisible]);
  
  return (
    <section className="py-24 bg-midgray relative overflow-hidden">
      {/* Decorative background elements with parallax */}
      <motion.div 
        className="absolute right-0 top-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl opacity-70"
        style={{ y: rightCircleY }}
      />
      <motion.div 
        className="absolute -left-24 bottom-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-60"
        style={{ y: leftCircleY }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center mb-3">
          <span className="px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-sm font-medium inline-flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            STYLE ANALYTICS
          </span>
        </div>
        
        <SectionHeading
          title="Fashion Trend Forecast"
          subtitle="Real-time insights into what's currently dominating the style landscape"
          align="center"
        />
        
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left column: Category selection and stats */}
          <div className="lg:col-span-1">
            <div className="bg-dark rounded-xl p-6 shadow-xl border border-gold/10 mb-8">
              <h3 className="text-xl font-bold text-light mb-4 font-playfair">Trending Categories</h3>
              
              <div className="space-y-3">
                {trendingCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all ${
                      activeCategory === category.id
                        ? "bg-gold/20 border border-gold/30"
                        : "bg-midgray/50 hover:bg-gold/10 border border-transparent"
                    }`}
                  >
                    <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center text-white mr-3`}>
                      {category.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-light">{category.name}</h4>
                      <p className="text-xs text-light/60">
                        {category.stats.growth} in {category.stats.timeframe}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Stats card */}
            <motion.div 
              className="bg-dark rounded-xl overflow-hidden shadow-xl border border-gold/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              onViewportEnter={() => setIsVisible(true)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-light font-playfair">Impact Metrics</h3>
                  <BarChart3 className="w-5 h-5 text-gold" />
                </div>
                
                <div className="flex items-end gap-4 mb-4">
                  <div className="text-5xl font-bold text-gold">{count}%</div>
                  <div className="text-sm text-light/70 pb-2">
                    of fashion purchases <br />
                    influenced by celebrities
                  </div>
                </div>
                
                <div className="h-2 bg-midgray/50 rounded-full mb-4">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full"
                    style={{ width: `${count}%` }}
                  />
                </div>
                
                <p className="text-sm text-light/70 mb-4">
                  {selectedCategory.stats.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-midgray/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-light mb-1">24M+</div>
                    <div className="text-xs text-light/70">Social media mentions</div>
                  </div>
                  <div className="bg-midgray/30 rounded-lg p-3">
                    <div className="text-2xl font-bold text-light mb-1">$47B</div>
                    <div className="text-xs text-light/70">Market influence</div>
                  </div>
                </div>
              </div>
              
              {/* Live animation for data feed */}
              <div className="px-6 py-3 bg-midgray/20 border-t border-gold/10">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <div className="text-xs text-light/70">
                    Live data • Updated 2 minutes ago
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column: Content area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured content section */}
            <div className="bg-dark rounded-xl overflow-hidden shadow-xl border border-gold/10">
              <div className="relative">
                <img 
                  src={`/assets/trending/${activeCategory}-banner.jpg`} 
                  alt={selectedCategory.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Fallback for missing images
                    e.currentTarget.src = "/assets/trending/trending-showcase.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <Badge className={`${selectedCategory.color} text-white`}>
                    {selectedCategory.name}
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="icon" variant="ghost" className="w-8 h-8 bg-dark/30 backdrop-blur-sm rounded-full text-light hover:text-gold">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-8 h-8 bg-dark/30 backdrop-blur-sm rounded-full text-light hover:text-gold">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-light mb-4 font-playfair">
                  {selectedCategory.name} Spotlight
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {selectedCategory.items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-midgray/30 rounded-lg overflow-hidden border border-gold/5 group hover:border-gold/20 transition-all"
                    >
                      <div className="relative h-32">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
                        <div className="absolute bottom-2 left-3 text-xs font-medium text-light">
                          {item.celebrity}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-light text-sm">{item.name}</h4>
                        <p className="text-xs text-light/70 mt-1 flex items-center">
                          <Zap className="w-3 h-3 text-gold mr-1" />
                          {item.impact}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-light/70">
                    Data sourced from social media engagement and retail analytics
                  </div>
                  <Button variant="outline" size="sm" className="text-gold border-gold/30 hover:bg-gold/10">
                    View Report <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Trend video feature */}
            <div className="bg-dark rounded-xl overflow-hidden shadow-xl border border-gold/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-light font-playfair">
                  Red Carpet Moments
                </h3>
                <Badge className="bg-red-600 text-white">LIVE UPDATES</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                  <div className="aspect-video bg-midgray/30">
                    <img 
                      src="/assets/trending/met-gala-video-thumb.jpg" 
                      alt="Met Gala Highlights" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for missing images
                        e.currentTarget.src = "/assets/trending/trending-showcase.png";
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-gold" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-dark to-transparent">
                    <h4 className="text-light font-medium text-sm">Met Gala 2025: Fashion Highlights</h4>
                    <p className="text-xs text-light/70">3.2M views</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-midgray/30 border border-gold/5 cursor-pointer hover:bg-gold/10 transition-all">
                    <div className="flex-shrink-0 w-12 h-12 bg-midgray/50 rounded overflow-hidden">
                      <img 
                        src="/assets/trending/canali-suit.jpg" 
                        alt="Filmfare Awards" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-light font-medium text-sm">Filmfare Awards: Best Dressed</h4>
                      <p className="text-xs text-light/70">1.7M views • 2 days ago</p>
                    </div>
                    <PlayCircle className="w-6 h-6 text-gold ml-auto" />
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-midgray/30 border border-gold/5 cursor-pointer hover:bg-gold/10 transition-all">
                    <div className="flex-shrink-0 w-12 h-12 bg-midgray/50 rounded overflow-hidden">
                      <img 
                        src="/assets/trending/bulgari-bag.jpg" 
                        alt="Celebrity Bags" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-light font-medium text-sm">Celebrity Bag Collection 2025</h4>
                      <p className="text-xs text-light/70">988K views • 1 week ago</p>
                    </div>
                    <PlayCircle className="w-6 h-6 text-gold ml-auto" />
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-midgray/30 border border-gold/5 cursor-pointer hover:bg-gold/10 transition-all">
                    <div className="flex-shrink-0 w-12 h-12 bg-midgray/50 rounded overflow-hidden">
                      <img 
                        src="/assets/products/skkn_oil_drops.jpg" 
                        alt="Beauty Trends" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-light font-medium text-sm">Spring Beauty Trends</h4>
                      <p className="text-xs text-light/70">2.4M views • 3 days ago</p>
                    </div>
                    <PlayCircle className="w-6 h-6 text-gold ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}