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
    console.log("Search query changed to:", value);
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
  
  return (
    <header className={cn(
      "fixed w-full z-50 transition-all duration-500",
      isScrolled 
        ? "bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-xl border-b border-amber-500/20 shadow-2xl" 
        : "bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-lg"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Clean Professional Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              <div className="text-2xl font-bold font-playfair tracking-wide">
                <span className="text-amber-400">C</span>
                <span className="text-white">ELECART</span>
              </div>
              <div className="ml-3 text-xs text-white/60 uppercase tracking-widest font-light">
                Celebrity Style
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
                Featured
              </a>
              {/* Celebrities anchor hidden; keep All Celebrities link */}
              <Link 
                href="/celebrities" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/celebrities" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                Celebrities
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
                Trending
              </a>

              <a 
                href="#brands" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/#brands" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                Brands
              </a>
              <Link 
                href="/plans" 
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10",
                  "text-white/90 hover:text-amber-400 uppercase tracking-wide",
                  location === "/plans" && "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                )}
              >
                Plans
              </Link>
            </div>
          </nav>
          
          {/* Premium Action Section */}
          <div className="flex items-center space-x-3">
            {/* Enhanced Celebrity Filter */}
            <div className="hidden lg:block mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 text-white/90 hover:text-amber-400 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="text-xs uppercase font-medium tracking-wide">
                      {activeSportFilter ? activeSportFilter : "All Celebrities"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-black/90 backdrop-blur-xl border border-amber-500/20 rounded-xl p-2 shadow-2xl"
                >
                  <DropdownMenuLabel className="text-amber-400 font-medium px-3 py-2">
                    Filter by Category
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10 my-2" />
                  <DropdownMenuItem 
                    className={cn(
                      "text-white/90 hover:text-amber-400 focus:text-amber-400 cursor-pointer rounded-lg px-3 py-2 transition-all duration-200", 
                      !activeSportFilter && "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 font-medium"
                    )}
                    onClick={() => setActiveSportFilter(null)}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>Celebrities</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={cn(
                      "text-white/90 hover:text-amber-400 focus:text-amber-400 cursor-pointer rounded-lg px-3 py-2 transition-all duration-200", 
                      activeSportFilter === "tennis" && "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 font-medium"
                    )}
                    onClick={() => setActiveSportFilter("tennis")}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    <span>Tennis</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={cn(
                      "text-white/90 hover:text-amber-400 focus:text-amber-400 cursor-pointer rounded-lg px-3 py-2 transition-all duration-200", 
                      activeSportFilter === "boxing" && "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 font-medium"
                    )}
                    onClick={() => setActiveSportFilter("boxing")}
                  >
                    <Dumbbell className="mr-2 h-4 w-4" />
                    <span>Boxing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={cn(
                      "text-white/90 hover:text-amber-400 focus:text-amber-400 cursor-pointer rounded-lg px-3 py-2 transition-all duration-200", 
                      activeSportFilter === "soccer" && "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 font-medium"
                    )}
                    onClick={() => setActiveSportFilter("soccer")}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    <span>Soccer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Premium Search Bar */}
            <div className="relative hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-sm group-focus-within:blur-md transition-all duration-300"></div>
                <Input
                  type="text"
                  placeholder="Search celebrities..."
                  className="relative bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 py-3 pl-12 pr-4 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-all duration-300"
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
                    Featured
                  </a>
                  {/* Celebrities links removed */}
                  <Link 
                    href="/celebrities"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Celebrities
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
                    Trending
                  </a>

                  <a 
                    href="#brands"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Brands
                  </a>
                  
                  <Link 
                    href="/plans"
                    className="flex items-center px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-orange-500/20 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 text-sm font-medium uppercase tracking-wide"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Plans
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
