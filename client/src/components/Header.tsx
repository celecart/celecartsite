import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Filter, Award, Trophy, Dumbbell, Activity, FileText, User, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Celebrity } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { logger } from "@/lib/logger";
// removed GoogleSignIn import
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSportFilter, setActiveSportFilter] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoSubtitle, setLogoSubtitle] = useState<string>("Celebrity Style");
  const [featuredLabel, setFeaturedLabel] = useState<string>("Featured");
  const [celebritiesLabel, setCelebritiesLabel] = useState<string>("Celebrities");
  const [trendingLabel, setTrendingLabel] = useState<string>("Trending");
  const [brandsLabel, setBrandsLabel] = useState<string>("Brands");
  const [plansLabel, setPlansLabel] = useState<string>("Plans");
  const [celeWorldLabel, setCeleWorldLabel] = useState<string>("Cele World");
  const [aiStylistLabel, setAiStylistLabel] = useState<string>("AI Stylist");

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/auth/user', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
      if (response.ok) {
        setUser(null);
        window.location.reload();
      }
    } catch (err) {
      // ignore
    }
  };
  
  // Fetch all celebrities for search functionality
  const { data: celebrities } = useQuery<Celebrity[]>({
    queryKey: ["/api/celebrities"],
  });
  
  const filteredCelebrities = celebrities?.filter(celeb => {
    // Filter by search query
    const matchesQuery = celeb.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by sport category if active
    const matchesSport = !activeSportFilter || 
      (activeSportFilter === 'tennis' && celeb.profession?.toLowerCase().includes('tennis')) ||
      (activeSportFilter === 'boxing' && celeb.profession?.toLowerCase().includes('boxing')) ||
      (activeSportFilter === 'soccer' && celeb.profession?.toLowerCase().includes('soccer'));
    
    return matchesQuery && matchesSport;
  });
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Debug: log only in dev via logger
    logger.debug("Search query changed:", value);
  };
  
  const handleSelectCelebrity = (id: number) => {
    setSearchQuery("");
  };
  
  // Add scroll event listener to detect when header should be solid
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const ls = localStorage;
      const subtitle = ls.getItem("landingNavLogoSubtitle");
      if (subtitle && subtitle.trim().length > 0) setLogoSubtitle(subtitle);
      const featured = ls.getItem("landingNavFeaturedLabel");
      if (featured && featured.trim().length > 0) setFeaturedLabel(featured);
      const celebs = ls.getItem("landingNavCelebritiesLabel");
      if (celebs && celebs.trim().length > 0) setCelebritiesLabel(celebs);
      const trending = ls.getItem("landingNavTrendingLabel");
      if (trending && trending.trim().length > 0) setTrendingLabel(trending);
      const brands = ls.getItem("landingNavBrandsLabel");
      if (brands && brands.trim().length > 0) setBrandsLabel(brands);
      const plans = ls.getItem("landingNavPlansLabel");
      if (plans && plans.trim().length > 0) setPlansLabel(plans);
      const celeWorld = ls.getItem("landingNavCeleWorldLabel");
      if (celeWorld && celeWorld.trim().length > 0) setCeleWorldLabel(celeWorld);
      const aiStylist = ls.getItem("landingNavAIStylistLabel");
      if (aiStylist && aiStylist.trim().length > 0) setAiStylistLabel(aiStylist);
    } catch {}
  }, []);
  
  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      isScrolled 
        ? "bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-xl border-b border-amber-500/20 shadow-2xl" 
        : "bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-lg"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Clean Professional Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex flex-col items-start -ml-1 sm:-ml-2">
              <div className="text-2xl font-bold font-playfair tracking-wide">
                <span className="text-amber-400">C</span>
                <span className="text-white">ELECART</span>
              </div>
              <div className="mt-1 text-xs text-white/60 uppercase tracking-widest font-light">
                {logoSubtitle}
              </div>
            </Link>
          </div>
          
          {/* Premium Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm rounded-full p-2 border border-white/10">
              <a 
                href="#featured" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/#featured" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                {featuredLabel}
              </a>
              {/* Celebrities anchor hidden; keep All Celebrities link */}
              <Link 
                href="/celebrities" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10 ml-4 md:ml-6",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/celebrities" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                {celebritiesLabel}
              </Link>
              {/*
              <a 
                href="#celebrities" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/#celebrities" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                Celebrities
              </a>
              <Link 
                href="/celebrities" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/celebrities" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                All Celebrities
              </Link>
              */}
              <a 
                href="#trending" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  (location === "/#trending" || location === "/#spotlight") && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                {trendingLabel}
              </a>

              <Link 
                href="/brands" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/brands" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                {brandsLabel}
              </Link>
              <Link 
                href="/plans" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/plans" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                {plansLabel}
              </Link>
              <Link 
                href="/cele-world" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/cele-world" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                {celeWorldLabel}
              </Link>
              <Link 
                href="/ai-stylist" 
                className={cn(
                  "relative px-2 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10 mr-3 md:mr-5",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/ai-stylist" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                {aiStylistLabel}
              </Link>
            </div>
          </nav>
          
          {/* Premium Action Section */}
          <div className="flex items-center space-x-3">
            {/* Enhanced Celebrity Filter removed */}
            {/**
            <div className="hidden lg:block ml-3 md:ml-4 mr-2">
              ... filter dropdown removed ...
            </div>
            */}
            
            {/* Premium Search Bar */}
            <div className="relative hidden lg:block w-56">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-sm group-focus-within:blur-md transition-all duration-300"></div>
                <Input
                  type="text"
                  placeholder="Search celebrities..."
                  className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 py-3 pl-12 pr-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all duration-300"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-4 top-3.5 text-white/60 h-4 w-4 group-focus-within:text-amber-400 transition-colors duration-300" />
              </div>
              
              {/* Enhanced Search Results Dropdown */}
              <AnimatePresence>
                {searchQuery && filteredCelebrities && filteredCelebrities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute mt-3 w-full bg-black/90 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="text-xs uppercase tracking-wide text-amber-400 font-medium px-3 py-2 border-b border-white/10">
                        Search Results
                      </div>
                      <div className="py-1">
                        {filteredCelebrities.map(celeb => (
                          <Link 
                            key={celeb.id}
                            href={`/celebrity/${celeb.id}`}
                            className="block px-3 py-2 text-sm text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 rounded-lg transition-all duration-200"
                            onClick={() => handleSelectCelebrity(celeb.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
                              <span className="font-medium">{celeb.name}</span>
                              <span className="text-xs text-white/50 ml-auto">{celeb.profession}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Sign In / Profile */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.imageUrl || user.picture || user.avatarUrl} alt={user.name || user.email} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.imageUrl || user.picture || user.avatarUrl} alt={user.name || user.email} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{user.name || user.email}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <span className="flex items-center">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/add-blog">
                      <span className="flex items-center">
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Cele Blogs
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-amber-500 hover:bg-amber-600 text-black rounded-full px-4 py-2"
                >
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Premium Mobile Menu Button */}
            <button 
              className="lg:hidden relative p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/90 hover:text-amber-400 transition-all duration-300 backdrop-blur-sm" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="relative">
                {showMobileMenu ? (
                  <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-300" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gradient-to-b from-black via-gray-900 to-black backdrop-blur-xl border-t border-amber-500/20"
          >
            <div className="px-6 py-6 space-y-6">
              {/* Premium Mobile Search */}
              <div className="relative">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-sm group-focus-within:blur-md transition-all duration-300"></div>
                  <Input
                    type="text"
                    placeholder="Search celebrities..."
                    className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 py-3 pl-12 pr-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all duration-300"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <Search className="absolute left-4 top-3.5 text-white/60 h-4 w-4 group-focus-within:text-amber-400 transition-colors duration-300" />
                </div>
                
                {/* Enhanced Mobile Search Results */}
                {searchQuery && filteredCelebrities && filteredCelebrities.length > 0 && (
                  <div className="mt-3 w-full bg-black/90 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2">
                      <div className="text-xs uppercase tracking-wide text-amber-400 font-medium px-3 py-2 border-b border-white/10">
                        Search Results
                      </div>
                      <div className="py-1">
                        {filteredCelebrities.map(celeb => (
                          <Link 
                            key={celeb.id}
                            href={`/celebrity/${celeb.id}`}
                            className="block px-3 py-2 text-sm text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 rounded-lg transition-all duration-200"
                            onClick={() => {
                              handleSelectCelebrity(celeb.id);
                              setShowMobileMenu(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
                              <span className="font-medium">{celeb.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Premium Mobile Category Filters */}
              <div className="space-y-3">
                <h3 className="text-amber-400 text-sm font-medium tracking-wide">Filter Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {/*
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "text-xs border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-lg",
                      !activeSportFilter 
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-400/50" 
                        : "text-white/90 hover:text-amber-400"
                    )}
                    onClick={() => {
                      setActiveSportFilter(null);
                      setShowMobileMenu(false);
                    }}
                  >
                    <Trophy className="mr-2 h-3 w-3" />
                    All Celebrities
                  </Button>
                  */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "text-xs border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-lg",
                      activeSportFilter === "tennis" 
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-400/50" 
                        : "text-white/90 hover:text-amber-400"
                    )}
                    onClick={() => {
                      setActiveSportFilter("tennis");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Award className="mr-2 h-3 w-3" />
                    Tennis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "text-xs border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-lg",
                      activeSportFilter === "boxing" 
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-400/50" 
                        : "text-white/90 hover:text-amber-400"
                    )}
                    onClick={() => {
                      setActiveSportFilter("boxing");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Dumbbell className="mr-2 h-3 w-3" />
                    Boxing
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "text-xs border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-lg",
                      activeSportFilter === "soccer" 
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-400/50" 
                        : "text-white/90 hover:text-amber-400"
                    )}
                    onClick={() => {
                      setActiveSportFilter("soccer");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Activity className="mr-2 h-3 w-3" />
                    Soccer
                  </Button>
                </div>
              </div>
              
              {/* Premium Mobile Navigation Links */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <h3 className="text-amber-400 text-sm font-medium tracking-wide mb-4">Navigation</h3>
                <div className="space-y-2">
                  <a 
                    href="#featured"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {featuredLabel}
                  </a>
                  {/* Celebrities links removed */}
                  <Link 
                    href="/celebrities"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {celebritiesLabel}
                  </Link>
                  {/*
                  <a 
                    href="#celebrities"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Celebrities
                  </a>
                  <Link 
                    href="/celebrities"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    All Celebrities
                  </Link>
                  */}
                  <a 
                    href="#spotlight"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Spotlight
                  </a>
                  <a 
                    href="#trending"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {trendingLabel}
                  </a>

                  <Link 
                    href="/brands"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {brandsLabel}
                  </Link>
                  
                  <Link 
                    href="/plans"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {plansLabel}
                  </Link>
                  
                  <Link 
                    href="/cele-world"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {celeWorldLabel}
                  </Link>
                  <Link 
                    href="/ai-stylist"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {aiStylistLabel}
                  </Link>
                  
                  {/* Mobile Sign In / Profile */}
                  <div className="w-full flex items-center justify-between gap-4">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.imageUrl || user.picture || user.avatarUrl} alt={user.name || user.email} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm text-white/90">{user.name || user.email}</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 hover:text-amber-400 rounded-full"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Sign out
                        </Button>
                      </>
                    ) : (
                      <Link href="/login" className="w-full">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 hover:text-amber-400 rounded-full"
                        >
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
