import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCelebrity from "@/components/FeaturedCelebrity";
import CelebrityGallery from "@/components/CelebrityGallery";
import BrandsSection from "@/components/BrandsSection";
import ExploreSection from "@/components/ExploreSection";
import TournamentSection from "@/components/TournamentSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import TrendingProducts from "@/components/TrendingProducts";
import TrendingSpotlight from "@/components/TrendingSpotlight";
import AnimatedBrandAds from "@/components/AnimatedBrandAds";
import CelebrityTestimonials from "@/components/CelebrityTestimonials";

import { useState } from "react";
import { Brand } from "@shared/schema";
import BrandModal from "@/components/BrandModal";

export default function Home() {
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const handleOpenBrandModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowBrandModal(true);
  };

  const handleCloseBrandModal = () => {
    setShowBrandModal(false);
  };

  return (
    <div className="bg-darkgray min-h-screen">
      <Header />
      <Hero />
      <div id="featured">
        <FeaturedCelebrity onBrandClick={handleOpenBrandModal} />
      </div>
      <div id="celebrities">
        <CelebrityGallery />
      </div>
      
      <div id="trending">
        <TrendingSpotlight />
        <TrendingProducts />
      </div>
      
      {/* Enhanced Fashion Trends with Animated Brand Ads */}
      <div id="fashion-trends">
        <AnimatedBrandAds />
      </div>
      
      <div id="testimonials">
        <CelebrityTestimonials />
      </div>

      <div id="brands">
        <BrandsSection onBrandClick={handleOpenBrandModal} />
      </div>
      
      
      <TournamentSection />
      <div id="explore">
        <ExploreSection />
      </div>
      <Newsletter />
      <Footer />
      {showBrandModal && selectedBrand && (
        <BrandModal brand={selectedBrand} onClose={handleCloseBrandModal} />
      )}
    </div>
  );
}
