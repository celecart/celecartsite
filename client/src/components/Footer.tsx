import { Link } from "wouter";
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  ExternalLink 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark pt-12 pb-8 border-t border-lightgray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold font-playfair mb-4">
              <span className="text-gold tracking-wider">C</span>
              <span className="text-light tracking-wide">ELECART</span>
              <span className="ml-1 text-xs tracking-widest text-gold font-light uppercase vertical-align-middle">Celebrity Style</span>
            </h3>
            <p className="text-light/70 text-sm mb-6">Your premier destination for celebrity fashion insights and luxury brand discoveries.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-light hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-light hover:text-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-light hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-light hover:text-gold transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-light font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#featured" className="text-light/70 hover:text-gold transition-colors">
                  Featured Celebrities
                </Link>
              </li>
              <li>
                <Link href="/#celebrities" className="text-light/70 hover:text-gold transition-colors">
                  Popular Brands
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="text-light/70 hover:text-gold transition-colors">
                  Style Categories
                </Link>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Fashion Events</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Trending Looks</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-light font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Our Team</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Press</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-light font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Copyright Information</a>
              </li>
              <li>
                <a href="#" className="text-light/70 hover:text-gold transition-colors">Affiliate Disclosure</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-lightgray/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-light/60 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} <span className="text-gold">C</span>ELECART. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-light/60 hover:text-gold text-sm transition-colors">Privacy</a>
            <a href="#" className="text-light/60 hover:text-gold text-sm transition-colors">Terms</a>
            <a href="#" className="text-light/60 hover:text-gold text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
