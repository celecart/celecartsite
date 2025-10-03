import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
  brandLogo: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Fawad Khan",
    role: "Actor & Fashion Icon",
    quote: "Celecart has transformed the way I discover premium brands and keep up with evolving fashion trends. The curated collections perfectly align with my personal style preferences.",
    image: "/assets/celebrities/fawad_khan.png",
    rating: 5,
    brandLogo: "/assets/trending/canali-logo.png"
  },
  {
    id: 2,
    name: "Blake Lively",
    role: "Actress & Style Influencer",
    quote: "As someone constantly in the spotlight, Celecart helps me stay ahead of fashion trends while maintaining my authentic style. It's my go-to resource for red carpet inspiration.",
    image: "/assets/celebrities/blake_lively.jpg",
    rating: 5,
    brandLogo: "/assets/trending/bulgari-logo.png"
  },
  {
    id: 3,
    name: "Roger Federer",
    role: "Tennis Champion",
    quote: "Whether on or off the court, Celecart provides me with the perfect balance of athletic functionality and premium style. It's my personal fashion consultant.",
    image: "/assets/celebrities/roger_federer.jpg", 
    rating: 5,
    brandLogo: "/assets/trending/nike-logo.png"
  }
];

// Top brand logos for the infinite carousel
const brandLogos = [
  "/assets/trending/bulgari-logo.png",
  "/assets/trending/canali-logo.png",
  "/assets/trending/nike-logo.png",
  "/assets/trending/everlast-logo.png",
  "/assets/trending/creed-logo.png",
  "/assets/trending/rare-beauty-logo.png",
  "/assets/trending/balenciaga-logo.png",
  "/assets/trending/dyson-logo.png",
  "/assets/trending/louis-vuitton-logo.png",
  "/assets/trending/skkn-logo.png",
];

export default function CelebrityTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentTestimonial]);
  
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
    }),
  };
  
  // Create a doubled array for the continuous carousel effect
  const doubledLogos = [...brandLogos, ...brandLogos];
  
  return (
    <section className="py-20 bg-dark relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {/* Infinite scrolling brand logos */}
      <div className="relative mb-20 overflow-hidden bg-darkgray/30 py-12">
        <div className="mb-12 text-center">
          <h3 className="text-xl font-playfair font-bold text-light mb-2">Trusted by Elite Brands</h3>
          <p className="text-light/60 text-sm max-w-lg mx-auto">
            Celecart partners with the world's most prestigious brands to bring you authentic celebrity style
          </p>
        </div>
        
        <motion.div 
          className="flex items-center gap-16 py-2"
          animate={{ x: [0, -1 * (brandLogos.length * 180)] }}
          transition={{ 
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear"
          }}
        >
          {doubledLogos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 w-32 h-16 bg-midgray/20 rounded-lg backdrop-blur-sm flex items-center justify-center p-4">
              <img 
                src={logo} 
                alt="Brand logo" 
                className="max-w-full max-h-full object-contain mix-blend-luminosity opacity-80 hover:opacity-100 hover:mix-blend-normal transition-all filter grayscale hover:grayscale-0"
                onError={(e) => {
                  e.currentTarget.src = "/assets/trending/placeholder-logo.png";
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Celebrity Testimonials"
          subtitle="Hear directly from influencers who inspire global fashion trends"
          align="center"
        />
        
        <div className="mt-16 max-w-5xl mx-auto">
          {/* Testimonial carousel */}
          <div className="relative bg-midgray/30 backdrop-blur-sm rounded-xl p-6 md:p-10 border border-gold/10 shadow-xl overflow-hidden">
            <div className="absolute top-8 right-8 text-gold/20">
              <Quote className="w-20 h-20 rotate-180" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center min-h-[350px]">
              {/* Image column */}
              <div className="md:col-span-2 relative">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={testimonials[currentTestimonial].id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="w-full"
                  >
                    <div className="rounded-xl overflow-hidden border-2 border-gold/20 shadow-lg shadow-gold/5 bg-dark aspect-[3/4] max-w-[300px] mx-auto">
                      <img 
                        src={testimonials[currentTestimonial].image} 
                        alt={testimonials[currentTestimonial].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Content column */}
              <div className="md:col-span-3">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={testimonials[currentTestimonial].id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                  >
                    <div className="mb-6">
                      {/* Star rating */}
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < testimonials[currentTestimonial].rating ? 'text-gold fill-gold' : 'text-light/30'}`} 
                          />
                        ))}
                      </div>
                      
                      <blockquote className="text-xl md:text-2xl text-light italic font-light leading-relaxed mb-8 font-playfair">
                        "{testimonials[currentTestimonial].quote}"
                      </blockquote>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-light font-playfair">
                            {testimonials[currentTestimonial].name}
                          </div>
                          <div className="text-light/70 text-sm">
                            {testimonials[currentTestimonial].role}
                          </div>
                        </div>
                        
                        <div className="h-12 w-auto">
                          <img 
                            src={testimonials[currentTestimonial].brandLogo}
                            alt="Brand"
                            className="h-full w-auto object-contain opacity-80"
                            onError={(e) => {
                              e.currentTarget.src = "/assets/trending/placeholder-logo.png";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation controls */}
                <div className="flex items-center justify-between mt-10">
                  <div className="flex items-center space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDirection(index > currentTestimonial ? 1 : -1);
                          setCurrentTestimonial(index);
                        }}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentTestimonial ? "bg-gold" : "bg-light/20 hover:bg-light/30"
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      size="icon"
                      variant="outline"
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full border-gold/30 text-gold hover:bg-gold/10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon"
                      variant="outline"
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full border-gold/30 text-gold hover:bg-gold/10"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
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