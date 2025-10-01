import HeroSection from "@/components/homePage/HeroSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
import CTASection from "@/components/homePage/CTASection";
import Featured from "@/components/homePage/Featured";

export default function page() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center">
        <HeroSection />
        <Featured />
        <CTASection />
      </div>
      <Footer />
    </>
  );
}
